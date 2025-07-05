import { NextRequest, NextResponse } from "next/server";
import { signUpSchema } from "@/schemas/auth";
import { hashPassword, generateSecureToken } from "@/lib/password";
import { sendVerificationEmail } from "@/lib/email";
import { PrismaClient } from "@/generated/prisma";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signUpSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);
    
    // Generate verification token
    const verificationToken = generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });
    
    // Create verification token
    await prisma.verificationToken.create({
      data: {
        identifier: validatedData.email,
        token: verificationToken,
        expires: expiresAt,
      },
    });
    
    // Send verification email
    await sendVerificationEmail(validatedData.email, verificationToken);
    
    return NextResponse.json(
      { 
        message: "User created successfully. Please check your email to verify your account.",
        userId: user.id 
      },
      { status: 201 }
    );
    
  } catch (error: unknown) {
    console.error("Registration error:", error);
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
