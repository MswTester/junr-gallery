import { createWriteStream, readFileSync, promises as fsPromises } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { pipeline, Readable } from "stream";
import { promisify } from "util";

const pipelineAsync = promisify(pipeline);

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

// upload video
export const POST = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const artist = searchParams.get("artist");

  if (!id || !title || !description || !artist) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const filePath = `./public/videos/${id}.mp4`;
  const dbPath = "./app/data/db.json";

  try {
    console.log(req.body)
    // Save the video file
    const writeStream = createWriteStream(filePath);
    const readable = Readable.fromWeb(req.body as any);
    await pipelineAsync(readable, writeStream);

    console.log(`File saved successfully: ${filePath}`);

    // Save metadata to database
    const db = JSON.parse(await fsPromises.readFile(dbPath, "utf-8"));
    db.push({
      id,
      title,
      description,
      artist,
      url: `/videos/${id}.mp4`,
    });
    await fsPromises.writeFile(dbPath, JSON.stringify(db, null, 2));

    return NextResponse.json({ message: "Video uploaded successfully", id }, { status: 201 });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json({ message: "Error processing upload" }, { status: 500 });
  }
};