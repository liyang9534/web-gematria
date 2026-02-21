import { NextResponse } from "next/server";
import crypto from "crypto";
import { taskStore } from "@/lib/ai/task-store";

let jwksCache: { keys: any[]; fetchedAt: number } | null = null;
const JWKS_CACHE_TTL = 24 * 60 * 60 * 1000;

async function getJWKS(): Promise<any[]> {
  if (jwksCache && Date.now() - jwksCache.fetchedAt < JWKS_CACHE_TTL) {
    return jwksCache.keys;
  }
  const response = await fetch(
    "https://rest.alpha.fal.ai/.well-known/jwks.json"
  );
  const data = await response.json();
  jwksCache = { keys: data.keys, fetchedAt: Date.now() };
  return data.keys;
}

async function verifyFalSignature(
  request: Request,
  body: string
): Promise<boolean> {
  const requestId = request.headers.get("x-fal-request-id");
  const userId = request.headers.get("x-fal-user-id");
  const timestamp = request.headers.get("x-fal-timestamp");
  const signature = request.headers.get("x-fal-signature");

  if (!requestId || !userId || !timestamp || !signature) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) return false;

  const bodyHash = crypto.createHash("sha256").update(body).digest("hex");
  const message = `${requestId}\n${userId}\n${timestamp}\n${bodyHash}`;

  const keys = await getJWKS();
  for (const key of keys) {
    try {
      const publicKey = Buffer.from(key.x, "base64url");
      const verify = crypto.createVerify("ed25519");
      verify.update(message);
      if (verify.verify({ key: publicKey, format: "der", type: "raw" } as any, Buffer.from(signature, "base64"))) {
        return true;
      }
    } catch {
      continue;
    }
  }
  return false;
}

export async function POST(request: Request) {
  try {
    const body = await request.text();

    if (process.env.FAL_VERIFY_WEBHOOKS === "true") {
      const isValid = await verifyFalSignature(request, body);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(body);

    const url = new URL(request.url);
    const taskId = url.searchParams.get("taskId");

    if (!taskId) {
      console.warn("[fal.ai Webhook] No taskId in URL");
      return NextResponse.json({ received: true });
    }

    if (payload.status === "OK") {
      const videoUrl = payload.payload?.video?.url;
      taskStore.update(taskId, {
        status: "succeeded",
        videoUrl,
        externalId: payload.request_id,
      });
    } else {
      taskStore.update(taskId, {
        status: "failed",
        error: payload.error || "Unknown error from fal.ai",
        externalId: payload.request_id,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[fal.ai Webhook] Error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
