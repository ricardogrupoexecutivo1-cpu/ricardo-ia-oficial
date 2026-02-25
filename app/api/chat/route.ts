import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { message } = await req.json();

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: message,
  });

  return NextResponse.json({
    reply: response.output[0].content[0].text,
  });
}