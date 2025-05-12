import csv from 'csv-parser';
import { Readable } from 'stream';
import dbConnect from '@/utils/dbConnect';
import Fixture from '@/models/Fixture';


// Export configuration for the API route
export const config = {
  api: {
    bodyParser: false,  // Disable the default body parser to handle file uploads manually
  },
};

// Define POST for file uploads
export async function POST(req) {
  try {
    // Retrieve form data from the request
    const formData = await req.formData();
    const file = formData.get('file');  // Get the uploaded file

    // Check if a file was uploaded
    if (!file) {
      // No file uploaded
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,  // Bad Request
      });
    }

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Connect to the database
    await dbConnect();

    // Initialize an array, store the parsed fixtures
    const fixtures = [];
    // Create a readable stream from the buffer
    const stream = Readable.from(buffer);

    // Process data
    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          try {
            // Parse each row and add it to the fixtures array
            fixtures.push({
              fixture_mid: row.fixture_mid,
              season: parseInt(row.season),
              competition_name: row.competition_name,
              fixture_datetime: new Date(row.fixture_datetime),
              fixture_round: parseInt(row.fixture_round),
              home_team: row.home_team,
              away_team: row.away_team,
            });
          } catch (error) {
            // Reject if there is an error in parsing a row
            reject(new Error(`Invalid row format: ${error.message}`));
          }
        })
        .on('end', () => resolve())           // Resolve the promise when the stream ends
        .on('error', (err) => reject(err));   // Reject the promise if there is an error
    });

    // Insert into database
    const result = await Fixture.insertMany(fixtures, {
      ordered: false,   // Allow unordered inserts to continue on error
    });

    // Return success response with the number of inserted and duplicate fixtures
    return Response.json({
      success: true,
      inserted: result.length,
      duplicates: fixtures.length - result.length,
    });
  } catch (error) {
    // upload fails, return error
    return new Response(
      JSON.stringify({
        error: 'Upload failed',
        details: error.message,
      }),
      { status: 500 }   // Inrernal Server Error
    );
  }
}
