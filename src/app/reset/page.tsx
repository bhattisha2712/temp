"use client";
import { useState } from "react";

export default function ResetRequestPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetLink, setResetLink] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    setResetLink("");
    
    try {
      const res = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }
      
      const data = await res.json();
      setMessage(data.message || "Request submitted.");
      
      // Handle development mode with mock reset link
      if (data.devMode && data.resetLink) {
        setResetLink(data.resetLink);
        console.log(`🔗 Reset link: ${window.location.origin}${data.resetLink}`);
      }
    } catch (err) {
      console.error("Reset request error:", err);
      setError("Failed to send reset request. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-semibold mb-4">Reset Your Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="w-full border px-3 py-2 disabled:opacity-50"
        />
        <button 
          className="bg-blue-600 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        
        {message && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-sm text-green-800">{message}</p>
            {resetLink && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800 font-semibold mb-2">
                  🚀 Development Mode - Test Reset Link:
                </p>
                <a 
                  href={resetLink}
                  className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Test Password Reset →
                </a>
                <p className="text-xs text-blue-600 mt-2">
                  This link is only available in development mode
                </p>
              </div>
            )}
          </div>
        )}
      </form>
    </main>
  );
}
