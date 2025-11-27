'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RemoteUser,
  UID,
  useClientEvent,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  useRTCClient,
} from "agora-rtc-react";
import { MicrophoneButton } from "./MicrophoneButton";
import type {
  AgentResponse,
  ClientStartRequest,
  ConversationComponentProps,
  StopConversationRequest,
} from "@/types/conversation";

export default function ConversationComponent({
  agoraLocalUserInfo,
  onTokenWillExpire,
  onEndConversation,
}: ConversationComponentProps) {
  const client = useRTCClient();
  const isConnected = useIsConnected();
  const remoteUsers = useRemoteUsers();

  const [joinedUID, setJoinedUID] = useState<UID | null>(null);
  const [isAgentConnected, setIsAgentConnected] = useState(false);
  const [isConnectingAgent, setIsConnectingAgent] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(
    agoraLocalUserInfo.agentId ?? null
  );

  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isMicEnabled);

  const agentUID = useMemo(
    () => (process.env.NEXT_PUBLIC_AGENT_UID ?? "Agent").toString(),
    []
  );

  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID ?? "";

  const { isConnected: joinSuccess } = useJoin(
    {
      appid: appId,
      channel: agoraLocalUserInfo.channel,
      token: agoraLocalUserInfo.token,
      uid: parseInt(agoraLocalUserInfo.uid, 10) || 0,
    },
    Boolean(appId && agoraLocalUserInfo.channel && agoraLocalUserInfo.token)
  );

  usePublish(localMicrophoneTrack ? [localMicrophoneTrack] : []);

  useEffect(() => {
    if (joinSuccess && client) {
      setJoinedUID(client.uid as UID);
    }
  }, [joinSuccess, client]);

  useEffect(() => {
    setAgentId(agoraLocalUserInfo.agentId ?? null);
  }, [agoraLocalUserInfo.agentId]);

  useClientEvent(client, "user-joined", (user) => {
    if (user.uid?.toString() === agentUID) {
      setIsAgentConnected(true);
      setIsConnectingAgent(false);
    }
  });

  useClientEvent(client, "user-left", (user) => {
    if (user.uid?.toString() === agentUID) {
      setIsAgentConnected(false);
      setIsConnectingAgent(false);
    }
  });

  useEffect(() => {
    const agentPresent = remoteUsers.some(
      (user) => user.uid?.toString() === agentUID
    );
    setIsAgentConnected(agentPresent);
  }, [remoteUsers, agentUID]);

  const renewToken = useCallback(async () => {
    if (!joinedUID) {
      return;
    }

    try {
      const nextToken = await onTokenWillExpire(joinedUID.toString());
      await client?.renewToken(nextToken);
      console.info("Agora token renewed successfully");
    } catch (error) {
      console.error("Failed to renew Agora token", error);
    }
  }, [client, joinedUID, onTokenWillExpire]);

  useClientEvent(client, "token-privilege-will-expire", renewToken);

  useEffect(() => {
    return () => {
      client?.leave();
    };
  }, [client]);

  const handleStopAgent = useCallback(async () => {
    if (!agentId) {
      return;
    }

    setIsConnectingAgent(true);
    try {
      const payload: StopConversationRequest = { agent_id: agentId };
      const response = await fetch("/api/stop-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Stop agent request failed with ${response.status}`);
      }

      setIsAgentConnected(false);
    } catch (error) {
      console.error("Failed to stop AI agent", error);
    } finally {
      setIsConnectingAgent(false);
    }
  }, [agentId]);

  const handleStartAgent = useCallback(async () => {
    if (!joinedUID) {
      return;
    }

    setIsConnectingAgent(true);
    try {
      const payload: ClientStartRequest = {
        requester_id: joinedUID.toString(),
        channel_name: agoraLocalUserInfo.channel,
        input_modalities: ["text"],
        output_modalities: ["text", "audio"],
      };

      const response = await fetch("/api/invite-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Invite agent request failed with ${response.status}`);
      }

      const data: AgentResponse = await response.json();
      setAgentId(data.agent_id);
      setIsAgentConnected(true);
    } catch (error) {
      console.error("Failed to start AI agent", error);
    } finally {
      setIsConnectingAgent(false);
    }
  }, [agoraLocalUserInfo.channel, joinedUID]);

  const handleLeaveConversation = useCallback(async () => {
    await handleStopAgent();
    await client?.leave();
    onEndConversation();
  }, [client, handleStopAgent, onEndConversation]);

  return (
    <div className="flex min-h-[480px] flex-col gap-6 rounded-lg bg-gray-900/60 p-6 text-white">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-3 w-3 rounded-full ${
              isConnected ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm font-medium">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={isAgentConnected ? handleStopAgent : handleStartAgent}
            disabled={isConnectingAgent}
            className={`rounded-full px-4 py-2 text-sm font-medium shadow transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              isAgentConnected
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isConnectingAgent
              ? "Please wait..."
              : isAgentConnected
              ? "Disconnect Agent"
              : "Connect Agent"}
          </button>

          <button
            type="button"
            onClick={handleLeaveConversation}
            className="rounded-full bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600"
          >
            Leave Conversation
          </button>
        </div>
      </header>

      <section className="flex-1 space-y-4 overflow-y-auto rounded-md bg-gray-950/40 p-4">
        {remoteUsers.length === 0 ? (
          <p className="text-sm text-gray-400">
            {isConnected
              ? "Waiting for remote participants..."
              : "Connecting to the channel..."}
          </p>
        ) : (
          remoteUsers.map((user) => (
            <div key={user.uid?.toString()} className="rounded-lg bg-gray-800/50 p-4">
              <p className="mb-2 text-sm text-gray-300">
                {user.uid?.toString() === agentUID ? "AI Agent" : `User ${user.uid}`}
              </p>
              <RemoteUser user={user} />
            </div>
          ))
        )}
      </section>

      <footer className="flex items-center justify-center">
        <MicrophoneButton
          isEnabled={isMicEnabled}
          setIsEnabled={setIsMicEnabled}
          localMicrophoneTrack={localMicrophoneTrack ?? null}
        />
      </footer>
    </div>
  );
}
