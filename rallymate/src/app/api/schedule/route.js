import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

const client = await db.connect();

export async function POST(request) {
  try {
    const { userId, availabilityTime } = await request.json();
    // Insert availability time into the schedules table
    const result = await client.sql`
      INSERT INTO schedules (user_id, availability_time)
      VALUES (1, ${availabilityTime})
      RETURNING *;
    `;

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error adding schedule:', error);
    return NextResponse.json({ error: 'Failed to add availability.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await client.sql`SELECT * FROM schedules;`;
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Failed to fetch schedules.' }, { status: 500 });
  }
}
