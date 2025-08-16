import React from "react";
import { Container, Button, Image, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import heroImage from "../assets/images/2.jpg"; 

const LandingPage = () => {
  return (
    <Container className="text-center mt-5">
      <div className="mb-5">
        <h1 className="display-4">Welcome to the Auction App</h1>
        <p className="lead">The best place to buy and sell items through auctions.</p>
      </div>

      <Row className="justify-content-center mb-5">
        <Col md={6}> 
          <Image
            src={heroImage}
            alt="Auction Hero"
            fluid
            rounded
            className="shadow"
          />
        </Col>
      </Row>

      <div className="mt-4">
        <Button as={Link} to="/signin" variant="primary" className="m-2" size="lg">
          Sign In
        </Button>
        <Button as={Link} to="/signup" variant="secondary" className="m-2" size="lg">
          Sign Up
        </Button>
      </div>
    </Container>
  );
};

export default LandingPage;
