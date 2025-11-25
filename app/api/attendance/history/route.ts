import { NextResponse } from "next/server"

let prisma: any = null
try {
    const prismaModule = require("@/lib/prisma")
    prisma = prismaModule.prisma
} catch (error) {
    console.log("[v0] Prisma not available for history")
}

// GET attendance history grouped by date and grade
export async function GET(request: Request) {
    try {
        if (!prisma) {
            return NextResponse.json([])
        }

        const attendance = await prisma.attendance.findMany({
            include: {
                student: true,
            },
            orderBy: { date: "desc" },
        })

        const grouped = attendance.reduce((acc: any, record) => {
            const dateKey = record.date.toISOString().split("T")[0]
            const grade = record.student.grade || "Sin grado"
            const key = `${dateKey}_${grade}`

            if (!acc[key]) {
                acc[key] = {
                    fecha: dateKey,
                    grupo: grade,
                    asistencias: [],
                }
            }

            acc[key].asistencias.push({
                id: record.student.id,
                name: `${record.student.firstName} ${record.student.lastName}`,
                status: record.status,
                observations: record.observations || "",
            })

            return acc
        }, {})

        return NextResponse.json(Object.values(grouped))
    } catch (error) {
        console.error("[v0] Error fetching history:", error)
        return NextResponse.json([])
    }
}