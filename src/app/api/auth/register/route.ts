import { NextRequest, NextResponse } from "next/server";
import { signUpSchema } from "@/schemas/auth";
import { hashPassword, generateSecureToken } from "@/lib/password";
import { sendVerificationEmail } from "@/lib/email";
import { PrismaClient } from "@/generated/prisma";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  console.log("Registration API called");
  try {
    const body = await request.json();
    console.log("Request body:", body);
    
    // Validate input
    const validatedData = signUpSchema.parse(body);
    console.log("Validation successful:", validatedData);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (existingUser) {
      console.log("User already exists:", existingUser.email);
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    console.log("User does not exist, proceeding with registration...");
    
    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await hashPassword(validatedData.password);
    console.log("Password hashed successfully");
    
    // Generate verification token
    console.log("Generating verification token...");
    const verificationToken = generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours
    console.log("Verification token generated");
    
    // Create user
    console.log("Creating user in database...");
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });
    console.log("User created with ID:", user.id);
    
    // Create verification token
    console.log("Creating verification token in database...");
    await prisma.emailVerificationToken.create({
      data: {
        email: validatedData.email,
        token: verificationToken,
        expires: expiresAt,
      },
    });
    console.log("Verification token created");
    
    // Send verification email
    console.log("Sending verification email...");
    await sendVerificationEmail(validatedData.email, verificationToken);
    console.log("Verification email sent");
    
    return NextResponse.json(
      { 
        message: "User created successfully. Please check your email to verify your account.",
        userId: user.id 
      },
      { status: 201 }
    );
    
  } catch (error: unknown) {
    console.error("Registration error:", error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
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
