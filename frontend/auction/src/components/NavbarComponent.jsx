import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import "../components/styles.css"; // Import custom CSS

const NavbarComponent = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="https://cdn-icons-png.flaticon.com/512/726/726476.png"
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          Auction App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {!user ? (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
              <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
            </Nav>
          ) : (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/post-auction">Post Auction</Nav.Link>
                <Nav.Link as={Link} to="/watchlist">Watchlist</Nav.Link>
                <Nav.Link as={Link} to="/notifications">Notifications</Nav.Link>
               <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              </Nav>
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
