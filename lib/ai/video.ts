import { generateVideoWithReplicate } from "./adapters/replicate-video";
import { generateVideoWithFal } from "./adapters/fal-video";
import { taskStore } from "./task-store";

export interface VideoGenerationInput {
  prompt: string;
  provider: string;
  modelId: string;
  duration: number;
  image?: string;
  webhookUrl?: string;
  aspectRatio?: string;
  resolution?: string;
  negativePrompt?: string;
  cfgScale?: number;
  generateAudio?: boolean;
  cameraFixed?: boolean;
  seed?: number;
}

export interface VideoGenerationTask {
  taskId: string;
  status: "pending" | "processing" | "succeeded" | "failed";
  provider: string;
  modelId: string;
  /** Original job ID from the platform (Replicate prediction ID / fal request ID) */
  externalId: string;
  videoUrl?: string;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Submit a video generation task (async).
 * Returns a taskId; the client polls for results via /api/ai-demo/video/status?taskId=xxx.
 */
export async function submitVideoGeneration(
  input: VideoGenerationInput
): Promise<{ taskId: string }> {
  const taskId = crypto.randomUUID();
  const task: VideoGenerationTask = {
    taskId,
    status: "pending",
    provider: input.provider,
    modelId: input.modelId,
    externalId: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  taskStore.set(taskId, task);

  // Dispatch to the corresponding adapter (runs async, does not block the response)
  processVideoGeneration(taskId, input).catch((error) => {
    taskStore.update(taskId, {
      status: "failed",
      error: error.message,
    });
  });

  return { taskId };
}

/**
 * Query the status of a video generation task.
 */
export function getVideoTaskStatus(taskId: string): VideoGenerationTask | null {
  return taskStore.get(taskId);
}

/**
 * Internal: execute video generation (async)
 */
async function processVideoGeneration(
  taskId: string,
  input: VideoGenerationInput
): Promise<void> {
  taskStore.update(taskId, { status: "processing" });

  let result: { videoUrl: string; externalId: string };

  switch (input.provider) {
    case "replicate":
      result = await generateVideoWithReplicate(input);
      break;
    case "fal":
      result = await generateVideoWithFal(input);
      break;
    default:
      throw new Error(`Unsupported video provider: ${input.provider}`);
  }

  taskStore.update(taskId, {
    status: "succeeded",
    videoUrl: result.videoUrl,
    externalId: result.externalId,
  });
}
