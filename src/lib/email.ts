import nodemailer from "nodemailer";

// Create transporter with better error handling
let transporter: nodemailer.Transporter;

async function getTransporter() {
  if (!transporter) {
    try {
      if (process.env.EMAIL_HOST === "smtp.ethereal.email") {
        // For Ethereal, create fresh test credentials if existing ones don't work
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
          console.log("Creating fresh Ethereal test account...");
          const testAccount = await nodemailer.createTestAccount();
          console.log("Fresh Ethereal credentials:", {
            user: testAccount.user,
            pass: testAccount.pass
          });
          
          transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
        } else {
          transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || "587"),
            secure: false,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });
        }
      } else {
        // For other email providers
        transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || "smtp.ethereal.email",
          port: parseInt(process.env.EMAIL_PORT || "587"),
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
      }
    } catch (error) {
      console.error("Failed to create email transporter:", error);
      throw error;
    }
  }
  return transporter;
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
  
  try {
    console.log("Attempting to send verification email to:", email);
    console.log("Verification URL:", verificationUrl);
    
    const emailTransporter = await getTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || "iSpani <no-reply@ispani.com>",
      to: email,
      subject: "Verify your email address - iSpani",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #FFE066; background: #222; padding: 15px; border: 4px solid #000; border-radius: 15px; display: inline-block;">
              iSpani
            </h1>
          </div>
          
          <h2 style="color: #222; margin-bottom: 20px;">Welcome to iSpani!</h2>
          
          <p style="color: #555; font-size: 16px; line-height: 1.5;">
            Thank you for signing up! Please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #FFE066; color: #222; padding: 15px 30px; text-decoration: none; border: 4px solid #000; border-radius: 15px; font-weight: bold; display: inline-block; box-shadow: 8px 8px 0 0 #000;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #777; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #555;">${verificationUrl}</a>
          </p>
          
          <p style="color: #777; font-size: 14px; margin-top: 30px;">
            This link will expire in 24 hours. If you didn't create an account with iSpani, please ignore this email.
          </p>
        </div>
      `,
    };
    
    const result = await emailTransporter.sendMail(mailOptions);
    console.log("Verification email sent successfully:", result.messageId);
    
    // For Ethereal, log the preview URL
    const previewUrl = nodemailer.getTestMessageUrl(result);
    if (previewUrl) {
      console.log("Preview URL:", previewUrl);
    }
    
    return result.messageId;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || "iSpani <no-reply@ispani.com>",
    to: email,
    subject: "Reset your password - iSpani",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #FFE066; background: #222; padding: 15px; border: 4px solid #000; border-radius: 15px; display: inline-block;">
            iSpani
          </h1>
        </div>
        
        <h2 style="color: #222; margin-bottom: 20px;">Reset Your Password</h2>
        
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          You requested to reset your password. Click the button below to set a new password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: #FF6F91; color: #fff; padding: 15px 30px; text-decoration: none; border: 4px solid #000; border-radius: 15px; font-weight: bold; display: inline-block; box-shadow: 8px 8px 0 0 #000;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #777; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #555;">${resetUrl}</a>
        </p>
        
        <p style="color: #777; font-size: 14px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}
