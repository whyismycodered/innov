'use client';

import { useState } from "react";
import type { IMicrophoneAudioTrack } from "agora-rtc-react";
import { Mic, MicOff } from "lucide-react";

interface MicrophoneButtonProps {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  localMicrophoneTrack: IMicrophoneAudioTrack | null;
}

export function MicrophoneButton({
  isEnabled,
  setIsEnabled,
  localMicrophoneTrack,
}: MicrophoneButtonProps) {
  const [isBusy, setIsBusy] = useState(false);

  const toggleMicrophone = async () => {
    if (!localMicrophoneTrack || isBusy) {
      return;
    }

    setIsBusy(true);
    try {
      const nextEnabled = !isEnabled;
      await localMicrophoneTrack.setEnabled(nextEnabled);
      setIsEnabled(nextEnabled);
    } catch (error) {
      console.error("Failed to toggle microphone", error);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleMicrophone}
      disabled={!localMicrophoneTrack || isBusy}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        isEnabled ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"
      }`}
    >
      {isEnabled ? <Mic size={16} /> : <MicOff size={16} />}
      {isBusy ? "Please wait" : isEnabled ? "Mute" : "Unmute"}
    </button>
  );
}
