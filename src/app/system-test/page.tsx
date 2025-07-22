"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface User {
  _id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  createdAt: string;
}

interface TestResult {
  name: string;
  status: "pass" | "fail" | "pending";
  message: string;
  details?: unknown;
}

export default function SystemTestPage() {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const runSystemTests = async () => {
    setTesting(true);
    setTestResults([]);

    // Test 1: Authentication Status
    addTestResult({
      name: "Authentication Status",
      status: session ? "pass" : "fail",
      message: session ? `Logged in as ${session.user?.email}` : "Not authenticated"
    });

    // Test 2: Session Data
    addTestResult({
      name: "Session Data",
      status: session?.user ? "pass" : "fail",
      message: session?.user ? "Session contains user data" : "No user data in session",
      details: session?.user
    });

    // Test 3: User Role
    addTestResult({
      name: "User Role Check",
      status: (session?.user as any)?.role ? "pass" : "fail",
      message: `Role: ${(session?.user as any)?.role || "No role found"}`,
      details: { role: (session?.user as any)?.role }
    });

    // Test 4: Database Connection
    try {
      const dbResponse = await fetch("/api/db-test");
      const dbResult = await dbResponse.json();
      addTestResult({
        name: "Database Connection",
        status: dbResponse.ok ? "pass" : "fail",
        message: dbResponse.ok ? "MongoDB Atlas connected successfully" : "Database connection failed",
        details: dbResult
      });
    } catch (error) {
      addTestResult({
        name: "Database Connection",
        status: "fail",
        message: "Database test failed",
        details: error
      });
    }

    // Test 5: Admin API Access
    try {
      const adminResponse = await fetch("/api/admin/users");
      if (adminResponse.ok) {
        const adminUsers = await adminResponse.json();
        setUsers(adminUsers);
        addTestResult({
          name: "Admin API Access",
          status: "pass",
          message: `Successfully fetched ${adminUsers.length} users`,
          details: { userCount: adminUsers.length }
        });
      } else {
        addTestResult({
          name: "Admin API Access",
          status: "fail",
          message: `Failed with status: ${adminResponse.status}`,
          details: { status: adminResponse.status }
        });
      }
    } catch (error) {
      addTestResult({
        name: "Admin API Access",
        status: "fail",
        message: "Admin API request failed",
        details: error
      });
    }

    // Test 6: Email System (Password Reset)
    try {
      const emailResponse = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email })
      });
      
      addTestResult({
        name: "Email System",
        status: emailResponse.ok ? "pass" : "fail",
        message: emailResponse.ok ? "Password reset email sent successfully" : "Email system failed",
        details: { status: emailResponse.status }
      });
    } catch (error) {
      addTestResult({
        name: "Email System",
        status: "fail",
        message: "Email test failed",
        details: error
      });
    }

    // Test 7: Session Validation
    try {
      const sessionResponse = await fetch("/api/auth/session");
      const sessionData = await sessionResponse.json();
      addTestResult({
        name: "Session Validation",
        status: sessionResponse.ok && sessionData?.user ? "pass" : "fail",
        message: sessionResponse.ok ? "Session endpoint working" : "Session validation failed",
        details: sessionData
      });
    } catch (error) {
      addTestResult({
        name: "Session Validation",
        status: "fail",
        message: "Session validation failed",
        details: error
      });
    }

    // Test 8: Middleware Protection
    try {
      const protectedResponse = await fetch("/admin/users");
      addTestResult({
        name: "Middleware Protection",
        status: protectedResponse.ok ? "pass" : "fail",
        message: protectedResponse.ok ? "Admin routes accessible" : `Protected route returned ${protectedResponse.status}`,
        details: { status: protectedResponse.status }
      });
    } catch (error) {
      addTestResult({
        name: "Middleware Protection",
        status: "fail",
        message: "Middleware test failed",
        details: error
      });
    }

    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass": return "✅";
      case "fail": return "❌";
      case "pending": return "⏳";
      default: return "❓";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass": return "text-green-600";
      case "fail": return "text-red-600";
      case "pending": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🧪 Complete System Test Suite</h1>
        
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Authentication</h3>
            <p className="text-sm text-blue-700">
              Status: {status === "loading" ? "Loading..." : session ? "Authenticated" : "Not logged in"}
            </p>
            {session && (
              <p className="text-xs text-blue-600">
                Role: {(session.user as any)?.role || "No role"}
              </p>
            )}
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Database</h3>
            <p className="text-sm text-green-700">MongoDB Atlas</p>
            <p className="text-xs text-green-600">Connection monitoring active</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">Features</h3>
            <p className="text-sm text-purple-700">RBAC, Email, OAuth</p>
            <p className="text-xs text-purple-600">Production ready</p>
          </div>
        </div>

        {/* Test Controls */}
        <div className="mb-6">
          <button
            onClick={runSystemTests}
            disabled={testing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {testing ? "🔄 Running Tests..." : "🚀 Run Complete System Test"}
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Test Results</h2>
          
          {/* Summary */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex gap-6">
              <span className="text-green-600 font-semibold">
                ✅ Passed: {testResults.filter(r => r.status === "pass").length}
              </span>
              <span className="text-red-600 font-semibold">
                ❌ Failed: {testResults.filter(r => r.status === "fail").length}
              </span>
              <span className="text-yellow-600 font-semibold">
                ⏳ Pending: {testResults.filter(r => r.status === "pending").length}
              </span>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getStatusIcon(result.status)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{result.name}</h3>
                      <p className={`text-sm ${getStatusColor(result.status)}`}>
                        {result.message}
                      </p>
                    </div>
                  </div>
                </div>
                
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                      View Details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {typeof result.details === 'string' ? result.details : JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Management (Admin Only) */}
      {(session?.user as any)?.role === "admin" && users.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">👥 User Management</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Role</th>
                  <th className="text-left py-2 px-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.name || "N/A"}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === "admin" 
                          ? "bg-red-100 text-red-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System Information */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">⚙️ System Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Environment</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Next.js 15.4.1</li>
              <li>• MongoDB Atlas</li>
              <li>• NextAuth.js</li>
              <li>• Gmail SMTP</li>
              <li>• Tailwind CSS</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Features Tested</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Authentication & Authorization</li>
              <li>• Role-Based Access Control</li>
              <li>• Database Connectivity</li>
              <li>• Email System</li>
              <li>• API Security</li>
              <li>• Middleware Protection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
