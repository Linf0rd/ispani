"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="w-full bg-bybYellow border-b-[6px] border-black shadow-neo-brutalism flex items-center justify-between px-6 py-4 fixed top-0 left-0 z-50" style={{backgroundColor: '#FFE066'}}>
      <div className="flex items-center gap-2">
        <span className="text-5xl font-extrabold tracking-tight text-outline">iSpani</span>
      </div>
      <div className="flex gap-4 items-center">
        <Link href="/dashboard" className="font-bold text-lg text-bybBlack px-6 py-3 rounded-3xl border-4 border-black bg-white shadow-neo-brutalism hover:bg-yellow-400 hover:text-bybBlack transition">
          Dashboard
        </Link>
        <Link href="/jobs" className="font-bold text-lg text-bybBlack px-6 py-3 rounded-3xl border-4 border-black bg-white shadow-neo-brutalism hover:bg-yellow-400 hover:text-bybBlack transition">
          Jobs
        </Link>
        <Link href="/track" className="font-bold text-lg text-bybBlack px-6 py-3 rounded-3xl border-4 border-black bg-white shadow-neo-brutalism hover:bg-yellow-400 hover:text-bybBlack transition">
          Track
        </Link>
        {session && session.user ? (
          <button
            onClick={() => signOut()}
            className="font-bold text-lg text-white px-6 py-3 rounded-3xl border-4 border-black bg-bybPink shadow-neo-brutalism hover:bg-pink-400 hover:text-white transition"
          >
            Sign Out
          </button>
        ) : null}
      </div>
    </nav>
  );
}
