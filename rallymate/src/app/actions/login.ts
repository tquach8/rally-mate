"use server";

import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { SignJWT } from 'jose'

const SECRET_KEY = process.env.SECRET_SESSION || "secret";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const result = await db.sql`SELECT * FROM users WHERE email = ${email}`;

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const encodedKey = new TextEncoder().encode(SECRET_KEY)
    const sessionToken = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(encodedKey)
    const cookie = await cookies();

    cookie.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in production only
      maxAge: 60 * 60 * 4, // 1 hour in seconds
      sameSite: 'lax',
      path: '/',
    });
  } catch (error) {
    console.error(error);
  }

  redirect("/profile");
}
