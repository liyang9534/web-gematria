import Replicate from "replicate";
import type { VideoGenerationInput } from "../video";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateVideoWithReplicate(
  input: VideoGenerationInput
): Promise<{ videoUrl: string; externalId: string }> {
  const replicateInput: Record<string, any> = {
    prompt: input.prompt,
    duration: input.duration,
  };

  // image-to-video: add reference image
  if (input.image) {
    replicateInput.start_image = input.image;
  }

  // Advanced parameters
  if (input.aspectRatio) replicateInput.aspect_ratio = input.aspectRatio;
  if (input.negativePrompt) replicateInput.negative_prompt = input.negativePrompt;
  if (input.cfgScale !== undefined) replicateInput.cfg_scale = input.cfgScale;
  if (input.generateAudio !== undefined) replicateInput.generate_audio = input.generateAudio;
  if (input.cameraFixed !== undefined) replicateInput.camera_fixed = input.cameraFixed;
  if (input.seed !== undefined) replicateInput.seed = input.seed;

  // Create prediction
  const prediction = await replicate.predictions.create({
    model: input.modelId as `${string}/${string}`,
    input: replicateInput,
    // Use webhook mode if a webhook URL is provided
    ...(input.webhookUrl && {
      webhook: input.webhookUrl,
      webhook_events_filter: ["completed"],
    }),
  });

  if (prediction.status === "failed") {
    throw new Error(`Replicate prediction failed: ${prediction.error}`);
  }

  // Synchronously wait for results (used when no webhook is configured)
  const finalPrediction = await replicate.wait(prediction);

  const output = finalPrediction.output;
  const videoUrl = Array.isArray(output)
    ? output[0]
    : typeof output === "string"
      ? output
      : null;

  if (!videoUrl || typeof videoUrl !== "string") {
    throw new Error("Replicate did not return a valid video URL.");
  }

  return {
    videoUrl,
    externalId: prediction.id,
  };
}
