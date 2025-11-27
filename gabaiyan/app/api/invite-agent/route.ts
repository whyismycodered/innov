import { NextResponse } from "next/server";
import { RtcRole, RtcTokenBuilder } from "agora-token";
import {
  TTSVendor,
  type AgentResponse,
  type AgoraStartRequest,
  type ClientStartRequest,
  type TTSConfig,
} from "@/types/conversation";

interface AgoraConfig {
  baseUrl: string;
  appId: string;
  appCertificate: string;
  customerId: string;
  customerSecret: string;
  agentUid: string;
}

interface LLMConfig {
  url?: string;
  apiKey?: string;
  model?: string;
}

interface ModalitiesConfig {
  input: string[];
  output: string[];
}

function getEnv(name: string, ...fallbacks: string[]): string | undefined {
  const keys = [name, ...fallbacks];
  for (const key of keys) {
    const value = process.env[key] ?? process.env[key.toLowerCase()];
    if (value) {
      return value;
    }
  }
  return undefined;
}

function getAgoraConfig(): AgoraConfig {
  const config: AgoraConfig = {
    baseUrl:
      process.env.NEXT_PUBLIC_AGORA_CONVO_AI_BASE_URL?.replace(/\/$/, "") ?? "",
    appId: process.env.NEXT_PUBLIC_AGORA_APP_ID ?? "",
    appCertificate: getEnv("AGORA_APP_CERTIFICATE", "NEXT_PUBLIC_AGORA_APP_CERTIFICATE") ?? "",
    customerId: getEnv("AGORA_CUSTOMER_ID", "NEXT_PUBLIC_AGORA_CUSTOMER_ID") ?? "",
    customerSecret: getEnv("AGORA_CUSTOMER_SECRET", "NEXT_PUBLIC_AGORA_CUSTOMER_SECRET") ?? "",
    agentUid: (process.env.NEXT_PUBLIC_AGENT_UID ?? "Agent").toString(),
  };

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing Agora configuration values: ${missing.join(", ")}`);
  }

  return config;
}

function getLLMConfig(): LLMConfig {
  return {
    url: process.env.NEXT_PUBLIC_LLM_URL,
    apiKey: getEnv("LLM_API_KEY", "NEXT_PUBLIC_LLM_API_KEY"),
    model: process.env.NEXT_PUBLIC_LLM_MODEL,
  };
}

function getModalitiesConfig(): ModalitiesConfig {
  const input = process.env.NEXT_PUBLIC_INPUT_MODALITIES?.split(",").map((s) => s.trim()) ?? ["text"];
  const output = process.env.NEXT_PUBLIC_OUTPUT_MODALITIES?.split(",").map((s) => s.trim()) ?? [
    "text",
    "audio",
  ];
  return { input, output };
}

function getTTSConfig(vendor: TTSVendor): TTSConfig {
  if (vendor === TTSVendor.Microsoft) {
    return {
      vendor,
      params: {
        key: getEnv("AZURE_TTS_KEY", "NEXT_PUBLIC_MICROSOFT_TTS_KEY"),
        region: getEnv("AZURE_TTS_REGION", "NEXT_PUBLIC_MICROSOFT_TTS_REGION"),
        voice_name: getEnv("AZURE_TTS_VOICE_NAME", "NEXT_PUBLIC_MICROSOFT_TTS_VOICE_NAME"),
        rate: parseFloat(
          getEnv("AZURE_TTS_RATE", "NEXT_PUBLIC_MICROSOFT_TTS_RATE") ?? "1.0"
        ),
        volume: parseFloat(
          getEnv("AZURE_TTS_VOLUME", "NEXT_PUBLIC_MICROSOFT_TTS_VOLUME") ?? "100"
        ),
      },
    };
  }

  if (vendor === TTSVendor.ElevenLabs) {
    return {
      vendor,
      params: {
        key: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
        voice_id: process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID,
        model_id: process.env.NEXT_PUBLIC_ELEVENLABS_MODEL_ID,
      },
    };
  }

  throw new Error(`Unsupported TTS vendor: ${vendor}`);
}

function isStringUID(uid: string) {
  return /[A-Za-z]/.test(uid);
}

export async function POST(request: Request) {
  try {
    const agoraConfig = getAgoraConfig();
    const llmConfig = getLLMConfig();
    const modalitiesConfig = getModalitiesConfig();
    const ttsVendor =
      (process.env.NEXT_PUBLIC_TTS_VENDOR as TTSVendor | undefined) ?? TTSVendor.Microsoft;
    const ttsConfig = getTTSConfig(ttsVendor);

    const body: ClientStartRequest = await request.json();

    if (!body?.channel_name || !body?.requester_id) {
      throw new Error("Missing required requester information.");
    }

    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour

    const agentToken = RtcTokenBuilder.buildTokenWithUid(
      agoraConfig.appId,
      agoraConfig.appCertificate,
      body.channel_name,
      agoraConfig.agentUid,
      RtcRole.PUBLISHER,
      expiresAt,
      expiresAt
    );

    const requestPayload: AgoraStartRequest = {
      name: `conversation-${Date.now().toString(36)}`,
      properties: {
        channel: body.channel_name,
        token: agentToken,
        agent_rtc_uid: agoraConfig.agentUid,
        remote_rtc_uids: [body.requester_id],
        enable_string_uid: isStringUID(agoraConfig.agentUid),
        idle_timeout: 30,
        advanced_features: {
          enable_aivad: true,
        },
        asr: {
          language: "en-US",
          task: "conversation",
        },
        llm: {
          url: llmConfig.url,
          api_key: llmConfig.apiKey,
          greeting_message: "Hello! How can I help you today?",
          failure_message: "I ran into a problem. Please try again shortly.",
          system_messages: [
            {
              role: "system",
              content:
                "You are a helpful voice assistant who responds clearly and concisely in natural spoken language.",
            },
          ],
          max_history: 10,
          params: {
            model: llmConfig.model ?? "gpt-4o",
            max_tokens: 1024,
            temperature: 0.7,
            top_p: 0.95,
          },
          input_modalities: body.input_modalities ?? modalitiesConfig.input,
          output_modalities: body.output_modalities ?? modalitiesConfig.output,
        },
        vad: {
          silence_duration_ms: 480,
          speech_duration_ms: 15000,
          threshold: 0.5,
          interrupt_duration_ms: 160,
          prefix_padding_ms: 300,
        },
        tts: ttsConfig,
      },
    };

    const authorizationHeader = `Basic ${Buffer.from(
      `${agoraConfig.customerId}:${agoraConfig.customerSecret}`
    ).toString("base64")}`;

    const response = await fetch(
      `${agoraConfig.baseUrl}/${agoraConfig.appId}/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationHeader,
        },
        body: JSON.stringify(requestPayload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Agora Conversational AI API responded with ${response.status}: ${errorText}`);
    }

    const data: AgentResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to invite AI agent.";
    console.error("Invite agent error", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
