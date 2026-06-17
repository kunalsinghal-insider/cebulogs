'use client';
import { useState } from 'react';

export default function Home() {
  const [logs, setLogs] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('SFMC');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // We send the typed password directly to the API to check it
    const res = await fetch('/api/logs', {
      headers: { 'x-api-key': password }
    });

    if (res.status === 200) {
      const data = await res.json();
      setLogs(data);
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password');
    }
  };

  const deleteFile = async (fileName: string) => {
    const confirmed = confirm(`Are you sure you want to delete ${fileName}?`);
    if (!confirmed) return;

    const res = await fetch('/api/logs', {
      method: 'DELETE',
      body: JSON.stringify({ fileName }),
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': password 
      },
    });

    if (res.ok) {
      setLogs(logs.filter((l) => l.file !== fileName));
    }
  };

  // 1. Login Screen UI
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Cebu POC Access</h1>
        <input
          type="password"
          placeholder="Enter Password"
          className="border p-3 mb-4 rounded w-64 shadow-sm"
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    );
  }

  // 2. Main Dashboard UI
  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">Cebu POC</h1>
      <p className="text-gray-500 mb-6">S3 Import Logs</p>

      <div className="my-5 flex gap-2">
        {['CIAM', 'SFMC', 'ODS', 'Insider'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded font-medium transition ${
              activeCategory === cat ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border-b p-4">File Name</th>
              <th className="border-b p-4">Total</th>
              <th className="border-b p-4">Errors</th>
              <th className="border-b p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {logs
              .filter((l) => l.folder === activeCategory)
              .map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border-b p-4">{row.file}</td>
                  <td className="border-b p-4">{row.total}</td>
                  <td className="border-b p-4 text-red-600 font-semibold">{row.errors}</td>
                  <td className="border-b p-4">
                    <button
                      onClick={() => deleteFile(row.file)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}