import { streamChat } from "@/lib/ai/chat";
import { z } from "zod";

// v6 UIMessage format: messages have `parts` array instead of `content` string
const uiMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().optional(),
  parts: z
    .array(
      z.object({
        type: z.string(),
        text: z.string().optional(),
      }).passthrough()
    )
    .optional(),
});

const inputSchema = z.object({
  provider: z.string().min(1),
  modelId: z.string().min(1),
  messages: z.array(uiMessageSchema).optional(),
  prompt: z.string().optional(),
  system: z.string().optional(),
}).refine(
  (data) => data.messages || data.prompt,
  { message: "Either 'messages' or 'prompt' is required" }
);

function extractContent(msg: z.infer<typeof uiMessageSchema>): string {
  if (msg.content) return msg.content;
  if (msg.parts) {
    return msg.parts
      .filter((p) => p.type === "text" && p.text)
      .map((p) => p.text!)
      .join("");
  }
  return "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = inputSchema.parse(body);

    const messages = input.messages?.map((m) => ({
      role: m.role,
      content: extractContent(m),
    }));

    const result = streamChat({
      provider: input.provider,
      modelId: input.modelId,
      messages,
      prompt: input.prompt,
      system: input.system,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Chat generation failed" },
      { status: error.message?.includes("Missing") ? 500 : 400 }
    );
  }
}
