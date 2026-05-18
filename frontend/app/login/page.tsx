"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (document.cookie.includes("demo_auth=true")) {
      router.replace("/");
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        document.cookie = "demo_auth=true; path=/; max-age=86400";
        router.replace("/");
      } else if (response.status === 401) {
        setError("Incorrect password. Try again.");
      } else {
        const data = await response.json();
        setError(data?.error || "Unable to validate password.");
      }
    } catch (err) {
      setError("Unable to validate password.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-700 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/30">
        <h1 className="text-3xl font-semibold mb-4">Technowand Demo Access</h1>
        <p className="text-sm leading-6 text-slate-400 mb-6">
          This internal staging environment is protected by a shared access password. Enter the password to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-100">
            Access password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="Enter shared password"
            />
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full justify-center rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Validating..." : "Unlock demo environment"}
          </button>
        </form>
      </div>
    </main>
  );
}
