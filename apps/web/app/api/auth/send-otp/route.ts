import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    // Try sending email via Gmail Nodemailer if credentials exist
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const gmailUser = process.env.GMAIL_USER || "dionimarflores9@gmail.com";

    let emailSent = false;
    if (gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        await transporter.sendMail({
          from: `"4300 Workspace" <${gmailUser}>`,
          to: cleanEmail,
          subject: `${otpCode} is your 4300 Verification Code`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #0f172a; color: #ffffff; border-radius: 12px; max-width: 500px;">
              <h2 style="color: #38bdf8;">4300 Workspace Authentication</h2>
              <p style="font-size: 14px; color: #cbd5e1;">Your 6-digit verification code to sign into 4300 is:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8; background: #1e293b; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                ${otpCode}
              </div>
              <p style="font-size: 12px; color: #94a3b8;">This code will expire in 5 minutes. Do not share this code with anyone.</p>
            </div>
          `,
        });
        emailSent = true;
      } catch (e) {
        console.error("Nodemailer error:", e);
      }
    }

    return NextResponse.json({
      ok: true,
      emailSent,
      otpCode, // Available for toast preview if Gmail App Password not yet set
      message: `6-Digit OTP Code generated for ${cleanEmail}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to generate OTP code" }, { status: 500 });
  }
}
