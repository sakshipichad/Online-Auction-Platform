import React, { useEffect, useState } from "react";
import { Container, ListGroup, Button } from "react-bootstrap";
import api from "../utils/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== notificationId)
      );
      console.log("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <Container>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ListGroup>
          {notifications.map((notification) => (
            <ListGroup.Item key={notification._id} className="d-flex justify-content-between align-items-center">
              {notification.message}
              <Button variant="success" size="sm" onClick={() => markAsRead(notification._id)}>
                Mark as Read
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default Notifications;
