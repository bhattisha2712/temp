"use client";

import { useState } from "react";

export default function MakeAdminPage() {
  const [email, setEmail] = useState("bhattisha271201@gmail.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const makeAdmin = async () => {
    setLoading(true);
    setResult("");
    
    try {
      const response = await fetch("/api/make-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Success: ${data.message}`);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: Failed to make admin`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-yellow-800 mb-4">Make User Admin</h1>
        <p className="text-yellow-700 mb-4">
          Since you're currently a regular user, you need admin privileges to test the RBAC system. 
          This tool will promote your account to admin status.
        </p>
        <p className="text-yellow-600 text-sm">
          <strong>Note:</strong> In production, this would be done by existing admins or database administrators.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address to Promote
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter email address"
          />
        </div>

        <button
          onClick={makeAdmin}
          disabled={loading || !email}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Promoting to Admin..." : "Make Admin"}
        </button>

        {result && (
          <div className={`mt-4 p-3 rounded-lg ${
            result.startsWith("✅") 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {result}
          </div>
        )}
      </div>

      {result.startsWith("✅") && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-800 mb-3">Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-green-700">
            <li>Sign out and sign back in to refresh your session</li>
            <li>Go to <a href="/current-users" className="underline">Current Users</a> - should now show user list</li>
            <li>Visit <a href="/admin" className="underline">Admin Dashboard</a> - should now work</li>
            <li>Test <a href="/rbac-test" className="underline">RBAC System</a> - should show admin access</li>
            <li>Try <a href="/admin/users" className="underline">User Management</a> - should work</li>
          </ol>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-3">Current RBAC Test Status:</h3>
        <ul className="space-y-2 text-blue-700">
          <li>✅ <strong>User role protection working:</strong> You can't access admin features</li>
          <li>✅ <strong>API security working:</strong> Admin APIs are blocked for regular users</li>
          <li>⏳ <strong>Next test:</strong> Promote to admin and test admin features</li>
        </ul>
      </div>
    </div>
  );
}
