import React from 'react';
import { Card, Alert } from 'react-bootstrap';

const WinnerComponent = ({ winner, amount }) => {
  return (
    <Card className="mt-4 shadow-lg">
      <Card.Body>
        <Card.Title className="text-center mb-4">Auction Winner</Card.Title>
        <Alert variant="success" className="text-center">
          <strong>{winner}</strong> won the auction with a bid of <strong>${amount}</strong>.
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default WinnerComponent;