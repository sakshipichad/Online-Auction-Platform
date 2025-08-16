import React, { useState, useEffect } from "react";
import { Card, Button, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import { FaHeart, FaRegHeart, FaEye, FaGavel } from "react-icons/fa";
import api from "../utils/api";

const AuctionCard = ({ auction }) => {
  const [isWatched, setIsWatched] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isActive = auction.status === "active";
  const timeRemaining = moment(auction.endTime).fromNow();

  useEffect(() => {
    // Optionally preload watchlist status
    const fetchWatchlistStatus = async () => {
      try {
        const response = await api.get("/watchlist");
        const isItemWatched = response.data.some(item => item._id === auction._id);
        setIsWatched(isItemWatched);
      } catch (error) {
        console.error("Failed to fetch watchlist status", error);
      }
    };
    fetchWatchlistStatus();
  }, [auction._id]);

  const toggleWatchlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.post(`/watchlist/${auction._id}`);
      setIsWatched(prev => !prev);
    } catch (err) {
      console.error("Failed to update watchlist", err);
    }
  };

  return (
    <Card
      className={`h-100 shadow-sm transition-all ${isHovered ? "shadow-lg" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ border: "none", borderRadius: "15px", overflow: "hidden" }}
    >
      <div className="position-relative">
        {auction.image && (
          <Card.Img
            variant="top"
            src={`http://localhost:3000/${auction.image}`}
            alt={auction.title}
            style={{ height: "280px", objectFit: "cover", width: "100%" }}
          />
        )}
        <div className="position-absolute top-0 end-0 m-2">
          <OverlayTrigger
            placement="left"
            overlay={<Tooltip>{isWatched ? "Remove from watchlist" : "Add to watchlist"}</Tooltip>}
          >
            <Button
              variant="light"
              className="rounded-circle p-2"
              onClick={toggleWatchlist}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
            >
              {isWatched ? <FaHeart className="text-danger" /> : <FaRegHeart className="text-danger" />}
            </Button>
          </OverlayTrigger>
        </div>
        <div className="position-absolute bottom-0 start-0 w-100 p-2" style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
        }}>
          <Badge
            bg={isActive ? "success" : "danger"}
            className="fs-6 fw-normal px-3 py-2"
            style={{ borderRadius: "50px" }}
          >
            {isActive ? (
              <span className="d-flex align-items-center">
                <span className="pulse-dot me-2"></span>
                LIVE
              </span>
            ) : "ENDED"}
          </Badge>
        </div>
      </div>

      <Card.Body className="d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0" style={{ fontSize: "1.25rem", fontWeight: "600" }}>
            {auction.title}
          </Card.Title>
          <small className="text-muted d-flex align-items-center">
            <FaEye className="me-1" /> {auction.views || 0}
          </small>
        </div>

        <Card.Text
          className="mb-3 text-muted"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {auction.description}
        </Card.Text>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <small className="text-muted d-block">Current Bid</small>
              <h4 className="text-primary mb-0" style={{ fontWeight: "700" }}>
                ${auction.currentBid.toLocaleString()}
              </h4>
            </div>
            <Badge bg="light" text="dark" className="p-2 rounded-pill">
              <span className="d-flex align-items-center">
                <FaGavel className="me-1" />
                {auction.bids.length} {auction.bids.length === 1 ? "bid" : "bids"}
              </span>
            </Badge>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="text-muted">
              <span className="d-inline-block me-1">Ends</span>
              <span className="fw-semibold">{timeRemaining}</span>
            </small>
            {isActive && (
              <small className="text-danger fw-semibold">
                {moment(auction.endTime).diff(moment(), 'hours') < 24 && "Ending soon!"}
              </small>
            )}
          </div>

          <Button
            as={Link}
            to={`/auction/${auction._id}`}
            variant={isActive ? "primary" : "outline-primary"}
            className="w-100 py-2 fw-bold"
            style={{ borderRadius: "50px" }}
          >
            {isActive ? "Place Bid Now" : "View Auction Results"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AuctionCard;
