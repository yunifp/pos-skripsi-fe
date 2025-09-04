import React from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const NotificationDetail = ({ notification, onBack }) => {
  if (!notification) return null;

  return (
    <div className="bg-white p-12 rounded-xl shadow lg:mt-20">
      <h2 className="font-bold mb-4">Notification Detail</h2>
      <Button variant="button1" onClick={onBack} className="mb-6">
         <FontAwesomeIcon icon={faArrowLeft} />
      </Button>
      <div className="mb-6">
        <p className="mb-3"><strong>Date:</strong> {new Date(notification.date).toLocaleDateString()}</p>
        <p><strong>Message:</strong> {notification.message}</p>
      </div>
    </div>
  );
};

export default NotificationDetail;
