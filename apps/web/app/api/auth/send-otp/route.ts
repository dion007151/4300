import { NextRequest, NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import { otpStore } from "@/auth";

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "dionimarflores9@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD ?? "",
  },
});

export async function POST(req: NextRequest) {
  const { email, name } = await req.json() as { email: string; name?: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Rate limit: don't resend within 60 seconds
  const existing = otpStore.get(email.toLowerCase());
  if (existing && Date.now() < existing.expires - 4 * 60 * 1000) {
    return NextResponse.json({ error: "Please wait before requesting another code" }, { status: 429 });
  }

  const code = generateCode();
  const expires = Date.now() + 5 * 60 * 1000; // 5 min expiry
  otpStore.set(email.toLowerCase(), { code, expires, name });

  // If no Gmail App Password configured, just log for dev
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.log(`[4300 DEV] OTP for ${email}: ${code}`);
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    await transporter.sendMail({
      to: email,
      from: '"4300 App" <dionimarflores9@gmail.com>',
      subject: `${code} is your 4300 sign-in code`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#0d1117;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117;padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0"
        style="background:#161b22;border-radius:20px;border:1px solid #30363d;overflow:hidden;max-width:480px;">

        <!-- Gradient header -->
        <tr><td style="background:linear-gradient(135deg,#4f6fff 0%,#7c3aed 100%);padding:32px 32px 28px;text-align:center;">
          <div style="font-size:30px;font-weight:800;color:#fff;letter-spacing:-1px;margin-bottom:4px;">4300</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.70);letter-spacing:0.5px;">EVERYTHING. FOR FREE.</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 32px 28px;">
          <h2 style="margin:0 0 10px;color:#f0f6fc;font-size:18px;font-weight:700;">Your sign-in code</h2>
          <p style="margin:0 0 28px;color:#8b949e;font-size:14px;line-height:1.6;">
            ${name ? `Hi ${name}! Use` : "Use"} this code to sign in to your 4300 account.
            It expires in <strong style="color:#f0f6fc;">5 minutes</strong>.
          </p>

          <!-- Code box -->
          <div style="background:#0d1117;border:2px solid #4f6fff;border-radius:14px;padding:24px;text-align:center;margin-bottom:28px;">
            <div style="font-family:monospace;font-size:42px;font-weight:800;letter-spacing:12px;color:#4f6fff;line-height:1;">
              ${code}
            </div>
          </div>

          <p style="margin:0;color:#484f58;font-size:12px;line-height:1.6;">
            🔒 Never share this code with anyone.<br/>
            If you didn't request this, you can safely ignore this email.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 32px;border-top:1px solid #21262d;text-align:center;">
          <p style="margin:0;color:#484f58;font-size:11px;">
            © 2025 4300 · Everything. For Free.<br/>
            <a href="mailto:dionimarflores9@gmail.com" style="color:#484f58;text-decoration:none;">
              dionimarflores9@gmail.com
            </a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ error: "Failed to send email. Check GMAIL_APP_PASSWORD." }, { status: 500 });
  }
}
