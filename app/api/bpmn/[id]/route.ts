import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "bpmn-storage");

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const filePath = path.join(DATA_DIR, `${id}.bpmn`);

  try {
    const data = await fs.readFile(filePath, "utf8");
    return new NextResponse(data, { status: 200, headers: { "Content-Type": "application/xml" } });
  } catch (err) {
    return new NextResponse("Not Found", { status: 404 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.text();
  const filePath = path.join(DATA_DIR, `${id}.bpmn`);

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, body, "utf8");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save error:", err);
    return new NextResponse("Failed to save", { status: 500 });
  }
}
