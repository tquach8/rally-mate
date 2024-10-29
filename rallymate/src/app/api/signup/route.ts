import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // const db = await connectToDatabase();
    // const events = await db.collection('schedules').find().toArray();

    const events = ["test"];
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching schedules.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log("test");
  try {
    // const db = await connectToDatabase();
    // const events = await db.collection('schedules').find().toArray();
    const { searchParams } = new URL(request.url);
    debugger;
    const petName = searchParams.get('petName');
    const ownerName = searchParams.get('ownerName');

    try {
      if (!petName || !ownerName) throw new Error('Pet and owner names required');
      await sql`INSERT INTO Pets (Name, Owner) VALUES (${petName}, ${ownerName});`;
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    const pets = await sql`SELECT * FROM Pets;`;
    return NextResponse.json({ pets }, { status: 200 });

    const events = ["test"];
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching schedules.' },
      { status: 500 }
    );
  }
}
