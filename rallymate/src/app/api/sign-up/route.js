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
