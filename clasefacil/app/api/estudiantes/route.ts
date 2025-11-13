import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

//para la lista de estudiantes
// GET: listar alumnos

export async function GET() {
    try {
        const cookieStore = await cookies()
        const userCookie = cookieStore.get("user")

        if (!userCookie) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const students = await prisma.student.findMany({
            orderBy: { lastName: "asc" },
        })

        return NextResponse.json({
            success: true,
            data: students,
        })
    } catch (error) {
        console.error("Error al obtener alumnos:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}


// POST: crear alumno

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const userCookie = cookieStore.get("user")

        if (!userCookie) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const body = await request.json()
        const { firstName, lastName, grade } = body

        if (!firstName || !lastName) {
            return NextResponse.json({ error: "Nombre y apellido obligatorios" }, { status: 400 })
        }

        const newStudent = await prisma.student.create({
            data: {
                firstName,
                lastName,
                grade: grade || null,
            },
        })

        return NextResponse.json({
            success: true,
            message: "Alumno creado correctamente",
            data: newStudent,
        })
    } catch (error) {
        console.error("Error al crear alumno:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
