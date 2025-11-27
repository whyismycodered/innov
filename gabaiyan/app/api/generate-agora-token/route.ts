import { NextRequest, NextResponse } from "next/server";
import { RtcRole, RtcTokenBuilder } from "agora-token";

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

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID;
const APP_CERTIFICATE = getEnv("AGORA_APP_CERTIFICATE", "NEXT_PUBLIC_AGORA_APP_CERTIFICATE");
const STATIC_TOKEN = process.env.AGORA_STATIC_TOKEN;
const STATIC_CHANNEL = process.env.AGORA_STATIC_CHANNEL;
const STATIC_UID = process.env.AGORA_STATIC_UID;
const EXPIRATION_TIME_IN_SECONDS = 60 * 60; // 1 hour

function createChannelName(): string {
  const stamp = Date.now().toString(36);
  const entropy = Math.random().toString(36).slice(2, 8);
  return `ai-conversation-${stamp}-${entropy}`;
}

export async function GET(request: NextRequest) {
  if (STATIC_TOKEN) {
    if (!STATIC_CHANNEL || !STATIC_UID) {
      return NextResponse.json(
        {
          error:
            "Static token mode requires AGORA_STATIC_CHANNEL and AGORA_STATIC_UID to be set.",
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const channelParam = searchParams.get("channel");
    const uidParam = searchParams.get("uid");

    if (channelParam && channelParam !== STATIC_CHANNEL) {
      return NextResponse.json(
        {
          error: `Static token is only valid for channel "${STATIC_CHANNEL}", but received "${channelParam}".`,
        },
        { status: 400 }
      );
    }

    const uidToUse = STATIC_UID ?? uidParam ?? "0";

    return NextResponse.json({
      token: STATIC_TOKEN,
      uid: uidToUse.toString(),
      channel: STATIC_CHANNEL,
    });
  }

  if (!APP_ID || !APP_CERTIFICATE) {
    return NextResponse.json(
      { error: "Agora credentials are not configured." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const uidParam = searchParams.get("uid");
  const channelParam = searchParams.get("channel");

  const uid = Number.isFinite(Number(uidParam)) ? Number(uidParam) : 0;
  const channelName = channelParam || createChannelName();
  const expireAt = Math.floor(Date.now() / 1000) + EXPIRATION_TIME_IN_SECONDS;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      expireAt,
      expireAt
    );

    return NextResponse.json({ token, uid: uid.toString(), channel: channelName });
  } catch (error) {
    console.error("Failed to build Agora token", error);
    return NextResponse.json(
      { error: "Failed to generate Agora token" },
      { status: 500 }
    );
  }
}
