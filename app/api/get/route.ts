import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

// get all vids
export const GET = async (req: NextRequest, res: NextResponse) => {
    const data = readFileSync(`./app/data/db.json`, 'utf-8');
    const db:VideoData[] = JSON.parse(data);
    if(db) {
        return new Response(JSON.stringify(db), {
        headers: {
            "Content-Type": "application/json"
        }
        });
    } else {
        return new Response("Video not found", { status: 404 });
    }
}