import { NextResponse } from "next/server";
import type { StopConversationRequest } from "@/types/conversation";

interface AgoraRestConfig {
  baseUrl: string;
  appId: string;
  customerId: string;
  customerSecret: string;
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

function getConfig(): AgoraRestConfig {
  const config: AgoraRestConfig = {
    baseUrl:
      process.env.NEXT_PUBLIC_AGORA_CONVO_AI_BASE_URL?.replace(/\/$/, "") ?? "",
    appId: process.env.NEXT_PUBLIC_AGORA_APP_ID ?? "",
    customerId: getEnv("AGORA_CUSTOMER_ID", "NEXT_PUBLIC_AGORA_CUSTOMER_ID") ?? "",
    customerSecret:
      getEnv("AGORA_CUSTOMER_SECRET", "NEXT_PUBLIC_AGORA_CUSTOMER_SECRET") ?? "",
  };

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing Agora configuration values: ${missing.join(", ")}`);
  }

  return config;
}

export async function POST(request: Request) {
  try {
    const config = getConfig();
    const body: StopConversationRequest = await request.json();

    if (!body?.agent_id) {
      throw new Error("agent_id is required");
    }

    const authorizationHeader = `Basic ${Buffer.from(
      `${config.customerId}:${config.customerSecret}`
    ).toString("base64")}`;

    const response = await fetch(
      `${config.baseUrl}/${config.appId}/agents/${encodeURIComponent(body.agent_id)}/leave`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationHeader,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Agora Conversational AI API responded with ${response.status}: ${errorText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to stop AI conversation.";
    console.error("Stop conversation error", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
