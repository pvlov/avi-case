import { NextResponse } from "next/server";
import { parseDocument } from "@/app/actions/gemini";

export async function POST(request: Request) {
  const formData = await request.formData();
  try {
    const text = await parseDocument(formData);
    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}