'use client';

import { useState } from 'react';

export default function LocalMongoSetup() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'success' | 'error'>('idle');
  const [output, setOutput] = useState<string[]>([]);

  const handleInstallLocal = async () => {
    setIsInstalling(true);
    setInstallStatus('installing');
    setOutput(['Starting local MongoDB setup...']);

    try {
      const response = await fetch('/api/setup-local-db', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setInstallStatus('success');
        setOutput(prev => [...prev, 'Local MongoDB setup completed successfully!']);
      } else {
        setInstallStatus('error');
        setOutput(prev => [...prev, `Error: ${data.error}`]);
      }
    } catch (error) {
      setInstallStatus('error');
      setOutput(prev => [...prev, `Failed to setup local MongoDB: ${error}`]);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Local MongoDB Setup
          </h1>
          
          <div className="mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    MongoDB Atlas Connection Issue Detected
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Your MongoDB Atlas connection is timing out. This tool will help you set up a local MongoDB instance as a fallback.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Quick Solutions:</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Option 1: Fix Atlas Connection</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Try these steps to fix your MongoDB Atlas connection:
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Check your internet connection</li>
                    <li>• Verify IP allowlist in MongoDB Atlas</li>
                    <li>• Test connection from another network</li>
                    <li>• Check if your ISP blocks port 27017</li>
                  </ul>
                  <a 
                    href="/db-troubleshoot" 
                    className="inline-block mt-3 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Run Diagnostics
                  </a>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Option 2: Use Local MongoDB</h3>
                  <p className="text-sm text-green-800 mb-3">
                    Set up a local MongoDB instance for development:
                  </p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Installs MongoDB Community Edition</li>
                    <li>• Configures local database</li>
                    <li>• Updates your environment variables</li>
                    <li>• No internet connection required</li>
                  </ul>
                  <button
                    onClick={handleInstallLocal}
                    disabled={isInstalling}
                    className="mt-3 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {isInstalling ? 'Setting up...' : 'Setup Local DB'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {output.length > 0 && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <h3 className="text-white mb-2">Setup Output:</h3>
              {output.map((line, index) => (
                <div key={index} className="mb-1">{line}</div>
              ))}
            </div>
          )}

          {installStatus === 'success' && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Setup Complete!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Local MongoDB is now running. Restart your development server to use the local database.</p>
                  </div>
                  <div className="mt-3">
                    <a href="/" className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      Go to Home Page
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Setup Instructions</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">
                If the automatic setup doesn't work, you can manually install MongoDB:
              </p>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Download MongoDB Community Edition from <a href="https://www.mongodb.com/try/download/community" className="text-blue-600 hover:underline" target="_blank">mongodb.com</a></li>
                <li>Install MongoDB following the official documentation</li>
                <li>Start MongoDB service: <code className="bg-gray-200 px-1 rounded">mongod</code></li>
                <li>Update your <code className="bg-gray-200 px-1 rounded">.env.local</code> file:</li>
              </ol>
              <div className="mt-3 bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                MONGODB_URI=mongodb://localhost:27017/your-app-name
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
