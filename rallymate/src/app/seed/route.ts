import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";
import { users, courts, schedules } from "../lib/placeholder-data";
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
  }),
);

return insertedSchedule;
}
async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
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
        INSERT INTO users (name, email, password)
        VALUES (${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedCourts() {
  await client.sql`DROP TABLE IF EXISTS courts`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS courts (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      location POINT NOT NULL
    );
  `;

  const insertedCourts = await Promise.all(
    courts.map(async (court: Court) => {
      return client.sql`
        INSERT INTO courts (name, display_name, location)
        VALUES (${court.name}, ${court.display_name}, point(${court.location.lat}, ${court.location.lng}))
        ON CONFLICT DO NOTHING;
      `;
    }),
  );

  return insertedCourts;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedSchedule();
    await seedCourts();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
