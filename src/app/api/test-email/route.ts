import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(request: NextRequest) {
  try {
    console.log("Testing email configuration...");
    
    // Create test account with Ethereal
    const testAccount = await nodemailer.createTestAccount();
    console.log("Created test account:", {
      user: testAccount.user,
      pass: testAccount.pass
    });
    
    // Create transporter with fresh credentials
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    // Send test email
    const info = await transporter.sendMail({
      from: '"iSpani Test" <test@ispani.com>',
      to: "test@example.com",
      subject: "Test Email from iSpani",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #FFE066; background: #222; padding: 15px; border: 4px solid #000; border-radius: 15px; display: inline-block;">
            iSpani Email Test
          </h1>
          <p>This is a test email to verify email configuration is working.</p>
        </div>
      `,
    });
    
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
      testCredentials: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
  } catch (error) {
    console.error("Email test error:", error);
    return NextResponse.json(
      { error: "Email test failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
