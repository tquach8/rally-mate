import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

const client = await db.connect();

export async function GET(request) {
  try {
    const { userId } = request.url.split('?')[1]; // Assuming userId is passed as a query parameter
    const matches = await client.sql`
      SELECT DISTINCT s1.user_id
      FROM schedules s1
      JOIN schedules s2 ON s1.availability_time = s2.availability_time
      WHERE s1.user_id != s2.user_id
      AND s1.user_id = ${userId};
    `;

    return NextResponse.json(matches.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches.' }, { status: 500 });
  }
}
