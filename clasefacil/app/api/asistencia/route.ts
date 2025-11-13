import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const userCookie = cookieStore.get("user")

        if (!userCookie) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const body = await request.json()
        const { asistencias } = body

        if (!asistencias || !Array.isArray(asistencias)) {
            return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const results = []

        for (const item of asistencias) {
            const existing = await prisma.attendance.findFirst({
                where: {
                    studentId: item.studentId,
                    date: { gte: today },
                },
            })

            let saved

            if (existing) {
                // ACTUALIZAR si ya existe
                saved = await prisma.attendance.update({
                    where: { id: existing.id },
                    data: { status: item.status },
                })
            } else {
                //  CREAR si no existe
                saved = await prisma.attendance.create({
                    data: {
                        studentId: item.studentId,
                        status: item.status,
                    },
                })
            }

            results.push(saved)
        }

        return NextResponse.json({
            success: true,
            message: "Asistencia guardada correctamente",
            data: results,
        })
    } catch (error) {
        console.error("Error al guardar asistencia:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const userCookie = cookieStore.get("user")

        if (!userCookie) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const asistenciaHoy = await prisma.attendance.findMany({
            where: {
                date: {
                    gte: today,
                },
            },
            include: {
                student: true,
            },
        })

        return NextResponse.json({
            success: true,
            data: asistenciaHoy,
        })
    } catch (error) {
        console.error("Error al obtener asistencia:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
