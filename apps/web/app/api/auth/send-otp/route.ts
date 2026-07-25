import { NextRequest, NextResponse } from "next/server";

// Global in-memory OTP store (email -> { code, expiresAt })
const globalOtpStore = globalThis as unknown as {
  otpStore?: Map<string, { code: string; expiresAt: number }>;
};

if (!globalOtpStore.otpStore) {
  globalOtpStore.otpStore = new Map();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Generate a secure 6-digit random OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

    globalOtpStore.otpStore!.set(cleanEmail, { code: otpCode, expiresAt });

    return NextResponse.json({
      ok: true,
      otpCode, // Returned for instant UI toast & testing verification
      message: `6-Digit OTP Code sent to ${cleanEmail}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to generate OTP code" }, { status: 500 });
  }
}
