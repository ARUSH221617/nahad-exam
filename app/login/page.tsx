import { login, signup } from './actions'

export default async function LoginPage({
    searchParams,
  }: {
    searchParams: Promise<{ message: string; error?: string }>
  }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
      <form className="flex w-full max-w-md flex-col gap-2 p-4 border rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login / Sign Up</h1>

        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md border px-4 py-2 bg-inherit"
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />

        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md border px-4 py-2 bg-inherit"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />

        <div className="flex gap-2 mt-4">
          <button
            formAction={login}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Log In
          </button>
          <button
            formAction={signup}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Sign Up
          </button>
        </div>

        {/* We need to handle async params in Next.js 15+ */}
        <MessageParams searchParams={searchParams} />
      </form>
    </div>
  )
}

async function MessageParams({ searchParams }: { searchParams: Promise<{ message: string; error?: string }> }) {
    const params = await searchParams;
    if (params?.error) {
        return <p className="mt-4 p-4 bg-red-100 text-red-900 text-center">{params.error}</p>
    }
    if (params?.message) {
        return <p className="mt-4 p-4 bg-neutral-100 text-neutral-900 text-center">{params.message}</p>
    }
    return null;
}
