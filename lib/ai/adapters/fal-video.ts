import { fal } from "@fal-ai/client";
import type { VideoGenerationInput } from "../video";

// fal.ai client authenticates automatically via the FAL_KEY env variable

export async function generateVideoWithFal(
  input: VideoGenerationInput
): Promise<{ videoUrl: string; externalId: string }> {
  const falInput: Record<string, any> = {
    prompt: input.prompt,
    duration: input.duration,
  };

  // image-to-video: convert base64 to URL
  // fal.ai accepts URLs, not base64. Use fal.storage.upload or pass a data URI directly.
  if (input.image) {
    falInput.image_url = input.image;
  }

  // Advanced parameters
  if (input.aspectRatio) falInput.aspect_ratio = input.aspectRatio;
  if (input.resolution) falInput.resolution = input.resolution;
  if (input.negativePrompt) falInput.negative_prompt = input.negativePrompt;
  if (input.cfgScale !== undefined) falInput.cfg_scale = input.cfgScale;
  if (input.generateAudio !== undefined) falInput.generate_audio = input.generateAudio;
  if (input.cameraFixed !== undefined) falInput.camera_fixed = input.cameraFixed;
  if (input.seed !== undefined) falInput.seed = input.seed;

  // Use subscribe mode: auto-submit + poll for results
  const result = await fal.subscribe(input.modelId, {
    input: falInput,
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        console.log(`[fal.ai] ${input.modelId} processing...`);
      }
    },
  });

  const videoUrl = (result.data as any)?.video?.url;
  if (!videoUrl) {
    throw new Error("fal.ai did not return a valid video URL.");
  }

  return {
    videoUrl,
    externalId: result.requestId,
  };
}
