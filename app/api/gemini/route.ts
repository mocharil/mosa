import { NextRequest, NextResponse } from "next/server";
import {
  getUnifiedResponse,
  Message,
  generateSummary,
  analyzeImage,
} from "@/app/lib/vertexai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userQuery, conversationHistory } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    // Handle different actions
    if (action === "chat") {
      if (!userQuery) {
        return NextResponse.json(
          { error: "userQuery is required" },
          { status: 400 }
        );
      }

      const history: Message[] = conversationHistory || [];
      const response = await getUnifiedResponse(userQuery, history);
      return NextResponse.json(response);

    } else if (action === "summary") {
      if (!conversationHistory) {
        return NextResponse.json(
          { error: "conversationHistory is required" },
          { status: 400 }
        );
      }

      const summary = await generateSummary(conversationHistory);
      return NextResponse.json({ summary });
    } else if (action === "image") {
      if (!body.imageBase64) {
        return NextResponse.json(
          { error: "imageBase64 is required" },
          { status: 400 }
        );
      }

      const response = await analyzeImage(
        body.imageBase64,
        body.userQuery || "Apa yang ada di gambar ini?"
      );
      return NextResponse.json(response);
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}
