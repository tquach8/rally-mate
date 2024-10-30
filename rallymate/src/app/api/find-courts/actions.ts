"use server";

import { db } from "@vercel/postgres";

import { Court, CourtSession } from "@/app/lib/definitions";
import { getUser } from "@/app/lib/dal";

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
            'display_name', c.display_name,
            'location', json_build_object(
                'lat', c.location[0],
                'lng', c.location[1]
            ),
            'number_of_courts', c.number_of_courts
        ) AS court,
        cs.start_time,
        cs.number_of_hours,
        cs.max_players,
        cs.type
    FROM court_sessions cs
    JOIN courts c ON cs.court_id = c.id
    JOIN court_session_players csp ON cs.id = csp.court_session_id
    JOIN users u ON csp.user_id = u.id
    WHERE cs.court_id = ${court.id}
    GROUP BY cs.id, c.id;
  `;

  return <CourtSession[]>result.rows;
}

export async function joinCourtSession(courtSession: CourtSession): Promise<void> {
  const user = await getUser();

  await client.sql`
    INSERT INTO court_session_players (court_session_id, user_id)
    VALUES (${courtSession.id}, ${user?.id})
    ON CONFLICT DO NOTHING;
  `;
}
