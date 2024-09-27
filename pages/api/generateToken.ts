// pages/api/generateToken.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

const APP_ID = "36a8711c6a374888bf3de28263b4b482";
const APP_CERTIFICATE = "ac4a4eae979d47f9a423710e01bd5b59";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const channelName = `channel-${Math.random().toString(36).substr(2, 9)}`;
  const uid = req.query.uid ? parseInt(req.query.uid as string, 10) : 0;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs,
  );

  res.status(200).json({ channelName, token });
}
