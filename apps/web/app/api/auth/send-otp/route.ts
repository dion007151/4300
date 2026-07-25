import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: "Use Google 1-click Sign-In or Guest Access" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to process auth request" }, { status: 500 });
  }
}
