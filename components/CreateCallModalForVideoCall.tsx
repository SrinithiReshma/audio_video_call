"use client";
import axios from "axios";
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

export const CreateCallModalForVideoCall = ({
  appointment,
}: {
  appointment: { patient: { userId: string } };
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoCallInfo, setVideoCallInfo] = useState<{
    roomUrl: string;
    roomName: string;
  }>({
    roomUrl: "",
    roomName: "",
  });

  const handleCreateVideoCall = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/create-video-call");
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.data;
      setVideoCallInfo({
        roomUrl: data.roomUrl,
        roomName: data.roomName,
      });
      setOpen(true);
    } catch (error) {
      console.error("Error creating video call:", error);
      alert("Failed to create video call.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendVideoCallMessage = async () => {
    const userId = appointment.patient.userId;
    const messageContent = `Your video call room has been created. Room: ${videoCallInfo.roomName}, URL: ${videoCallInfo.roomUrl}`;
    try {
      await sendSMSNotification(userId, messageContent);
      alert("SMS sent successfully!");
    } catch (error) {
      console.error("An error occurred while sending the SMS:", error);
      alert("Failed to send SMS.");
    }
  };

  const handleJoinVideoCall = () => {
    if (videoCallInfo.roomUrl) {
      window.open(videoCallInfo.roomUrl, "_blank");
    } else {
      alert("No room URL available.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          onClick={handleCreateVideoCall}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Video Call"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Video Call Created</DialogTitle>
          <DialogDescription>
            The video call room has been successfully created with the following
            details:
          </DialogDescription>
        </DialogHeader>
        <div>
          <p>
            <strong>Room Name:</strong> {videoCallInfo.roomName}
          </p>
          <p>
            <strong>Room URL:</strong> {videoCallInfo.roomUrl}
          </p>
        </div>
        <Button variant="outline" onClick={handleSendVideoCallMessage}>
          Send Message
        </Button>
        <Button variant="outline" onClick={handleJoinVideoCall}>
          Join Video Call
        </Button>
      </DialogContent>
    </Dialog>
  );
};
