import { NextResponse } from 'next/server';   // handle HTTP responses
import dbConnect from '@/utils/dbConnect';
import Fixture from '@/models/Fixture';

export async function GET(request) {
  await dbConnect();

  // Extracting search parameters from request URL
  const { searchParams } = new URL(request.url);
  // Getting 'query' parameter from search parameters
  const query = searchParams.get('query');

  try {
    // Querying Fixture collection to find documents where either the home_team or away_team matches the query
    const fixtures = await Fixture.find({
      $or: [
        { home_team: { $regex: query, $options: 'i' } },    // $regex for pattern matching
        { away_team: { $regex: query, $options: 'i' } },    // $options: 'i' -> search case-insensitive
      ],
    }).sort({ fixture_datetime: 1 }).limit(100);            // Sort results by date, limit results to 100
    
    // Return queried fixtures as a JSON response
    return NextResponse.json(fixtures);
  } catch (error) {
    // Return a JSON response with error message and status code 500
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}