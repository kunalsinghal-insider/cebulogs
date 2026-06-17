'use client';
import { useState } from 'react';

// This is where your data will eventually be stored/fetched
const mockData = {
  SFMC: [{ file: 'subscribers-a.csv', total: 5000, errors: 2, details: ['Row 102: Missing email', 'Row 400: Invalid format'] }],
  CIAM: [{ file: 'users-b.csv', total: 1200, errors: 0, details: [] }]
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('SFMC');

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
            <th className="border p-2">Total Rows</th>
            <th className="border p-2">Error Rows</th>
            <th className="border p-2">Error Details</th>
          </tr>
        </thead>
        <tbody>
          {(mockData[activeCategory as keyof typeof mockData] || []).map((row, i) => (
            <tr key={i}>
              <td className="border p-2">{row.file}</td>
              <td className="border p-2">{row.total}</td>
              <td className="border p-2">{row.errors}</td>
              <td className="border p-2 text-red-500">{row.details.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}