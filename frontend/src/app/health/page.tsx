'use client';

import { useState, useEffect } from 'react';

// Define proper types
interface HealthData {
  status: string;
  database?: string;
  hf_token?: string;
  secret_key?: string;
  message?: string;
  timestamp?: string;
}

interface ChatResponse {
  response: string;
  chat_id: string;
  timestamp: string;
}

interface BackendData {
  health: HealthData | null;
  chat: ChatResponse | null;
}

export default function HealthCheck() {
  const [status, setStatus] = useState<string>('Checking...');
  const [backendUrl, setBackendUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [backendData, setBackendData] = useState<BackendData | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    setBackendUrl(url || 'Not set');
  }, []);

  const checkBackend = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    setBackendUrl(url || 'Not set');
    
    if (!url) {
      setStatus('❌ NEXT_PUBLIC_API_URL is not set in environment variables');
      return;
    }

    setLoading(true);
    setStatus('Testing connection...');

    try {
      // Test health endpoint
      const healthResponse = await fetch(`${url}/health`);
      let healthData: HealthData | null = null;
      
      if (healthResponse.ok) {
        healthData = await healthResponse.json();
        console.log('Health check response:', healthData);
        
        // Test chat endpoint
        const chatResponse = await fetch(`${url}/api/send?user_id=test123`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: 'Hello, this is a test message' })
        });
        
        let chatData: ChatResponse | null = null;
        if (chatResponse.ok) {
          chatData = await chatResponse.json();
        } else {
          chatData = {
            response: `Error: ${chatResponse.status}`,
            chat_id: '',
            timestamp: new Date().toISOString()
          };
        }
        
        setBackendData({
          health: healthData,
          chat: chatData
        });
        
        setStatus(`✅ Backend is connected and responding!`);
      } else {
        setStatus(`❌ Backend health check failed with status: ${healthResponse.status}`);
        setBackendData(null);
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setStatus(`❌ Cannot connect to ${url}. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setBackendData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-purple-700">System Health Check</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Backend Configuration</h2>
          <div className="mb-4">
            <p className="text-gray-700">
              <strong>Backend URL:</strong>{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                {backendUrl}
              </code>
            </p>
            {backendUrl === 'Not set' && (
              <p className="text-red-600 mt-2">
                ⚠️ Environment variable NEXT_PUBLIC_API_URL is not set. Please add it in Cloudflare Pages settings.
              </p>
            )}
          </div>
          
          <button
            onClick={checkBackend}
            disabled={loading || backendUrl === 'Not set'}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Testing...' : 'Test Backend Connection'}
          </button>
          
          {status && (
            <div className={`mt-4 p-4 rounded ${
              status.includes('✅') 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : status.includes('❌')
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-gray-50 border border-gray-200 text-gray-700'
            }`}>
              <p>{status}</p>
            </div>
          )}
        </div>
        
        {backendData && backendData.health && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Backend Response Data</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Health Check:</h3>
              <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
                {JSON.stringify(backendData.health, null, 2)}
              </pre>
            </div>
            
            {backendData.chat && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Chat Test Response:</h3>
                <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
                  {JSON.stringify(backendData.chat, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Access this page at: <code className="bg-gray-100 px-2 py-1 rounded">https://hopepath.online/health</code></p>
        </div>
      </div>
    </div>
  );
}