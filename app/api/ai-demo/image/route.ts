import { generateImageUnified } from "@/lib/ai/image";
import { IMAGE_MODELS } from "@/config/ai-models";
import { apiResponse } from "@/lib/api-response";
import { z } from "zod";

const inputSchema = z
  .object({
    prompt: z.string().min(1, "Prompt is required"),
    provider: z.string().min(1),
    modelId: z.string().min(1),
    size: z.string().optional(),
    sourceImage: z.string().optional(),
    aspectRatio: z.string().optional(),
    seed: z.number().int().optional(),
    negativePrompt: z.string().optional(),
    guidanceScale: z.number().optional(),
    inferenceSteps: z.number().int().optional(),
    strength: z.number().min(0).max(1).optional(),
    outputFormat: z.string().optional(),
    quality: z.string().optional(),
    background: z.string().optional(),
    resolution: z.string().optional(),
  })
  .refine((data) => !(data.size && data.aspectRatio), {
    message: "Cannot specify both size and aspectRatio",
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = inputSchema.parse(body);

    const modelConfig = IMAGE_MODELS.find(
      (m) => m.provider === input.provider && m.id === input.modelId
    );
    if (!modelConfig) {
      return apiResponse.badRequest(
        `Unknown model: ${input.provider}/${input.modelId}`
      );
    }

    const result = await generateImageUnified({
      prompt: input.prompt,
      provider: input.provider,
      modelId: input.modelId,
      size: input.size,
      sourceImage: input.sourceImage,
      generationMethod: modelConfig.generationMethod || "standard",
      aspectRatio: input.aspectRatio,
      seed: input.seed,
      negativePrompt: input.negativePrompt,
      guidanceScale: input.guidanceScale,
      inferenceSteps: input.inferenceSteps,
      strength: input.strength,
      outputFormat: input.outputFormat,
      quality: input.quality,
      background: input.background,
      resolution: input.resolution,
    });

    return apiResponse.success({ imageUrl: result.imageUrl });
  } catch (error: any) {
    console.error("[Image API] Error:", error);
    return apiResponse.serverError(error.message || "Image generation failed");
  }
}
