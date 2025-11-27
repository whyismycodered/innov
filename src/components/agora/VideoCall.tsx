"use client";

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAgora } from '@/hooks/useAgora';
import { IAgoraRTCRemoteUser } from '@/lib/agora';

interface VideoCallProps {
  channel: string;
  uid?: string | number;
}

export default function VideoCall({ channel, uid }: VideoCallProps) {
  const localVideoRef = useRef<HTMLDivElement>(null);
  const {
    localVideoTrack,
    remoteUsers,
    isJoined,
    isLoading,
    error,
    join,
    leave
  } = useAgora({ channel, uid });

  // Display local video
  useEffect(() => {
    if (localVideoTrack && localVideoRef.current) {
      localVideoRef.current.innerHTML = '';
      localVideoRef.current.textContent = `Local user ${uid || 0}`;
      localVideoRef.current.style.width = "640px";
      localVideoRef.current.style.height = "480px";
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoTrack, uid]);

  return (
    <div className="p-4">
      {error && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded">
          Error: {error}
        </div>
      )}

      <div className="mb-4 space-x-4">
        <Button
          onClick={join}
          disabled={isLoading || isJoined}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Joining...' : 'Join'}
        </Button>
        
        <Button
          onClick={leave}
          disabled={isLoading || !isJoined}
          variant="destructive"
        >
          {isLoading ? 'Leaving...' : 'Leave'}
        </Button>
      </div>

      <div className="space-y-4">
        {/* Local video */}
        <div 
          ref={localVideoRef}
          className="border border-gray-300 bg-gray-100"
        />

        {/* Remote videos */}
        {remoteUsers.map((user) => (
          <RemoteUser key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
}

// Display remote video
function RemoteUser({ user }: { user: IAgoraRTCRemoteUser }) {
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user.videoTrack && remoteVideoRef.current) {
      remoteVideoRef.current.innerHTML = '';
      remoteVideoRef.current.textContent = `Remote user ${user.uid}`;
      remoteVideoRef.current.style.width = "640px";
      remoteVideoRef.current.style.height = "480px";
      user.videoTrack.play(remoteVideoRef.current);
    }
  }, [user.videoTrack, user.uid]);

  return (
    <div 
      ref={remoteVideoRef}
      className="border border-gray-300 bg-gray-100"
    />
  );
}