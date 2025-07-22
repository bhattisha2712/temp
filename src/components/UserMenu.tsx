"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  
  if (!session) {
    return (
      <button 
        onClick={() => signIn()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Sign In
      </button>
    );
  }

  const handleSignOut = () => {
    signOut({ 
      callbackUrl: "/login",
      redirect: true 
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
          </span>
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900">
            {session.user?.name || session.user?.email}
          </div>
          <div className="text-xs text-gray-500">
            Role: {session.user?.role || "user"}
          </div>
        </div>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="font-medium text-gray-900">{session.user?.email}</div>
            <div className="text-sm text-gray-500">
              {session.user?.role === "admin" ? "Administrator" : "User"}
            </div>
          </div>
          
          <div className="py-1">
            <a
              href="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setShowDropdown(false)}
            >
              Dashboard
            </a>
            {session.user?.role === "admin" && (
              <>
                <a
                  href="/admin"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  Admin Dashboard
                </a>
                <a
                  href="/admin/users"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  User Management
                </a>
              </>
            )}
            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
