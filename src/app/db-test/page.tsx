"use client";

import { useEffect, useState } from "react";

export default function DatabaseTestPage() {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/db-test")
      .then((res) => res.json())
      .then((data) => {
        setDbStatus(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setDbStatus({
          status: "Error",
          error: error.message,
          message: "Failed to test database connection"
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Testing database connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Database Connection Test</h1>
      
      <div className={`rounded-lg p-6 mb-6 ${
        dbStatus?.status === "Connected" 
          ? "bg-green-50 border border-green-200" 
          : "bg-red-50 border border-red-200"
      }`}>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {dbStatus?.status === "Connected" ? (
            <>
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="text-green-800">Database Connected</span>
            </>
          ) : (
            <>
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span className="text-red-800">Database Connection Failed</span>
            </>
          )}
        </h2>
        
        <div className="space-y-2">
          <div className="flex">
            <span className="font-medium text-gray-600 w-32">Status:</span>
            <span className={dbStatus?.status === "Connected" ? "text-green-700" : "text-red-700"}>
              {dbStatus?.status}
            </span>
          </div>
          <div className="flex">
            <span className="font-medium text-gray-600 w-32">Message:</span>
            <span className="text-gray-900">{dbStatus?.message}</span>
          </div>
          <div className="flex">
            <span className="font-medium text-gray-600 w-32">Time:</span>
            <span className="text-gray-900">{dbStatus?.timestamp}</span>
          </div>
          {dbStatus?.error && (
            <div className="flex">
              <span className="font-medium text-gray-600 w-32">Error:</span>
              <span className="text-red-700 break-all">{dbStatus.error}</span>
            </div>
          )}
        </div>
      </div>

      {dbStatus?.status !== "Connected" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Troubleshooting Steps:</h3>
          <ol className="space-y-2 text-blue-700">
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
              <span>Check if your MongoDB Atlas cluster is running (not paused)</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
              <span>Verify your IP address is in the MongoDB Atlas allowlist (Network Access)</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
              <span>Check that your database user credentials are correct</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
              <span>Ensure your firewall is not blocking the connection</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">5</span>
              <span>Try using 0.0.0.0/0 as IP allowlist for testing (less secure)</span>
            </li>
          </ol>
        </div>
      )}

      <div className="mt-6 text-center">
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Test Again
        </button>
      </div>
    </div>
  );
}
