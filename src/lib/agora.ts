import { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack
} from "agora-rtc-sdk-ng";

// Connection parameters
export const agoraConfig = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || "34dcb78d89c84631a8635406aef569ca",
  channel: "test-channel",
  token: null as string | null,
  uid: 0
};

// Initialize the AgoraRTC client (client-side only)
export const createAgoraClient = () => {
  if (typeof window === 'undefined') return null;
  const AgoraRTC = require('agora-rtc-sdk-ng');
  return AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
};

// Create local audio and video tracks (client-side only)
export const createLocalTracks = async () => {
  if (typeof window === 'undefined') throw new Error('Not in browser');
  const AgoraRTC = require('agora-rtc-sdk-ng');
  const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  return { audioTrack: localAudioTrack, videoTrack: localVideoTrack };
};

export type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack
};