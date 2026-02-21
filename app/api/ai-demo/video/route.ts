import { submitVideoGeneration } from "@/lib/ai/video";
import { VIDEO_MODELS } from "@/config/ai-models";
import { validateProviderKey } from "@/config/ai-providers";
import { apiResponse } from "@/lib/api-response";
import { z } from "zod";

const inputSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  provider: z.string().min(1),
  modelId: z.string().min(1),
  duration: z.number().min(1).max(15).default(5),
  image: z.string().optional(),
  aspectRatio: z.string().optional(),
  resolution: z.string().optional(),
  negativePrompt: z.string().optional(),
  cfgScale: z.number().min(0).max(1).optional(),
  generateAudio: z.boolean().optional(),
  cameraFixed: z.boolean().optional(),
  seed: z.number().int().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = inputSchema.parse(body);

    const modelConfig = VIDEO_MODELS.find(
      (m) => m.provider === input.provider && m.id === input.modelId
    );
    if (!modelConfig) {
      return apiResponse.badRequest(
        `Unknown model: ${input.provider}/${input.modelId}`
      );
    }

    const keyCheck = validateProviderKey(input.provider);
    if (!keyCheck.valid) {
      return apiResponse.serverError(keyCheck.error!);
    }

    const { taskId } = await submitVideoGeneration({
      prompt: input.prompt,
      provider: input.provider,
      modelId: input.modelId,
      duration: input.duration,
      image: input.image,
      aspectRatio: input.aspectRatio,
      resolution: input.resolution,
      negativePrompt: input.negativePrompt,
      cfgScale: input.cfgScale,
      generateAudio: input.generateAudio,
      cameraFixed: input.cameraFixed,
      seed: input.seed,
    });

    return apiResponse.success({ taskId });
  } catch (error: any) {
    console.error("[Video API] Error:", error);
    return apiResponse.serverError(
      error.message || "Video generation failed"
    );
  }
}
