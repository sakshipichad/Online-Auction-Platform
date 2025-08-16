import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Badge, Button, Image, Spinner, Form } from 'react-bootstrap';
import api from '../utils/api';
import Confetti from 'react-confetti';
import moment from 'moment';
import { useSpring, animated } from '@react-spring/web'; // Import React Spring

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animation for profile picture (bounce effect)
  const [profilePicAnimation, setProfilePicAnimation] = useSpring(() => ({
    transform: 'scale(1)',
    config: { tension: 300, friction: 10 },
  }));

  // Animation for won auctions list (fade-in effect)
  const wonAuctionsAnimation = useSpring({
    opacity: wonAuctions.length > 0 ? 1 : 0,
    transform: wonAuctions.length > 0 ? 'translateY(0)' : 'translateY(20px)',
    delay: 200,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data.user);
        setWonAuctions(response.data.wonAuctions);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleCelebrate = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Show confetti for 5 seconds
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePhoto', file);

    setLoading(true);
    try {
      const response = await api.post('/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile({ ...profile, profilePicture: response.data.profilePicture });

      // Trigger profile picture animation (bounce effect)
      setProfilePicAnimation({ transform: 'scale(1.2)' });
      setTimeout(() => setProfilePicAnimation({ transform: 'scale(1)' }), 300); // Reset after bounce
    } catch (error) {
      console.error('Error uploading profile photo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200} // Increase the number of confetti pieces
          recycle={false} // Stop confetti after animation
          gravity={0.1} // Adjust gravity for slower fall
        />
      )}

      <h2 className="text-center mb-4">Profile</h2>

      {profile ? (
        <Card className="shadow-lg profile-card">
          <Card.Body>
            <div className="text-center">
              {/* Profile picture with bounce animation */}
              <animated.div style={profilePicAnimation}>
                <Image
                  src={`http://localhost:3000/${profile.profilePicture}`} // Use the full URL
                  roundedCircle
                  width={200}
                  height={200}
                  className="mb-3"
                  alt="Profile Picture"
                  onError={(e) => {
                    console.error("Image failed to load:", e.target.src); // Debugging: Log image loading errors
                    e.target.src = "https://via.placeholder.com/200"; // Fallback image
                  }}
                />
              </animated.div>

              {/* File upload input */}
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Upload Profile Photo</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileUpload}
                  disabled={loading}
                  accept="image/*"
                />
              </Form.Group>

              <h3>{profile.email}</h3>
              <p className="text-muted">
                Member since {moment(profile.joinedAt).format('MMMM YYYY')}
              </p>
            </div>

            <div className="mt-4">
              <h4>Won Auctions</h4>
              {wonAuctions.length === 0 ? (
                <p className="text-muted">No auctions won yet.</p>
              ) : (
                <animated.div style={wonAuctionsAnimation}>
                  <ListGroup>
                    {wonAuctions.map((auction) => (
                      <ListGroup.Item key={auction._id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{auction.title}</strong> - ${auction.currentBid}
                        </div>
                        <Button variant="success" size="sm" onClick={handleCelebrate}>
                          Celebrate 🎉
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </animated.div>
              )}
            </div>
          </Card.Body>
        </Card>
      ) : (
        <div className="text-center">
          <Spinner animation="border" /> {/* Use Spinner here */}
        </div>
      )}
    </Container>
  );
};

export default Profile;
