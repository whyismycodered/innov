import { useState, useEffect, useCallback } from 'react';
import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  createAgoraClient,
  createLocalTracks,
  agoraConfig
} from '@/lib/agora';

export interface UseAgoraProps {
  channel: string;
  uid?: string | number;
}

export const useAgora = ({ channel, uid }: UseAgoraProps) => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize client on mount
  useEffect(() => {
    const agoraClient = createAgoraClient();
    if (agoraClient) {
      setClient(agoraClient);
    }
  }, []);

  // Join channel and publish local media
  const join = useCallback(async () => {
    if (isJoined || !client) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Join channel
      await client.join(agoraConfig.appId, channel, agoraConfig.token, uid || agoraConfig.uid);
      
      // Create local tracks
      const { audioTrack, videoTrack } = await createLocalTracks();
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      
      // Publish local tracks
      await client.publish([audioTrack, videoTrack]);
      
      setIsJoined(true);
      console.log("Publish success!");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join channel');
    } finally {
      setIsLoading(false);
    }
  }, [client, channel, uid, isJoined]);

  // Leave channel and clean up
  const leave = useCallback(async () => {
    if (!isJoined || !client) return;
    
    setIsLoading(true);
    
    try {
      // Close local tracks
      if (localAudioTrack) localAudioTrack.close();
      if (localVideoTrack) localVideoTrack.close();
      
      // Leave channel
      await client.leave();
      
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setRemoteUsers([]);
      setIsJoined(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave channel');
    } finally {
      setIsLoading(false);
    }
  }, [client, localAudioTrack, localVideoTrack, isJoined]);

  // Toggle audio
  const toggleAudio = useCallback(async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!localAudioTrack.enabled);
    }
  }, [localAudioTrack]);

  // Toggle video
  const toggleVideo = useCallback(async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!localVideoTrack.enabled);
    }
  }, [localVideoTrack]);

  // Handle client events
  useEffect(() => {
    if (!client) return;
    
    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType);
      console.log("subscribe success");
      
      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
      
      setRemoteUsers(prev => {
        const existingUser = prev.find(u => u.uid === user.uid);
        if (existingUser) {
          return prev.map(u => u.uid === user.uid ? user : u);
        }
        return [...prev, user];
      });
    };

    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    };

    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    };

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-left', handleUserLeft);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-left', handleUserLeft);
    };
  }, [client]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isJoined) {
        leave();
      }
    };
  }, [isJoined, leave]);

  return {
    client,
    localAudioTrack,
    localVideoTrack,
    remoteUsers,
    isJoined,
    isLoading,
    error,
    join,
    leave,
    toggleAudio,
    toggleVideo
  };
};