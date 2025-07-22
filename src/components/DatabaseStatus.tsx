'use client';

import { useState, useEffect } from 'react';

export default function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const response = await fetch('/api/db-test');
        const data = await response.json();
        
        if (data.success) {
          setStatus('connected');
        } else {
          setStatus('disconnected');
          setError(data.error || 'Database connection failed');
        }
      } catch (err) {
        setStatus('disconnected');
        setError('Failed to check database status');
      }
    };

    checkDatabaseStatus();
  }, []);

  if (status === 'checking') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-800">Checking database connection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-800">Database connected successfully</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-800">Database connection failed</p>
          <p className="text-xs text-red-600 mt-1">{error}</p>
          <div className="mt-2">
            <a 
              href="/db-troubleshoot" 
              className="text-sm text-red-600 hover:text-red-500 underline"
            >
              Click here to troubleshoot →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
