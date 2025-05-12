'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SearchPage() {
  // State to store current search term entered by user
  const [searchTerm, setSearchTerm] = useState('');
  // State to store search results
  const [results, setResults] = useState([]);
  // State to store current selected fixture
  const [selectedFixture, setSelectedFixture] = useState(null);

  // Search when user types
  useEffect(() => {
    // If the search term is empty, clear the results and return
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }

    // Set a timer to debounce the search input
    const timer = setTimeout(async () => {
      // Fetch data from search API endpoint
      const res = await fetch(`/api/search?query=${searchTerm}`);
      // Parse JSON response
      const data = await res.json();
      // Update results state with fetched data
      setResults(data);
    }, 0);

    // Clear timer if search term changes
    return () => clearTimeout(timer);
  }, [searchTerm]);     // Re-run the effect when searchTerm changes

  return (
    <div className="py-20 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Search Teams</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Upload
        </Link>
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder="Search by Team Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-4 border rounded-lg shadow-sm"
      />

      {/* Result List */}
      <div className="space-y-2">
        {results.map((fixture) => (
          <div
            key={fixture._id}
            onClick={() => setSelectedFixture(fixture)}
            className={`p-3 border rounded-lg cursor-pointer ${
              selectedFixture?._id === fixture._id 
                ? 'bg-blue-50 border-blue-300' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">
              {fixture.home_team} vs {fixture.away_team}
            </div>
            

            {/* Expand Details */}
            {selectedFixture?._id === fixture._id && (
              <div className="mt-2 pt-2 border-t">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="col-span-2">
                    <span className="font-semibold">Season:</span> {fixture.season}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold">Round:</span> {fixture.fixture_round}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold">Date:</span> {new Date(fixture.fixture_datetime).toLocaleDateString()}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold">Time:</span> {new Date(fixture.fixture_datetime).toLocaleTimeString()}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold">Competition Name:</span> {fixture.competition_name}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold">Home Team:</span> {fixture.home_team}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold">Away Team:</span> {fixture.away_team}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {searchTerm && results.length === 0 && (
        <p className="text-center py-8 text-gray-500">
          No record found for "{searchTerm}".
        </p>
      )}
    </div>
  );
}