// pages/api/create-video-call.js

import axios from "axios";

const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmFwcGVhci5pbiIsImF1ZCI6Imh0dHBzOi8vYXBpLmFwcGVhci5pbi92MSIsImV4cCI6OTAwNzE5OTI1NDc0MDk5MSwiaWF0IjoxNzI1OTA1NTU3LCJvcmdhbml6YXRpb25JZCI6MjY3ODA3LCJqdGkiOiJmNGJiNmUxMy0xODExLTQ1NzQtOTAyYi0yMjgxYzQyZTVlODgifQ.241gW8pKsycQXmK3-akPSnUzw9MJeYdZh29yy6zY27g"; // Replace with your actual API key

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const expiryTime = new Date(
        Date.now() + 2 * 60 * 60 * 1000,
      ).toISOString();

      const response = await axios.post(
        "https://api.whereby.dev/v1/meetings",
        {
          endDate: expiryTime,
          fields: ["hostRoomUrl"],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      const roomData = response.data;
      res.status(200).json({ roomUrl: roomData.hostRoomUrl }); // Return the room URL
    } catch (error) {
      console.error("Error creating the room:", error.message);
      res.status(500).json({ error: "Failed to create video call room" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
