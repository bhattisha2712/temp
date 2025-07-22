"use client";

import { useEffect, useState } from "react";

export default function OAuth2ConfigPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/oauth-config")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Google OAuth Configuration Helper</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Current Configuration</h2>
        <div className="space-y-2">
          <div className="flex">
            <span className="font-medium text-gray-600 w-48">Base URL:</span>
            <span className="text-gray-900">{config?.currentSettings?.baseUrl}</span>
          </div>
          <div className="flex">
            <span className="font-medium text-gray-600 w-48">Google Client ID:</span>
            <span className="text-gray-900 break-all">{config?.currentSettings?.googleClientId}</span>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-red-800">Required Google Cloud Console Settings</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium text-red-700 mb-2">Authorized redirect URIs</h3>
          <div className="bg-white p-3 rounded border">
            <code className="text-sm text-gray-900">{config?.currentSettings?.requiredRedirectUri}</code>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-red-700 mb-2">Authorized JavaScript origins</h3>
          <div className="bg-white p-3 rounded border">
            <code className="text-sm text-gray-900">{config?.currentSettings?.requiredJavaScriptOrigin}</code>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Step-by-Step Instructions</h2>
        <ol className="space-y-3">
          {config?.instructions?.map((instruction: string, index: number) => (
            <li key={index} className="flex">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-700">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          <strong>Important:</strong> After making changes in Google Cloud Console, it may take a few minutes for the changes to propagate. 
          You might need to wait 5-10 minutes before testing again.
        </p>
      </div>

      <div className="mt-6 text-center">
        <a 
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Test Google OAuth After Configuration
        </a>
      </div>
    </div>
  );
}
