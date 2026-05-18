import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = body?.password;
    const secret = process.env.DEMO_PASSWORD;

    if (!secret) {
      return NextResponse.json({ error: "DEMO_PASSWORD is not configured." }, { status: 500 });
    }

    if (typeof password !== "string" || password.length === 0) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    if (password === secret) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
