'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [logs, setLogs] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('SFMC');

  useEffect(() => {
    fetch('/api/logs').then(res => res.json()).then(data => setLogs(data));
  }, []);

  const deleteFile = async (fileName: string) => {
    await fetch('/api/logs', { method: 'DELETE', body: JSON.stringify({ fileName }), headers: {'Content-Type': 'application/json'} });
    setLogs(logs.filter(l => l.file !== fileName));
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Cebu POC</h1>
      <p className="text-gray-500">S3 Import Logs</p>
      
      <div className="my-5 space-x-4">
        {['CIAM', 'SFMC', 'ODS', 'Insider'].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className="px-4 py-2 bg-blue-500 text-white rounded">
            {cat}
          </button>
        ))}
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">File Name</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Errors</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {logs.filter(l => l.folder === activeCategory).map((row, i) => (
            <tr key={i}>
              <td className="border p-2">{row.file}</td>
              <td className="border p-2">{row.total}</td>
              <td className="border p-2 text-red-500">{row.errors}</td>
              <td className="border p-2"><button onClick={() => deleteFile(row.file)} className="text-red-600 font-bold">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}