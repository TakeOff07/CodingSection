import { useState } from 'react';
import Link from 'next/link';

export default function UploadPage() {
  // State to store message for user feedback
  const [message, setMessage] = useState('');
  // Track upload
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const file = e.target.file.files[0];
    // If no file, display a message and exit
    if (!file) {
      setMessage('Please select a file');
      return;
    }
    
    // Append file to formData
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send POST request to server with file data
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessage(`Upload successful!`);
    } catch (error) {
      setMessage(`Error: ${error.message}.`);
    } finally {
      // Set loading state to false after request completed
      setIsLoading(false);
    }
  };

  return (
    <div className="p-20 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Please Upload CSV File</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          name="file"
          accept=".csv"
          required
          className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 mt-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      <div className="mt-2 text-center">
        <Link 
          href="/search"
          className="mt-6 inline-block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          prefetch={false}
        >
          Go to Search Page
        </Link>
      </div>

      {message && (
        <p className="mt-4 p-2 rounded-md">
          {message}
        </p>
      )}
    </div>
  );
}