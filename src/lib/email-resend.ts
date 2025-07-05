import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
  
  try {
    console.log("Attempting to send verification email to:", email);
    console.log("Verification URL:", verificationUrl);
    
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "iSpani <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your email address - iSpani",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #FFE066; background: #222; padding: 15px; border: 4px solid #000; border-radius: 15px; display: inline-block; margin: 0;">
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
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log("Verification email sent successfully via Resend:", data?.id);
    return data?.id;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  
  try {
    console.log("Attempting to send password reset email to:", email);
    
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "iSpani <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your password - iSpani",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #FFE066; background: #222; padding: 15px; border: 4px solid #000; border-radius: 15px; display: inline-block; margin: 0;">
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
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }

    console.log("Password reset email sent successfully via Resend:", data?.id);
    return data?.id;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}
