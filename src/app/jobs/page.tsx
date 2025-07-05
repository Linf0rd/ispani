"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Jobs() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-bybYellow flex items-center justify-center" style={{backgroundColor: '#FFE066'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-bybBlack"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bybYellow pt-24 px-6" style={{backgroundColor: '#FFE066'}}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-4 border-black rounded-3xl shadow-neo-brutalism p-8">
          <h1 className="text-4xl font-bold text-bybBlack mb-6">Job Applications</h1>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-bold text-bybBlack mb-4">No Applications Yet</h2>
            <p className="text-lg text-gray-700 mb-8">
              Start tracking your job applications to stay organized and increase your chances of success!
            </p>
            
            <button className="font-bold text-lg text-white px-8 py-4 rounded-3xl border-4 border-black bg-blue-500 shadow-neo-brutalism hover:bg-blue-400 transition">
              Add Your First Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
