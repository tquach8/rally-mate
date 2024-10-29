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
      availability_time TIMESTAMPTZ NOT NULL,
      UNIQUE (user_id, availability_time)
    );
`;
const insertedSchedule = await Promise.all(
  schedules.map(async (schedule: Schedule) => {
    const { user_id, availability_time } = schedule;
    const userCheck = await client.sql`
        SELECT id FROM users WHERE id = ${user_id};
      `;
      if (userCheck.rows.length === 0) {
        console.log(`User with ID ${user_id} does not exist.`);
        return null; // Skip insertion if user doesn't exist
      }

      // Insert the schedule if it doesn’t already exist for this user and time
      return client.sql`
        INSERT INTO schedules (user_id, availability_time)
        VALUES (${user_id}, ${availability_time})
        ON CONFLICT DO NOTHING;  -- Avoid duplicates per user/availability
      `;
    })
  );

  console.log("Inserted schedules:", insertedSchedule);

  const matchingAvailabilities = await client.sql`
    SELECT s1.user_id AS user_1, s2.user_id AS user_2, s1.availability_time
    FROM schedules s1
    JOIN schedules s2
      ON s1.availability_time = s2.availability_time
      AND s1.user_id < s2.user_id;  -- Only show each user pair once
  `;

  console.log("Users with matching availabilities:", matchingAvailabilities.rows);

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
