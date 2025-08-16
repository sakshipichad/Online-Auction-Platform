import React, { useEffect, useState } from "react";
import { 
  Container, 
  Card, 
  Alert, 
  Row, 
  Col, 
  Badge,
  Button,
  ProgressBar,
  Spinner
} from "react-bootstrap";
import api from "../utils/api";
import { useSpring, animated } from '@react-spring/web';
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaEye, FaTrash, FaClock } from "react-icons/fa";
import moment from "moment";
import { Link } from "react-router-dom";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const response = await api.get("/watchlist");
        setWatchlist(response.data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        setError("Failed to load watchlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const removeFromWatchlist = async (itemId) => {
    try {
      await api.delete(`/watchlist/${itemId}`);
      setWatchlist(watchlist.filter(item => item._id !== itemId));
    } catch (err) {
      console.error("Error removing from watchlist:", err);
      setError("Failed to remove item from watchlist");
    }
  };

  const fadeInAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <animated.div style={fadeInAnimation}>
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold mb-0">
            <FaHeart className="text-danger me-2" />
            Your Watchlist
          </h1>
          <Badge pill bg="secondary" className="fs-6">
            {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>

        {error && (
          <Alert variant="danger" className="rounded-0">
            <FaHeart className="me-2" />
            {error}
          </Alert>
        )}

        {watchlist.length === 0 && !error ? (
          <Card className="text-center p-5 border-0 shadow-sm">
            <FaRegHeart size={48} className="text-muted mb-3 mx-auto" />
            <h3 className="mb-2">Your Watchlist is Empty</h3>
            <p className="text-muted mb-4">
              Save items you're interested in by clicking the heart icon
            </p>
            <Button variant="primary" as={Link} to="/auctions" className="px-4">
              Browse Auctions
            </Button>
          </Card>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {watchlist.map((item) => (
              <Col key={item._id}>
                <Card className="h-100 border-0 shadow-sm position-relative hover-shadow">
                  {/* Deal Badge */}
                  {item.status === "active" && (
                    <Badge 
                      pill 
                      bg="danger" 
                      className="position-absolute top-0 start-0 m-2 fs-6"
                    >
                      LIVE
                    </Badge>
                  )}

                  {/* Product Image */}
                  <div className="ratio ratio-16x9 bg-light">
                    <Card.Img
                      variant="top"
                      src={item.image ? `http://localhost:3000/${item.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
                      alt={item.title}
                      className="object-fit-contain p-2"
                    />
                  </div>

                  {/* Remove Button */}
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="position-absolute top-0 end-0 m-2 rounded-circle p-2"
                    onClick={() => removeFromWatchlist(item._id)}
                    aria-label="Remove from watchlist"
                  >
                    <FaTrash size={14} />
                  </Button>

                  <Card.Body className="d-flex flex-column">
                    {/* Product Title */}
                    <Card.Title className="mb-2">
                      <Link 
                        to={`/auctions/${item._id}`} 
                        className="text-decoration-none text-dark"
                      >
                        {item.title.length > 50 
                          ? `${item.title.substring(0, 50)}... `
                          : item.title}
                      </Link>
                    </Card.Title>

                    {/* Rating Stars */}
                    <div className="mb-2">
                      {[...Array(5)].map((_, i) => (
                        i < 4 ? (
                          <FaStar key={i} className="text-warning" />
                        ) : (
                          <FaRegStar key={i} className="text-warning" />
                        )
                      ))}
                      <span className="ms-1 small text-muted">(24)</span>
                    </div>

                    {/* Price */}
                    <div className="d-flex align-items-center mb-2">
                      <span className="fs-4 fw-bold text-primary me-2">
                        ${item.currentBid.toLocaleString()}
                      </span>
                      {item.currentBid > 100 && (
                        <Badge pill bg="light" text="success" className="fs-6">
                          -${Math.floor(item.currentBid * 0.2)} deal
                        </Badge>
                      )}
                    </div>

                    {/* Progress Bar for Bids */}
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">
                        {item.bids?.length || 0} bids placed
                      </small>
                      <ProgressBar 
                        now={Math.min((item.bids?.length || 0) * 10, 100)} 
                        variant="warning" 
                        className="mb-2" 
                        style={{ height: "6px" }}
                      />
                    </div>

                    {/* Time Left */}
                    <div className="mb-3">
                      <small className="text-muted d-block">
                        {item.status === "active" ? (
                          <>
                            <FaClock className="me-1" />
                            Ends {moment(item.endTime).fromNow()}
                          </>
                        ) : (
                          "Auction ended"
                        )}
                      </small>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto d-grid gap-2">
                      <Button 
                        variant="warning" 
                        as={Link} 
                        to={`/auctions/${item._id}`}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <FaEye className="me-2" />
                        {item.status === "active" ? "Place Bid" : "View Results"}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Add this to your CSS or style tag */}
      <style>{`
        .hover-shadow {
          transition: box-shadow 0.3s ease;
        }
        .hover-shadow:hover {
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
      `}</style>
    </animated.div>
  );
};

export default Watchlist;
