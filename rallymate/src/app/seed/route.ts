import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";
import {
  users,
  courts,
  courtSessions,
  courtSessionPlayers,
  schedules,
} from "../lib/placeholder-data";
import { User, Schedule, Court } from "../lib/definitions";

const client = await db.connect();
async function seedSchedule() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS schedules (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      availability_time TIMESTAMPTZ NOT NULL
    );
`;
  const insertedSchedule = await Promise.all(
    schedules.map(async (schedule: Schedule) => {
      return client.sql`
      INSERT INTO schedules (user_id, availability_time)
      VALUES (${schedule.user_id}, ${schedule.availability_time})
      ON CONFLICT DO NOTHING;
    `;
    })
  );

  return insertedSchedule;
}
async function seedUsers() {
  await client.sql`DROP TABLE IF EXISTS users CASCADE`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user: User) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

async function seedCourts() {
  await client.sql`DROP TABLE IF EXISTS courts CASCADE`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS courts (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      location POINT NOT NULL,
      number_of_courts INTEGER NOT NULL
    );
  `;

  const insertedCourts = await Promise.all(
    courts.map(async (court: Court) => {
      return client.sql`
        INSERT INTO courts (name, display_name, location, number_of_courts)
        VALUES (${court.name}, ${court.display_name}, point(${court.location.lat}, ${court.location.lng}), ${court.number_of_courts})
        ON CONFLICT DO NOTHING;
      `;
    })
  );

  return insertedCourts;
}

async function seedCourtSessions() {
  await client.sql`DROP TABLE IF EXISTS court_sessions CASCADE`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS court_sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      court_id INTEGER REFERENCES courts(id) ON DELETE CASCADE,
      start_time TIMESTAMPTZ NOT NULL,
      number_of_hours INTEGER NOT NULL,
      max_players INTEGER NOT NULL,
      type INTEGER NOT NULL
    );
  `;

  // type 0 = Rally, type 1 = Singles, type 2 = Doubles

  const insertedCourtSessions = await Promise.all(
    courtSessions.map(async (courtSession) => {
      return client.sql`
        INSERT INTO court_sessions (user_id, court_id, start_time, number_of_hours, max_players, type)
        VALUES (${courtSession.user_id}, ${courtSession.court_id}, ${courtSession.start_time}, ${courtSession.number_of_hours}, ${courtSession.max_players}, ${courtSession.type})
        ON CONFLICT DO NOTHING;
      `;
    })
  );

  return insertedCourtSessions;
}

async function seedCourtSessionPlayers() {
  await client.sql`DROP TABLE IF EXISTS court_session_players CASCADE`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS court_session_players (
      id SERIAL PRIMARY KEY,
      court_session_id INTEGER REFERENCES court_sessions(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT unique_user_court_session UNIQUE (user_id, court_session_id)
    );
  `;

  const insertedCourtSessionPlayers = await Promise.all(
    courtSessionPlayers.map(async (courtSessionPlayer) => {
      return client.sql`
        INSERT INTO court_session_players (court_session_id, user_id)
        VALUES (${courtSessionPlayer.court_session_id}, ${courtSessionPlayer.user_id})
        ON CONFLICT DO NOTHING;
      `;
    })
  );

  return insertedCourtSessionPlayers;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedSchedule();
    await seedCourts();
    await seedCourtSessions();
    await seedCourtSessionPlayers();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
