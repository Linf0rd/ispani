import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { resetPasswordSchema } from "@/schemas/auth";
import { generateSecureToken } from "@/lib/password";
import { sendPasswordResetEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { email } = resetPasswordSchema.parse(body);
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "If an account with that email exists, we've sent a password reset link." },
        { status: 200 }
      );
    }
    
    // Delete any existing password reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });
    
    // Generate new reset token
    const token = generateSecureToken();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour
    
    // Save reset token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    
    // Send password reset email
    await sendPasswordResetEmail(email, token);
    
    return NextResponse.json(
      { message: "If an account with that email exists, we've sent a password reset link." },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
