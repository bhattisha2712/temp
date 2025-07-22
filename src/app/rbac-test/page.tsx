"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function RBACTestPage() {
  const { data: session } = useSession();
  const [testResults, setTestResults] = useState<Record<string, unknown>>({});
  const [testing, setTesting] = useState(false);

  const runRBACTests = async () => {
    setTesting(true);
    const results: Record<string, unknown> = {};

    // Test 1: Current user role
    results.currentRole = session?.user?.role || "not logged in";
    results.currentUser = session?.user?.email || "anonymous";

    // Test 2: Admin API access
    try {
      const response = await fetch("/api/admin/users");
      results.adminAPIAccess = {
        status: response.status,
        accessible: response.ok,
        message: response.ok ? "✅ Admin API accessible" : "❌ Admin API blocked"
      };
    } catch (error) {
      results.adminAPIAccess = {
        status: "error",
        accessible: false,
        message: "❌ Admin API error"
      };
    }

    // Test 3: Admin route check (client-side)
    results.adminRouteCheck = {
      shouldAccess: session?.user?.role === "admin",
      message: session?.user?.role === "admin" 
        ? "✅ Should have admin access" 
        : "❌ Should NOT have admin access"
    };

    setTestResults(results);
    setTesting(false);
  };

  const TestCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">RBAC Testing Dashboard</h1>
        <p className="text-gray-600">
          Test Role-Based Access Control functionality and verify security permissions.
        </p>
      </div>

      {/* Current Session Info */}
      <TestCard title="Current Session">
        <div className="space-y-2">
          <p><strong>User:</strong> {session?.user?.email || "Not logged in"}</p>
          <p><strong>Role:</strong> 
            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
              session?.user?.role === "admin" 
                ? "bg-blue-100 text-blue-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {session?.user?.role || "guest"}
            </span>
          </p>
          <p><strong>Status:</strong> {session ? "✅ Authenticated" : "❌ Not authenticated"}</p>
        </div>
      </TestCard>

      {/* Test Runner */}
      <div className="my-6">
        <button
          onClick={runRBACTests}
          disabled={testing}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? "Running Tests..." : "Run RBAC Tests"}
        </button>
      </div>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Test Results</h2>
          
          <TestCard title="User Information">
            <div className="space-y-2">
              <p><strong>Role:</strong> {testResults.currentRole}</p>
              <p><strong>Email:</strong> {testResults.currentUser}</p>
            </div>
          </TestCard>

          <TestCard title="Admin API Access Test">
            <div className="space-y-2">
              <p><strong>HTTP Status:</strong> {testResults.adminAPIAccess?.status}</p>
              <p><strong>Result:</strong> {testResults.adminAPIAccess?.message}</p>
              <div className={`p-3 rounded-lg ${
                testResults.adminAPIAccess?.accessible 
                  ? "bg-green-50 text-green-800" 
                  : "bg-red-50 text-red-800"
              }`}>
                {testResults.adminAPIAccess?.accessible 
                  ? "✅ API access granted (you have admin permissions)" 
                  : "❌ API access denied (you don't have admin permissions)"}
              </div>
            </div>
          </TestCard>

          <TestCard title="Route Access Validation">
            <div className="space-y-2">
              <p>{testResults.adminRouteCheck?.message}</p>
              <div className="mt-4 space-y-2">
                <a 
                  href="/admin" 
                  className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  Test Admin Dashboard →
                </a>
                <br />
                <a 
                  href="/admin/users" 
                  className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  Test User Management →
                </a>
              </div>
            </div>
          </TestCard>
        </div>
      )}

      {/* Manual Testing Guide */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-800 mb-3">Manual Testing Steps</h3>
        <ol className="list-decimal list-inside space-y-2 text-yellow-700">
          <li>Run the automated tests above</li>
          <li>Try accessing <code>/admin</code> - should match your role</li>
          <li>Try accessing <code>/admin/users</code> - admin only</li>
          <li>If you're admin, try changing user roles</li>
          <li>Check audit logs at <code>/admin/audit</code></li>
          <li>Test with different user accounts</li>
        </ol>
      </div>

      {/* Security Status */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-3">Security Features Active</h3>
        <ul className="space-y-2 text-blue-700">
          <li>✅ Middleware protection on /admin/* routes</li>
          <li>✅ Server-side role validation on APIs</li>
          <li>✅ Session-based authentication</li>
          <li>✅ Admin self-protection (can't demote self)</li>
          <li>✅ Last admin protection</li>
          <li>✅ Audit logging for all role changes</li>
          <li>✅ Email/Slack notifications for security events</li>
        </ul>
      </div>
    </div>
  );
}
