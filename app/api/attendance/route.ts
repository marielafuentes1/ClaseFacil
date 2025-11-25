import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"  // Asegurate de que esta ruta sea correcta

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const grade = searchParams.get("grade")

    const whereClause: any = {}

    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      whereClause.date = {
        gte: startDate,
        lte: endDate,
      }
    }

    if (grade) {
      whereClause.student = {
        grade,
      }
    }

    const attendance = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: true,
        teacher: true,
      },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error("[v0] Error fetching attendance:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { date, grade, asistencias, teacherId } = body

    // Elimina asistencias existentes del mismo día y grado
    await prisma.attendance.deleteMany({
      where: {
        date: new Date(date),
        student: { grade },
      },
    })

    // Crea nuevas asistencias
    const attendanceRecords = await Promise.all(
      asistencias.map((record: any) =>
        prisma.attendance.create({
          data: {
            date: new Date(date),
            status: record.status,
            observations: record.observations || null,
            studentId: record.studentId,
            teacherId: teacherId || 1,
          },
          include: { student: true },
        }),
      ),
    )

    return NextResponse.json({
      success: true,
      count: attendanceRecords.length,
      records: attendanceRecords,
    })
  } catch (error) {
    console.error("[v0] Error saving attendance:", error)
    return NextResponse.json({
      success: false,
      message: "Error with database",
    })
  }
}
