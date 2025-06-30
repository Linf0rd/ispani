import { signIn } from 'next-auth/react'

export default function SignIn() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Sign in to iSpani</h1>
      <button
        onClick={() => signIn('google')}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Sign in with Google
      </button>
    </div>
  )
}
