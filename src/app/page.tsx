"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Signing in...");
    //  API here for credentials auth
    await signIn("email", { email, redirect: false });
    setMessage("Check your email for a sign-in link!");
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Registering...");
    // TODO: registration API call
    setTimeout(() => {
      setMessage("Registration successful! Check your email for a sign-in link.");
    }, 1000);
  };

  const closeModal = () => {
    setShowModal(false);
    setMode("signin");
    setMessage("");
    setEmail("");
    setPassword("");
    setName("");
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
                <form onSubmit={handleEmailSignIn} className="w-full flex flex-col items-center mb-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="mb-2 px-4 py-2 border-2 border-black rounded w-full placeholder:text-black/80"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="mb-2 px-4 py-2 border-2 border-black rounded w-full placeholder:text-black/80"
                  />
                  <button
                    type="submit"
                    className="bg-bybYellow border-2 border-black text-bybBlack font-bold px-6 py-3 rounded-lg shadow-neo-brutalism hover:bg-yellow-400 hover:text-bybBlack transition w-full mb-2"
                    style={{color: '#222'}}
                  >
                    Sign in with Email
                  </button>
                </form>
                <button
                  onClick={() => signIn("google")}
                  className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg border-2 border-black shadow-neo-brutalism hover:bg-blue-700 hover:text-white transition w-full"
                  style={{color: '#fff'}}
                >
                  Sign in with Google
                </button>
                {message && <div className="mt-2 text-center text-sm text-green-700">{message}</div>}
              </>
            ) : (
              <form onSubmit={handleEmailSignUp} className="w-full flex flex-col items-center">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="mb-2 px-4 py-2 border-2 border-black rounded w-full placeholder:text-black/80"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="mb-2 px-4 py-2 border-2 border-black rounded w-full placeholder:text-black/80"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="mb-2 px-4 py-2 border-2 border-black rounded w-full placeholder:text-black/80"
                />
                <button
                  type="submit"
                  className="bg-bybYellow border-2 border-black text-bybBlack font-bold px-6 py-3 rounded-lg shadow-neo-brutalism hover:bg-yellow-400 hover:text-bybBlack transition w-full mb-2"
                  style={{color: '#222'}}
                >
                  Sign up
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
