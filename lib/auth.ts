"use server"

import { cookies } from "next/headers"

interface User {
  id: string
  name: string
  email: string
}

// Simulated user database (in a real app, this would be in a database)
const users: Array<User & { password: string }> = []

export async function register(name: string, email: string, password: string) {
  // Check if user already exists
  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    return { success: false, error: "El usuario ya existe" }
  }

  // Create new user
  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    password, // In production, hash this password!
  }
  users.push(newUser)

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set("user_session", JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { success: true }
}

export async function login(email: string, password: string) {
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return { success: false, error: "Credenciales inválidas" }
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set("user_session", JSON.stringify({ id: user.id, name: user.name, email: user.email }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { success: true }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("user_session")
  return { success: true }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("user_session")

  if (!sessionCookie) {
    return null
  }

  try {
    const user = JSON.parse(sessionCookie.value) as User
    return user
  } catch {
    return null
  }
}
