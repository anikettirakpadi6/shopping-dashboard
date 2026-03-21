"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    // redirect to login after success
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-lg p-10 rounded-xl shadow-lg bg-white"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">Create Account</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm mb-4 p-3 rounded-lg">
        {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2 text-gray-800"> Name</label>
          <input
        type="text"
        placeholder="Enter your name"
        className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2 text-gray-800">Email</label>
          <input
        type="email"
        placeholder="Enter your email"
        className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-800">Password</label>
          <input
        type="password"
        placeholder="Create a strong password"
        className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <span
        className="text-black-600 font-semibold cursor-pointer hover:underline"
        onClick={() => router.push("/login")}
          >
        Login here
          </span>
        </p>
      </form>
    </div>
  );
}
