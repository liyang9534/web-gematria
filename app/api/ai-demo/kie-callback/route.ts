import { fetchKIETaskResult } from "@/lib/ai/adapters/kie-video";
import { taskStore } from "@/lib/ai/task-store";

/**
 * KIE Webhook Callback Handler
 *
 * KIE sends a POST when a task completes:
 * { code: 200 | 501, msg: "...", data: { taskId: "kie_task_xxx" } }
 *
 * On receiving the callback, we:
 * 1. Look up the internal taskId by the KIE taskId
 * 2. Fetch the actual result from KIE recordInfo API
 * 3. Update the task store
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const kieTaskId = body?.data?.taskId;

    if (!kieTaskId) {
      return Response.json({ error: "Missing taskId" }, { status: 400 });
    }

    console.log(`[KIE Callback] Received for task: ${kieTaskId}, code: ${body.code}`);

    // Look up internal task by KIE external ID
    const task = taskStore.getByExternalId(kieTaskId);
    if (!task) {
      console.warn(`[KIE Callback] No internal task found for KIE taskId: ${kieTaskId}`);
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    // Task already completed (e.g. duplicate callback)
    if (task.status === "succeeded" || task.status === "failed") {
      return Response.json({ ok: true });
    }

    // KIE callback code 501 = generation failed
    if (body.code === 501) {
      taskStore.update(task.taskId, {
        status: "failed",
        error: body.msg || "KIE generation failed",
      });
      return Response.json({ ok: true });
    }

    // Fetch actual result from KIE recordInfo API
    const result = await fetchKIETaskResult(kieTaskId);

    if (result.status === "succeeded" && result.videoUrl) {
      taskStore.update(task.taskId, {
        status: "succeeded",
        videoUrl: result.videoUrl,
      });
    } else if (result.status === "failed") {
      taskStore.update(task.taskId, {
        status: "failed",
        error: result.error || "KIE generation failed",
      });
    }
    // If still processing, do nothing — KIE will send another callback

    return Response.json({ ok: true });
  } catch (error: any) {
    console.error("[KIE Callback] Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
