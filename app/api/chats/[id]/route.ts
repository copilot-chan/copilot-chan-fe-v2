import { NextRequest, NextResponse } from "next/server";
import { AppError, handleApiError, checkFetchError } from "@/lib/error";
import { BackendChatSchema, normalizeChat } from "@/lib/chat";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const authHeader = req.headers.get("Authorization");

    if (!userId) {
      throw new AppError("Missing userId", 400, "MISSING_PARAM");
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const appName = "copilot-chan";
    const url = `${backendUrl}/apps/${appName}/users/${userId}/sessions/${id}`;

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    await checkFetchError(res);

    const rawData = await res.json();
    
    // Zod validation
    const parseResult = BackendChatSchema.safeParse(rawData);
    if (!parseResult.success) {
      console.error("[Chat API] Validation failed:", parseResult.error.flatten());
      throw new AppError("Invalid chat data format", 500, "VALIDATION_ERROR");
    }

    // Normalize to UI domain
    const normalizedChat = normalizeChat(parseResult.data);

    return NextResponse.json(normalizedChat);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const authHeader = req.headers.get("Authorization");

    if (!userId) {
      throw new AppError("Missing userId", 400, "MISSING_PARAM");
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const appName = "copilot-chan";
    const url = `${backendUrl}/apps/${appName}/users/${userId}/sessions/${id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    await checkFetchError(res);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
