/* eslint-disable */
  // @ts-nocheck 
import 'server-only'

import { cookies } from 'next/headers'
import { db } from '@vercel/postgres'
import { decrypt } from '@/app/lib/session'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import {User } from '@/app/lib/definitions'

export const verifySession = cache(async (): Promise<{isAuth: boolean, userId: number}> => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId }
})

export const getUser = cache(async (): Promise<User | null> => {
  const session = await verifySession()
  if (!session) return null

  try {
    const data = await db.sql`SELECT * FROM users WHERE id = ${session.userId}`
    const user = data.rows[0]

    return user as User
  } catch (error) {
    console.log('Failed to fetch user', error)
    return null
  }
})
