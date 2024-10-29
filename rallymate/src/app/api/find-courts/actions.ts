"use server";

import { db } from '@vercel/postgres';

import { Court } from '@/app/lib/definitions';

const client = await db.connect();

export async function getMapMarkers() {
  const result = await client.sql`
    SELECT
      id,
      name,
      display_name,
      jsonb_build_object(
          'lat', location[0],
          'lng', location[1]
      ) AS location,
      number_of_courts
    FROM courts;
  `;

  return <Court[]>result.rows;
}
