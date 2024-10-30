"use server";

import { getUser } from "@/app/lib/dal";
import { db } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSession(formData: FormData) {
  const courtId = formData.get("courtId") as string;
  const date = formData.get("date") as string;
  const players = formData.get("maxPlayers") as string;
  const type = formData.get("type") as string;
  const hours = formData.get("hours") as string;
  const user = await getUser();

  try {
    await db.sql`BEGIN`;
    const result = await db.sql`
      INSERT INTO court_sessions (user_id, court_id, start_time, number_of_hours, max_players, type)
      VALUES (${user?.id}, ${courtId}, ${date}, ${hours}, ${players}, ${type})
      ON CONFLICT DO NOTHING
      RETURNING *;
    `;

    await db.sql`
        INSERT INTO court_session_players (court_session_id, user_id)
        VALUES (${result.rows[0].id}, ${user?.id})
        ON CONFLICT DO NOTHING;
    `;
    await db.sql`COMMIT`;

    revalidatePath("/dashboard/find-courts");
  } catch (error) {
    await db.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
