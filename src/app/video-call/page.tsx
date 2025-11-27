"use client";

import VideoCall from '@/components/agora/VideoCall';

export default function VideoCallPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Video Call</h1>
        <VideoCall 
          channel="test-channel" 
          uid={Math.floor(Math.random() * 10000)}
        />
      </div>
    </div>
  );
}