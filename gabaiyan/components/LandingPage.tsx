'use client';

import { Suspense, useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type {
  AgentResponse,
  AgoraLocalUserInfo,
  ClientStartRequest,
} from "@/types/conversation";

const AgoraProvider = dynamic(() =>
  import("agora-rtc-react").then(({ AgoraRTCProvider, default: AgoraRTC }) => {
    const Provider = ({ children }: { children: React.ReactNode }) => {
      const client = useMemo(
        () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
        []
      );

      return <AgoraRTCProvider client={client}>{children}</AgoraRTCProvider>;
    };

    return { default: Provider };
  }),
{ ssr: false }
);

const ConversationComponent = dynamic(() => import("./ConversationComponent"), {
  ssr: false,
  loading: () => <p className="text-center text-sm text-gray-400">Preparing conversation...</p>,
});

export default function LandingPage() {
  const [showConversation, setShowConversation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentJoinError, setAgentJoinError] = useState(false);
  const [agoraLocalUserInfo, setAgoraLocalUserInfo] =
    useState<AgoraLocalUserInfo | null>(null);

  const handleStartConversation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAgentJoinError(false);

    try {
      const tokenResponse = await fetch("/api/generate-agora-token");
      const tokenData = (await tokenResponse.json()) as AgoraLocalUserInfo;

      if (!tokenResponse.ok) {
        throw new Error("Failed to generate Agora token");
      }

      let agentId: string | undefined;

      try {
        const startRequest: ClientStartRequest = {
          requester_id: tokenData.uid,
          channel_name: tokenData.channel,
          input_modalities: ["text"],
          output_modalities: ["text", "audio"],
        };

        const agentResponse = await fetch("/api/invite-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(startRequest),
        });

        if (!agentResponse.ok) {
          throw new Error(`Agent invite failed with ${agentResponse.status}`);
        }

        const agentData: AgentResponse = await agentResponse.json();
        agentId = agentData.agent_id;
      } catch (agentError) {
        console.warn("Unable to connect AI agent", agentError);
        setAgentJoinError(true);
      }

      setAgoraLocalUserInfo({ ...tokenData, agentId });
      setShowConversation(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start conversation";
      setError(message);
      console.error("Start conversation error", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTokenWillExpire = useCallback(
    async (uid: string) => {
      if (!agoraLocalUserInfo?.channel) {
        throw new Error("Channel information missing for token refresh");
      }

      const response = await fetch(
        `/api/generate-agora-token?channel=${encodeURIComponent(
          agoraLocalUserInfo.channel
        )}&uid=${encodeURIComponent(uid)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to refresh Agora token");
      }

      setAgoraLocalUserInfo((prev) =>
        prev ? { ...prev, token: data.token ?? prev.token } : prev
      );

      return data.token as string;
    },
    [agoraLocalUserInfo?.channel]
  );

  const handleEndConversation = useCallback(async () => {
    const currentAgentId = agoraLocalUserInfo?.agentId;

    if (currentAgentId) {
      try {
        await fetch("/api/stop-conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent_id: currentAgentId }),
        });
      } catch (error) {
        console.warn("Failed to stop AI agent on conversation end", error);
      }
    }

    setShowConversation(false);
    setAgoraLocalUserInfo(null);
    setAgentJoinError(false);
  }, [agoraLocalUserInfo?.agentId]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Agora Conversational AI Demo
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Start a real-time voice conversation with an AI agent powered by Agora.
          </p>
        </header>

        {!showConversation && (
          <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
            <button
              type="button"
              onClick={handleStartConversation}
              disabled={isLoading}
              className="rounded-full bg-blue-600 px-6 py-3 text-lg font-semibold shadow-lg transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Starting..." : "Start Conversation"}
            </button>
            {error && <p className="text-center text-sm text-red-400">{error}</p>}
          </div>
        )}

        {showConversation && agoraLocalUserInfo && (
          <div className="flex flex-col gap-4">
            {agentJoinError && (
              <p className="rounded-md bg-red-500/20 px-4 py-2 text-center text-sm text-red-300">
                The AI agent could not join. You can retry from within the session.
              </p>
            )}
            <Suspense
              fallback={
                <p className="text-center text-sm text-gray-400">
                  Loading conversation experience...
                </p>
              }
            >
              <AgoraProvider>
                <ConversationComponent
                  agoraLocalUserInfo={agoraLocalUserInfo}
                  onTokenWillExpire={handleTokenWillExpire}
                  onEndConversation={handleEndConversation}
                />
              </AgoraProvider>
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
