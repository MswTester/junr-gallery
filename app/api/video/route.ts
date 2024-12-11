import { createWriteStream, readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { pipeline } from "stream";
import { promisify } from "util";

// fetch video
export const GET = async (req: NextRequest, res: NextResponse) => {
  const {searchParams} = new URL(req.url);
  const videoId = searchParams.get("id");
  if(!videoId) {
    return new Response("Video ID is required", { status: 400 });
  }
  const data = readFileSync(`./app/data/db.json`, 'utf-8');
  const db:VideoData[] = JSON.parse(data);
  const video = db.find((video: VideoData) => video.id === videoId);
  if(video) {
    return new Response(JSON.stringify(video), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } else {
    return new Response("Video not found", { status: 404 });
  }
}

const pipelineAsync = promisify(pipeline);

// upload video
export const POST = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Video ID is required" }, { status: 400 });
  }

  const filePath = `./public/videos/${id}.mp4`;

  try {
    // AbortController로 요청 취소 처리
    const abortController = new AbortController();
    const { signal } = abortController;

    req.signal.addEventListener("abort", () => {
      abortController.abort();
    });

    const writeStream = createWriteStream(filePath);
    await pipelineAsync(req.body as any, writeStream, { signal });

    return NextResponse.json({ message: "Video uploaded successfully", id }, { status: 201 });
  } catch (error) {
    if ((error as any).name === "AbortError") {
      console.log("Upload aborted by client.");
      return NextResponse.json({ message: "Upload aborted" }, { status: 499 });
    }
    console.error("Error saving video:", error);
    return NextResponse.json({ message: "Error saving video" }, { status: 500 });
  }
};