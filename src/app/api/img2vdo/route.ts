import { NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";

interface ImageToVideoResponse {
  id: string;
}

interface TaskResponse {
  id: string;
  status: "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "THROTTLED";
  output?: string | string[]; // ✅ Fixed type to allow string[]
}

export async function POST(req: Request) {
  try {
    const { imageUrl, promptText }: { imageUrl: string; promptText?: string } = await req.json();
    
    const client = new RunwayML({ apiKey: process.env.RUNWAY_API_KEY });

    // Create an image-to-video task using the "gen3a_turbo" model
    const imageToVideo: ImageToVideoResponse = await client.imageToVideo.create({
      model: "gen3a_turbo",
      promptImage: imageUrl,
      promptText: promptText || "",
    });

    const taskId = imageToVideo.id;
    let task: TaskResponse;

    // Poll the task until it's complete
    do {
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds before polling
      task = await client.tasks.retrieve(taskId);
    } while (!["SUCCEEDED", "FAILED", "CANCELLED", "THROTTLED"].includes(task.status)); // ✅ Fixed status check

    // Ensure output is a string
    const output = Array.isArray(task.output) ? task.output[0] : task.output; // ✅ Ensure it's a single string

    if (task.status === "SUCCEEDED" && output) {
      return NextResponse.json({ videoUrl: output });
    } else {
      return NextResponse.json({ error: `Task ${task.status}` }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
