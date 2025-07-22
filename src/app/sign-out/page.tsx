"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function SignOutPage() {
  const { data: session } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut({ 
      callbackUrl: "/login",
      redirect: true 
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign Out & Refresh Session</h1>
        
        {session ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Current Session</h3>
              <p className="text-blue-700">Email: {session.user.email}</p>
              <p className="text-blue-700">Role: {session.user.role}</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Why Sign Out?</h3>
              <p className="text-yellow-700">
                You've been promoted to admin, but your current session still shows the old role. 
                Sign out and sign back in to refresh your session with admin privileges.
              </p>
            </div>
            
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {signingOut ? "Signing Out..." : "Sign Out & Go to Login"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Ready to Sign In</h3>
              <p className="text-green-700">
                You're not currently signed in. Sign in with your promoted admin account to test RBAC.
              </p>
            </div>
            
            <a
              href="/login"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 text-center"
            >
              Go to Login Page
            </a>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">After Signing Back In</h3>
        <p className="text-gray-700 mb-3">Once you sign back in with admin privileges, test these:</p>
        <ul className="space-y-2 text-gray-600">
          <li>✅ <a href="/current-users" className="text-blue-600 underline">Current Users</a> - Should show user list</li>
          <li>✅ <a href="/rbac-test" className="text-blue-600 underline">RBAC Test</a> - Should show admin access</li>
          <li>✅ <a href="/admin" className="text-blue-600 underline">Admin Dashboard</a> - Should work</li>
          <li>✅ <a href="/admin/users" className="text-blue-600 underline">User Management</a> - Should work</li>
        </ul>
      </div>
    </div>
  );
}
