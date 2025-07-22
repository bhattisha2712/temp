"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export default function CurrentUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else {
          setError("Unable to fetch users - check your admin permissions");
        }
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [session]);

  const makeAdmin = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole: "admin" })
      });
      
      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user._id === userId ? { ...user, role: "admin" } : user
        ));
      } else {
        alert("Failed to update role");
      }
    } catch (error) {
      alert("Error updating role");
    }
  };

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800">Please Login</h2>
          <p className="text-yellow-700">You need to be logged in to view user information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Current System Users</h1>
        <p className="text-gray-600">
          View all users in the system and their current roles.
        </p>
      </div>

      {/* Current User Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Your Account</h2>
        <div className="space-y-1 text-blue-700">
          <p><strong>Email:</strong> {session.user.email}</p>
          <p><strong>Role:</strong> 
            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
              session.user.role === "admin" 
                ? "bg-blue-100 text-blue-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {session.user.role || "user"}
            </span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Access Error</h2>
          <p className="text-red-700">{error}</p>
          <p className="text-red-600 text-sm mt-2">
            This is normal if you don't have admin permissions.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Users ({users.length})</h2>
          </div>
          
          {users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No users found or insufficient permissions.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user._id} className="p-6 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === "admin" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                    
                    {session.user.role === "admin" && user.role !== "admin" && (
                      <button
                        onClick={() => makeAdmin(user._id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                      >
                        Make Admin
                      </button>
                    )}
                    
                    {user._id === session.user.id && (
                      <span className="text-xs text-blue-600 font-medium">You</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Admin Count Info */}
      {users.length > 0 && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">System Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Users:</span>
              <span className="ml-2 font-medium">{users.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Admin Users:</span>
              <span className="ml-2 font-medium">{users.filter(u => u.role === "admin").length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <a 
            href="/rbac-test" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Test RBAC System
          </a>
          <a 
            href="/admin" 
            className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Admin Dashboard
          </a>
          <a 
            href="/admin/users" 
            className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            User Management
          </a>
        </div>
      </div>
    </div>
  );
}
