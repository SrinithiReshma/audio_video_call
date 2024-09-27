"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sendSMSNotification } from "@/lib/actions/appointment.actions";

export const CreateCallModal = ({
  appointment, // Accept appointment as a prop
}: {
  appointment: { patient: { userId: string } }; // Define the shape of appointment
}) => {
  const [open, setOpen] = useState(false);
  const [callInfo, setCallInfo] = useState<{
    channelName: string;
    token: string;
  }>({
    channelName: "",
    token: "",
  });

  const handleCreateCall = async () => {
    try {
      const response = await fetch("/api/generateToken");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCallInfo(data);
      setOpen(true); // Open the dialog when data is received
    } catch (error) {
      console.error("Error generating token:", error);
    }
  };

  const handleSendMessage = async () => {
    const userId = appointment.patient.userId; // Access userId from appointment
    //const messageContent = `Your call has been created. Channel: ${callInfo.channelName}, Token: ${callInfo.token}`;
    const messageContent = `Your call has been created. Click the link to join: ${window.location.origin}/join-call.html?channel=${encodeURIComponent(callInfo.channelName)}&token=${encodeURIComponent(callInfo.token)}`;
    try {
      // Send the SMS notification
      await sendSMSNotification(userId, messageContent);
      alert("SMS sent successfully!");
    } catch (error) {
      console.error("An error occurred while sending the SMS:", error);
      alert("Failed to send SMS.");
    }
  };
  const handleJoinCall = () => {
    const url = new URL("/join-call.html", window.location.origin);
    url.searchParams.append("channel", callInfo.channelName);
    url.searchParams.append("token", callInfo.token);
    window.location.href = url.toString();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" onClick={handleCreateCall}>
          Create Call
        </Button>
      </DialogTrigger>
      <DialogContent
        className="custom-dialog-content"
        style={{
          maxWidth: "500px", // Adjust the max width as needed
          overflow: "auto", // Prevents overflow of content
          whiteSpace: "nowrap", // Ensures long tokens break within the container
          padding: "20px", // Adds padding for a better look
        }}
      >
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle>Call Created</DialogTitle>
          <DialogDescription>
            The call has been successfully created with the following details:
          </DialogDescription>
        </DialogHeader>
        <div style={{ marginTop: "10px", wordWrap: "break-word" }}>
          <p>
            <strong>Channel:</strong> {callInfo.channelName}
          </p>
        </div>
        <div style={{ marginTop: "10px", wordWrap: "break-word" }}>
          <p>
            <strong>Token:</strong> {callInfo.token}
          </p>
        </div>
        <Button
          variant="outline"
          style={{ marginTop: "20px", width: "100%" }}
          onClick={handleSendMessage}
        >
          Send Message
        </Button>
        <Button
          variant="outline"
          style={{ marginTop: "10px", width: "100%" }}
          onClick={handleJoinCall}
        >
          Join Call
        </Button>
      </DialogContent>
    </Dialog>
  );
};
