import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Form,
  Alert,
  Spinner,
  Badge,
  Image,
  InputGroup,
  Stack,
} from "react-bootstrap";
import api from "../utils/api";
import moment from "moment";
import WinnerComponent from "../components/WinnerComponent";
import { FaDollarSign, FaGavel, FaComment, FaClock, FaFire, FaHeart } from "react-icons/fa";

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auctionRes, commentsRes] = await Promise.all([
          api.get(`/auctions/${id}`),
          api.get(`/comments/${id}`)
        ]);
        setAuction(auctionRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load auction details");
      }
    };
    
    fetchData();

    const timer = setInterval(() => {
      if (auction?.endTime) {
        const now = moment();
        const end = moment(auction.endTime);
        const diff = moment.duration(end.diff(now));
        
        setTimeLeft({
          days: Math.max(0, Math.floor(diff.asDays())),
          hours: Math.max(0, diff.hours()),
          minutes: Math.max(0, diff.minutes()),
          seconds: Math.max(0, diff.seconds())
        });
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [id, auction?.endTime]);

  const handlePlaceBid = async () => {
    if (!bidAmount || bidAmount <= auction.currentBid) {
      setError(`Bid must be higher than $${auction.currentBid}`);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/bids/${id}`, { amount: bidAmount });
      setAuction(response.data);
      setBidAmount("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await api.post(`/comments/${id}`, { text: commentText });
      setComments([...comments, response.data]);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment");
    }
  };

  if (!auction) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Local placeholder image for fallback
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f8f9fa'/%3E%3Ctext x='300' y='300' font-family='Arial' font-size='24' fill='%236c757d' text-anchor='middle' dominant-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";

  return (
    <Container className="my-5">
      <Row className="g-4">
        {/* Left Column - Image and Description */}
        <Col lg={6}>
          <Card className="border-0 shadow-lg overflow-hidden position-relative">
            {/* Favorite Button */}
            <Button 
              variant="link" 
              className="position-absolute top-0 end-0 m-3 z-1 p-0"
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <FaHeart 
                size={24} 
                color={isFavorite ? "#dc3545" : "rgba(255,255,255,0.8)"} 
                style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))" }}
              />
            </Button>

            {/* Auction Image */}
            <div className="ratio ratio-1x1 bg-light">
              <Image
                src={auction.image ? `http://localhost:3000/${auction.image}` : placeholderImage}
                alt={auction.title}
                className="object-fit-contain p-4"
                fluid
                onError={(e) => {
                  e.target.src = placeholderImage;
                }}
              />
            </div>

            {/* Title and Description */}
            <Card.Body>
              <h1 className="fw-bold mb-3">{auction.title}</h1>
              <p className="fs-5 text-muted">{auction.description}</p>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Auction Details */}
        <Col lg={6}>
          <div className="d-flex flex-column gap-4">
            {/* Auction Status */}
            <div className="d-flex justify-content-between align-items-center">
              <Badge
                bg={auction.status === "active" ? "danger" : "secondary"}
                className="fs-5 px-3 py-2 rounded-pill"
              >
                <FaFire className="me-2" />
                {auction.status === "active" ? "LIVE AUCTION" : "AUCTION ENDED"}
              </Badge>
              <div className="text-muted">
                <FaClock className="me-2" />
                {auction.status === "active"
                  ? `Ends ${moment(auction.endTime).fromNow()}`
                  : `Ended ${moment(auction.endTime).fromNow()}`}
              </div>
            </div>

            {/* Countdown Timer */}
            {auction.status === "active" && (
              <div className="bg-gradient-orange text-red rounded-4 p-4 shadow">
                <h5 className="text-center mb-3 text-uppercase">⏳ AUCTION ENDS IN</h5>
                <div className="d-flex justify-content-center gap-3">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center">
                      <div className="display-4 fw-bold bg-white bg-opacity-20 rounded-3 p-2 px-3">
                        {value.toString().padStart(2, '0')}
                      </div>
                      <small className="text-white opacity-75 text-uppercase">
                        {unit}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Bid Section */}
            <div className="bg-gradient-purple text-white rounded-4 p-4 shadow">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-light opacity-75">Current Bid</small>
                  <h2 className="mb-0 display-4 fw-bold">
                    <FaDollarSign className="me-2" />
                    {auction.currentBid.toLocaleString()}
                  </h2>
                </div>
                <div className="text-end">
                  <small className="text-light opacity-75">Total Bids</small>
                  <h2 className="mb-0 display-4 fw-bold">
                    <FaGavel className="me-2" />
                    {auction.bids.length}
                  </h2>
                </div>
              </div>
            </div>

            {/* Winner Display */}
            {auction.status === "ended" && auction.winner && (
              <WinnerComponent
                winner={auction.winner.email}
                amount={auction.currentBid}
              />
            )}

            {/* Bid Form */}
            {auction.status === "active" && (
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">Place Your Bid</h5>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        placeholder={`Minimum bid: $${auction.currentBid + 1}`}
                        min={auction.currentBid + 1}
                        step="1"
                        className="py-3"
                      />
                    </InputGroup>
                  </Form.Group>
                  <Button
                    onClick={handlePlaceBid}
                    disabled={loading}
                    variant="primary"
                    className="w-100 py-3"
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Place Bid"
                    )}
                  </Button>
                </Card.Body>
              </Card>
            )}

            {/* Bidding History */}
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h4 className="mb-3">Bidding History</h4>
                {auction.bids.length === 0 ? (
                  <p className="text-muted">No bids placed yet</p>
                ) : (
                  <ListGroup variant="flush">
                    {auction.bids.map((bid, index) => (
                      <ListGroup.Item
                        key={index}
                        className="d-flex justify-content-between align-items-center py-3 hover-effect"
                      >
                        <div>
                          <strong className="text-primary">
                            {bid.user?.email || "Anonymous"}
                          </strong>
                          <span className="text-muted mx-2">bid</span>
                          <span className="text-success fw-bold">
                            ${bid.amount.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-muted small">
                          {moment(bid.timestamp).format("MMM D, h:mm a")}
                        </span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>

            {/* Comments Section */}
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h4 className="mb-3">Comments</h4>
                {comments.length === 0 ? (
                  <p className="text-muted">No comments yet</p>
                ) : (
                  <ListGroup variant="flush">
                    {comments.map((comment, index) => (
                      <ListGroup.Item
                        key={index}
                        className="d-flex gap-3 py-3 hover-effect"
                      >
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 40, height: 40, flexShrink: 0 }}
                        >
                          {comment.user?.email?.[0]?.toUpperCase() || "A"}
                        </div>
                        <div>
                          <div className="d-flex justify-content-between mb-2">
                            <strong className="text-primary">
                              {comment.user?.email || "Anonymous"}
                            </strong>
                            <span className="text-muted small">
                              {moment(comment.timestamp).fromNow()}
                            </span>
                          </div>
                          <p className="mb-0">{comment.text}</p>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}

                {/* Add Comment Form */}
                <Form.Group className="mt-4">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add your comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="mb-3"
                  />
                  <Button
                    onClick={handleAddComment}
                    variant="primary"
                    className="w-100 py-3"
                  >
                    <FaComment className="me-2" />
                    Post Comment
                  </Button>
                </Form.Group>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Custom Styles */}
      <style>{`
        .bg-gradient-orange {
          background: linear-gradient(135deg, #FF6B6B 0%, #FF9F43 100%);
        }
        .bg-gradient-purple {
          background: linear-gradient(135deg, #8A2BE2 0%, #9932CC 100%);
        }
        .object-fit-contain {
          object-fit: contain !important;
        }
        .hover-effect {
          transition: all 0.2s ease;
        }
        .hover-effect:hover {
          background-color: rgba(0,0,0,0.03);
          transform: translateY(-1px);
        }
      `}</style>
    </Container>
  );
};

export default AuctionDetails;
