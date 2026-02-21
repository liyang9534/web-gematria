import { NextResponse } from "next/server";
import { validateWebhook } from "replicate";
import { taskStore } from "@/lib/ai/task-store";

export async function POST(request: Request) {
  try {
    const secret = process.env.REPLICATE_WEBHOOK_SIGNING_SECRET;
    if (secret) {
      const isValid = await validateWebhook(request.clone(), secret);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 401 }
        );
      }
    }

    const prediction = await request.json();

    const url = new URL(request.url);
    const taskId = url.searchParams.get("taskId");

    if (!taskId) {
      console.warn("[Replicate Webhook] No taskId in URL");
      return NextResponse.json({ received: true });
    }

    if (prediction.status === "succeeded") {
      const output = prediction.output;
      const videoUrl = Array.isArray(output)
        ? output[0]
        : typeof output === "string"
          ? output
          : null;

      taskStore.update(taskId, {
        status: "succeeded",
        videoUrl: videoUrl || undefined,
        externalId: prediction.id,
      });
    } else if (
      prediction.status === "failed" ||
      prediction.status === "canceled"
    ) {
      taskStore.update(taskId, {
        status: "failed",
        error:
          typeof prediction.error === "string"
            ? prediction.error
            : JSON.stringify(prediction.error),
        externalId: prediction.id,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[Replicate Webhook] Error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
