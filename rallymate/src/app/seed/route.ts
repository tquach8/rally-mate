import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";
import { users } from "../lib/placeholder-data";
import { User } from "../lib/definitions";
import { schedules } from "../lib/placeholder-data";
import { Schedule } from "../lib/definitions";

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

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedSchedule();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
