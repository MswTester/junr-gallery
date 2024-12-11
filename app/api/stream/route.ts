import { createReadStream, statSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("id");

  if (!videoId) {
    return NextResponse.json({ message: "Video ID is required" }, { status: 400 });
  }

  const filePath = `./public/videos/${videoId}.mp4`;

  try {
    const videoStats = statSync(filePath);
    const range = req.headers.get("range"); // Range 헤더 확인

    if (!range) {
      return NextResponse.json({ message: "Requires Range header" }, { status: 400 });
    }

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoStats.size - 1);

    const headers = new Headers({
      "Content-Range": `bytes ${start}-${end}/${videoStats.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": (end - start + 1).toString(),
      "Content-Type": "video/mp4",
    });

    const videoStream = createReadStream(filePath, { start, end });

    return new NextResponse(videoStream as any, {
      status: 206,
      headers,
    });
  } catch (error) {
    console.error("Error serving video:", error);
    return NextResponse.json({ message: "Error reading video file" }, { status: 500 });
  }
};
