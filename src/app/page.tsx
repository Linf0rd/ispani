"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, signUpSchema, SignInInput, SignUpInput } from "@/schemas/auth";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>("signin");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sign In Form
  const signInForm = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Sign Up Form
  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignIn = async (data: SignInInput) => {
    setIsLoading(true);
    setMessage("Signing in...");
    
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("verify your email")) {
          setMessage("Please verify your email before signing in. Check your inbox for the verification link.");
        } else {
          setMessage("Invalid email or password. Please try again.");
        }
      } else if (result?.ok) {
        setMessage("Sign in successful!");
        closeModal();
        // Redirect to dashboard after successful sign in
        window.location.href = "/dashboard";
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpInput) => {
    console.log("Sign up form submitted with data:", data);
    setIsLoading(true);
    setMessage("Creating account...");
    
    try {
      console.log("Sending registration request...");
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Registration response status:", response.status);
      const result = await response.json();
      console.log("Registration response:", result);

      if (response.ok) {
        setMessage("Registration successful! Please check your email to verify your account.");
        signUpForm.reset();
      } else {
        setMessage(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setMode("signin");
    setMessage("");
    signInForm.reset();
    signUpForm.reset();
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center relative">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-black drop-shadow-lg mb-6 text-center">
        iSpani
      </h1>
      <p className="text-lg md:text-2xl font-semibold text-black/80 mb-10 text-center max-w-xl">
        Aggregate job listings from top sources. Track your applications. Land your
        dream job.
      </p>
      <button
        onClick={() => setShowModal(true)}
        className="bg-bybYellow border-4 border-bybBlack text-bybBlack font-bold px-8 py-4 rounded-neo shadow-neo-brutalism hover:bg-yellow-400 hover:text-bybBlack transition text-2xl"
        style={{color: '#222'}}
      >
        Sign In / Sign Up
      </button>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white border-[6px] border-black rounded-2xl p-8 shadow-neo-brutalism w-full max-w-sm flex flex-col items-center relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-3xl font-bold text-black hover:text-bybPink focus:outline-none z-10"
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex gap-4 mb-6 w-full">
              <button
                onClick={() => { setMode("signin"); setMessage(""); }}
                className={`flex-1 py-2 rounded-neo border-4 font-bold text-lg transition
                  ${mode === "signin"
                    ? "bg-bybYellow text-bybBlack border-bybYellow ring-4 ring-yellow-200"
                    : "bg-white text-bybBlack border-black hover:bg-yellow-400 hover:text-bybBlack"}
                `}
                style={{color: '#222'}}
                aria-pressed={mode === "signin"}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode("signup"); setMessage(""); }}
                className={`flex-1 py-2 rounded-neo border-4 font-bold text-lg transition
                  ${mode === "signup"
                    ? "bg-bybYellow text-bybBlack border-bybYellow ring-4 ring-yellow-200"
                    : "bg-white text-bybBlack border-black hover:bg-yellow-400 hover:text-bybBlack"}
                `}
                style={{color: '#222'}}
                aria-pressed={mode === "signup"}
              >
                Sign Up
              </button>
            </div>
            {mode === "signin" ? (
              <>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="w-full flex flex-col items-center mb-4">
                  <div className="w-full mb-4">
                    <input
                      type="email"
                      placeholder="Email"
                      {...signInForm.register("email")}
                      className="w-full px-4 py-2 border-2 border-black rounded placeholder:text-black/80"
                    />
                    {signInForm.formState.errors.email && (
                      <p className="text-red-600 text-sm mt-1">{signInForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="w-full mb-4">
                    <input
                      type="password"
                      placeholder="Password"
                      {...signInForm.register("password")}
                      className="w-full px-4 py-2 border-2 border-black rounded placeholder:text-black/80"
                    />
                    {signInForm.formState.errors.password && (
                      <p className="text-red-600 text-sm mt-1">{signInForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-bybYellow border-2 border-black text-bybBlack font-bold px-6 py-3 rounded-lg shadow-neo-brutalism hover:bg-yellow-400 hover:text-bybBlack transition w-full mb-2 disabled:opacity-50"
                    style={{color: '#222'}}
                  >
                    {isLoading ? "Signing in..." : "Sign in with Email"}
                  </button>
                </form>
                <button
                  onClick={() => signIn("google")}
                  disabled={isLoading}
                  className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg border-2 border-black shadow-neo-brutalism hover:bg-blue-700 hover:text-white transition w-full disabled:opacity-50"
                  style={{color: '#fff'}}
                >
                  Sign in with Google
                </button>
                {message && <div className="mt-2 text-center text-sm text-green-700">{message}</div>}
              </>
            ) : (
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="w-full flex flex-col items-center">
                <div className="w-full mb-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...signUpForm.register("name")}
                    className="w-full px-4 py-2 border-2 border-black rounded placeholder:text-black/80"
                  />
                  {signUpForm.formState.errors.name && (
                    <p className="text-red-600 text-sm mt-1">{signUpForm.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="w-full mb-4">
                  <input
                    type="email"
                    placeholder="Email"
                    {...signUpForm.register("email")}
                    className="w-full px-4 py-2 border-2 border-black rounded placeholder:text-black/80"
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-red-600 text-sm mt-1">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="w-full mb-4">
                  <input
                    type="password"
                    placeholder="Password"
                    {...signUpForm.register("password")}
                    className="w-full px-4 py-2 border-2 border-black rounded placeholder:text-black/80"
                  />
                  {signUpForm.formState.errors.password && (
                    <p className="text-red-600 text-sm mt-1">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <div className="w-full mb-4">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    {...signUpForm.register("confirmPassword")}
                    className="w-full px-4 py-2 border-2 border-black rounded placeholder:text-black/80"
                  />
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{signUpForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-bybYellow border-2 border-black text-bybBlack font-bold px-6 py-3 rounded-lg shadow-neo-brutalism hover:bg-yellow-400 hover:text-bybBlack transition w-full mb-2 disabled:opacity-50"
                  style={{color: '#222'}}
                >
                  {isLoading ? "Creating Account..." : "Sign up"}
                </button>
                {message && <div className="mt-2 text-center text-sm text-green-700">{message}</div>}
              </form>
            )}
          </div>
        </div>
      )}
      {/* Neo-brutalism accent shapes */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-bybPink border-4 border-black rounded-br-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-bybBlue border-4 border-black rounded-tl-3xl -z-10"></div>
      <div className="absolute top-1/2 left-0 w-16 h-16 bg-bybGreen border-4 border-black rounded-r-2xl -z-10"></div>
    </div>
  );
}
