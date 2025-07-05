"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Helper function to determine if a link is active
  const isActive = (path: string) => pathname === path;

  // Helper function to get nav button classes
  const getNavButtonClasses = (path: string) => {
    if (isActive(path)) {
      // Active state: yellow background with black text
      return "font-bold text-lg text-bybBlack px-6 py-3 rounded-3xl border-4 border-black bg-yellow-400 hover:bg-yellow-500 hover:text-bybBlack transition";
    } else {
      // Inactive state: white background with black text
      return "font-bold text-lg text-bybBlack px-6 py-3 rounded-3xl border-4 border-black bg-white hover:bg-yellow-400 hover:text-bybBlack transition";
    }
  };

  return (
    <nav className="w-full bg-bybYellow border-b-[6px] border-black shadow-neo-brutalism flex items-center justify-between px-6 py-4 fixed top-0 left-0 z-50" style={{backgroundColor: '#FFE066'}}>
      <div className="flex items-center gap-2">
        <Link href="/" className="block">
          <Image
            src="/ispani-logo.png"
            alt="iSpani"
            width={800}
            height={360}
            className="h-21 w-55"
            priority
          />
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        {session && session.user ? (
          <>
            <Link 
              href="/dashboard" 
              className={getNavButtonClasses("/dashboard")}
              style={{ boxShadow: '8px 8px 0 0 #000' }}
            >
              Dashboard
            </Link>
            <Link 
              href="/jobs" 
              className={getNavButtonClasses("/jobs")}
              style={{ boxShadow: '8px 8px 0 0 #000' }}
            >
              Jobs
            </Link>
            <Link 
              href="/track" 
              className={getNavButtonClasses("/track")}
              style={{ boxShadow: '8px 8px 0 0 #000' }}
            >
              Track
            </Link>
            <button
              onClick={() => signOut()}
              className="font-bold text-lg text-white px-6 py-3 rounded-3xl border-4 border-black bg-bybPink shadow-neo-brutalism hover:bg-pink-400 hover:text-white transition"
            >
              Sign Out
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}
