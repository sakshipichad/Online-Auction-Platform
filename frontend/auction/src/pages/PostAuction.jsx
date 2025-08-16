
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../utils/api';

const PostAuction = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingBid: '',
    endTime: '',
    image: null, // Add image state
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.title || !formData.startingBid || !formData.endTime) {
      return 'All fields except description are required';
    }
    if (new Date(formData.endTime) < new Date()) {
      return 'End time must be in the future';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('startingBid', formData.startingBid);
      formDataToSend.append('endTime', formData.endTime);
      if (formData.image) {
        formDataToSend.append('image', formData.image); // Append the image file
      }

      const response = await api.post('/auctions', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type for file upload
        },
      });
      console.log("Auction created:", response.data); // Debugging: Log the response
      navigate('/dashboard');
    } catch (err) {
      console.error("Error creating auction:", err); // Debugging: Log the error
      setError(err.response?.data?.error || 'Failed to create auction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      <h2 className="text-center mb-4">Create New Auction</h2>
      <div className="card shadow-lg p-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Title</Form.Label>
            <Form.Control
              placeholder="Enter item title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe your item..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Starting Bid ($)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              placeholder="Enter starting bid"
              value={formData.startingBid}
              onChange={(e) => setFormData({ ...formData, startingBid: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              accept="image/*"
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 py-3"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Create Auction'}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default PostAuction;
