"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/"); // Redirect to home if not authenticated
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
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-bybYellow pt-24 px-6" style={{backgroundColor: '#FFE066'}}>
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-white border-4 border-black rounded-3xl shadow-neo-brutalism p-8 mb-8">
          <h1 className="text-4xl font-bold text-bybBlack mb-4">
            Welcome back, {session.user?.name || session.user?.email}! 👋
          </h1>
          <p className="text-xl text-gray-700">
            Ready to track your job applications and land your dream job?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-4 border-black rounded-3xl shadow-neo-brutalism p-6 text-center">
            <div className="text-3xl font-bold text-bybBlack mb-2">0</div>
            <div className="text-lg text-gray-700">Total Applications</div>
          </div>
          <div className="bg-white border-4 border-black rounded-3xl shadow-neo-brutalism p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <div className="text-lg text-gray-700">Interviews</div>
          </div>
          <div className="bg-white border-4 border-black rounded-3xl shadow-neo-brutalism p-6 text-center">
            <div className="text-3xl font-bold text-bybPink mb-2">0</div>
            <div className="text-lg text-gray-700">Offers</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border-4 border-black rounded-3xl shadow-neo-brutalism p-8 mb-8">
          <h2 className="text-2xl font-bold text-bybBlack mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/jobs" 
              className="flex items-center justify-between p-6 bg-blue-100 border-4 border-black rounded-3xl shadow-neo-brutalism hover:bg-blue-200 transition group"
            >
              <div>
                <h3 className="text-xl font-bold text-bybBlack">Add New Application</h3>
                <p className="text-gray-700">Track a new job application</p>
              </div>
              <div className="text-3xl group-hover:scale-110 transition-transform">📄</div>
            </Link>
            <Link 
              href="/track" 
              className="flex items-center justify-between p-6 bg-green-100 border-4 border-black rounded-3xl shadow-neo-brutalism hover:bg-green-200 transition group"
            >
              <div>
                <h3 className="text-xl font-bold text-bybBlack">View All Applications</h3>
                <p className="text-gray-700">See your application progress</p>
              </div>
              <div className="text-3xl group-hover:scale-110 transition-transform">📊</div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border-4 border-black rounded-3xl shadow-neo-brutalism p-8">
          <h2 className="text-2xl font-bold text-bybBlack mb-6">Recent Activity</h2>
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">�</div>
            <p className="text-xl">No recent activity</p>
            <p className="text-lg">Start by adding your first job application!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
