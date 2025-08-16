import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../utils/api";
import moment from "moment";
import AuctionCard from "../components/AuctionCard"; // New component

const Dashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    minBid: "",
    maxBid: ""
  });

  const fetchAuctions = async () => {
    try {
      const { data } = await api.get("/auctions", { params: filters });
      setAuctions(data);
    } catch (err) {
      console.error("Error fetching auctions:", err);
    }
  };

  useEffect(() => { fetchAuctions(); }, [filters]);

  return (
    <Container className="my-5">
      <h2 className="mb-4">Discover Auctions</h2>
      
      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Control
                placeholder="Search auctions..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </Col>
            <Col md={2}>
              <Form.Select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="Min Bid"
                value={filters.minBid}
                onChange={(e) => setFilters({...filters, minBid: e.target.value})}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="Max Bid"
                value={filters.maxBid}
                onChange={(e) => setFilters({...filters, maxBid: e.target.value})}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Auction Grid */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {auctions.map(auction => (
          <Col key={auction._id}>
            <AuctionCard auction={auction} />
          </Col>
        ))}
      </Row>

      {auctions.length === 0 && (
        <div className="text-center py-5">
          <h4 className="text-muted">No auctions found matching your criteria</h4>
        </div>
      )}
    </Container>
  );
};

export default Dashboard;
