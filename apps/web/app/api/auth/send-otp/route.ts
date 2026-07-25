import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { otpStore } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Generate 6-digit numeric OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(email.toLowerCase(), { code, expires });

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (gmailUser && gmailPass) {
      // Send real email via Gmail Nodemailer SMTP
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      await transporter.sendMail({
        from: `"4300 Platform" <${gmailUser}>`,
        to: email,
        subject: `${code} is your 4300 Sign-In Verification Code`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <h2 style="color: #4f6fff; margin-bottom: 8px;">4300 — Everything. For Free.</h2>
            <p style="color: #475467; font-size: 14px;">Your 6-digit verification code to sign in is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0f172a; padding: 16px; background: #f1f5f9; text-align: center; border-radius: 8px; margin: 16px 0;">
              ${code}
            </div>
            <p style="color: #94a3b8; font-size: 12px;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
          </div>
        `,
      });

      return NextResponse.json({ ok: true, sent: true });
    }

    // Dev fallback if GMAIL_APP_PASSWORD not provided yet
    console.log(`[4300 OTP] Verification code for ${email}: ${code}`);
    return NextResponse.json({ ok: true, dev: true, code });

  } catch (error: any) {
    console.error("OTP email send error:", error);
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }
}
