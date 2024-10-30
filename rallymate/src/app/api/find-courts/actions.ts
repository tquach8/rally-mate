"use server";

import { db } from '@vercel/postgres';

import { Court, CourtSession } from '@/app/lib/definitions';

const client = await db.connect();

export async function getMapMarkers(): Promise<Court[]> {
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

export async function getCourtSessions(court: Court): Promise<CourtSession[]> {
  const result = await client.sql`
    SELECT
      cs.id,
      json_agg(json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email
      )) AS users,
      json_build_object(
        'id', c.id,
        'name', c.name,
        'location', c.location
      ) AS court,
      cs.start_time,
      cs.number_of_hours,
      cs.max_players,
      cs.type
    FROM court_sessions cs
    JOIN users u ON cs.user_id = u.id
    JOIN courts c ON cs.court_id = c.id
    WHERE cs.court_id = ${court.id}
    GROUP BY cs.id, c.id;
  `;

  return <CourtSession[]>result.rows;
}
