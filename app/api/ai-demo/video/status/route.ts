import { getVideoTaskStatus } from "@/lib/ai/video";
import { apiResponse } from "@/lib/api-response";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    return apiResponse.badRequest("taskId is required");
  }

  const task = getVideoTaskStatus(taskId);
  if (!task) {
    return apiResponse.notFound("Task not found");
  }

  return apiResponse.success({
    taskId: task.taskId,
    status: task.status,
    videoUrl: task.videoUrl,
    error: task.error,
  });
}
