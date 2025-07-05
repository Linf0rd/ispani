"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    // Verify the email
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (response) => {
        const data = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setMessage('Your email has been verified successfully! You can now sign in to your account.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred during verification. Please try again.');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-bybYellow flex items-center justify-center p-4" style={{backgroundColor: '#FFE066'}}>
      <div className="bg-white border-4 border-black rounded-3xl shadow-neo-brutalism p-8 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-bybBlack mb-6">
            Email Verification
          </h1>
          
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="text-lg text-bybBlack">Verifying your email...</div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bybBlack mx-auto"></div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-6">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <p className="text-lg text-bybBlack mb-6">{message}</p>
              <Link 
                href="/"
                className="inline-block font-bold text-lg text-white px-8 py-4 rounded-3xl border-4 border-black bg-green-500 shadow-neo-brutalism hover:bg-green-400 transition"
              >
                Go to Sign In
              </Link>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-6">
              <div className="text-red-600 text-6xl mb-4">✗</div>
              <p className="text-lg text-bybBlack mb-6">{message}</p>
              <div className="space-y-4">
                <Link 
                  href="/"
                  className="inline-block font-bold text-lg text-white px-8 py-4 rounded-3xl border-4 border-black bg-bybPink shadow-neo-brutalism hover:bg-pink-400 transition"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
