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
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        // Plain text fallback (Crucial for Spam Filter score optimization)
        const textContent = `Your 4300 Workspace verification code is: ${otpCode}\n\nThis code is valid for 5 minutes. If you did not request this verification code, please disregard this email.`;

        // Modern HTML template
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your 4300 Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #161e2e; border: 1px solid #2d3748; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 16px 32px; text-align: left;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #3b82f6; width: 36px; height: 36px; border-radius: 10px; text-align: center; vertical-align: middle; font-weight: bold; color: #ffffff; font-size: 18px;">
                    4
                  </td>
                  <td style="padding-left: 12px; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                    4300 Workspace
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 16px 32px 32px 32px;">
              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">
                Verification Code
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Use the 6-digit security code below to complete your sign in to 4300 Workspace:
              </p>

              <!-- OTP Code Display Box -->
              <div style="background-color: #0f172a; border: 1px solid #334155; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #60a5fa; display: inline-block;">
                  ${otpCode}
                </span>
              </div>

              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b;">
                ⏰ Valid for <strong>5 minutes</strong>. Never share this code with anyone.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #0f172a; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #64748b;">
              Sent securely by 4300 Workspace &bull; <a href="mailto:dionimarflores9@gmail.com" style="color: #60a5fa; text-decoration: none;">Support Help</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        await transporter.sendMail({
          from: `"4300 Workspace" <${gmailUser}>`,
          to: cleanEmail,
          subject: `Your 4300 verification code is ${otpCode}`,
          text: textContent,
          html: htmlContent,
          headers: {
            "X-Entity-Ref-ID": `otp-${Date.now()}`,
          },
        });
        emailSent = true;
      } catch (e) {
        console.error("Nodemailer error:", e);
      }
    }

    return NextResponse.json({
      ok: true,
      emailSent,
      otpCode,
      message: `6-Digit OTP Code generated for ${cleanEmail}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to generate OTP code" }, { status: 500 });
  }
}
