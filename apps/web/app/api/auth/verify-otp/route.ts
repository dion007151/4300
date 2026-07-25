import { NextRequest, NextResponse } from "next/server";

const globalOtpStore = globalThis as unknown as {
  otpStore?: Map<string, { code: string; expiresAt: number }>;
};

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and 6-digit code are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const record = globalOtpStore.otpStore?.get(cleanEmail);

    if (!record) {
      return NextResponse.json({ error: "No OTP request found for this email. Please request a new code." }, { status: 400 });
    }

    if (Date.now() > record.expiresAt) {
      globalOtpStore.otpStore?.delete(cleanEmail);
      return NextResponse.json({ error: "OTP code has expired. Please request a new code." }, { status: 400 });
    }

    if (record.code !== cleanCode) {
      return NextResponse.json({ error: "Invalid 6-digit code. Please check and try again." }, { status: 400 });
    }

    // Code verified successfully -> consume the code
    globalOtpStore.otpStore?.delete(cleanEmail);

    return NextResponse.json({
      ok: true,
      email: cleanEmail,
      message: "OTP verification successful!",
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to verify OTP code" }, { status: 500 });
  }
}
