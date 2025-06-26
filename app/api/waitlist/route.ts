import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone)
}

function isValidName(name: string): boolean {
  return name.trim().length >= 2
}

function isValidCity(city: string): boolean {
  return city.trim().length >= 2
}

export async function POST(req: Request) {
  try {
    const raw = await req.json()
    const fullName = raw.fullName?.trim()
    const phoneNumber = raw.phoneNumber?.trim()
    const email = raw.email?.trim().toLowerCase()
    const city = raw.city?.trim()

    if (!fullName || !phoneNumber || !email || !city) {
      return NextResponse.json({ error: "All fields are required" }, { status: 401 })
    }

    if (!isValidName(fullName)) {
      return NextResponse.json({ error: "Invalid name" }, { status: 402 })
    }

    if (!isValidPhone(phoneNumber)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 403 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 405 })
    }

    if (!isValidCity(city)) {
      return NextResponse.json({ error: "Invalid city name" }, { status: 406 })
    }

    // Check for duplicates
    const existing = await prisma.waitlistEntry.findFirst({
      where: {
        OR: [{ phoneNumber }, { email }],
      },
    })

    if (existing) {
      return NextResponse.json({ error: "You’ve already joined the waitlist." }, { status: 409 })
    }

    // Save to DB
    const newEntry = await prisma.waitlistEntry.create({
      data: { fullName, phoneNumber, email, city },
    })

    return NextResponse.json({ message: "Added to waitlist", data: newEntry }, { status: 200 })

  } catch (error) {
    console.error("Error saving waitlist entry:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
