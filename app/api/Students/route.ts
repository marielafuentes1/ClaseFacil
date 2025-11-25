import { NextResponse } from "next/server"

let prismaInstance: any = null
try {
    const prismaModule = require("@/lib/prisma")
    prismaInstance = prismaModule.prisma
} catch (error) {
    console.log("[v0] Prisma not available, using mock data")
}

// GET all students
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const grade = searchParams.get("grade")

        if (!prismaInstance) {
            return NextResponse.json([
                { id: 1, firstName: "Juan", lastName: "Pérez", grade: grade || "1A" },
                { id: 2, firstName: "María", lastName: "González", grade: grade || "1A" },
                { id: 3, firstName: "Carlos", lastName: "Rodríguez", grade: grade || "1A" },
                { id: 4, firstName: "Ana", lastName: "Martínez", grade: grade || "1A" },
                { id: 5, firstName: "Luis", lastName: "Fernández", grade: grade || "1A" },
                { id: 6, firstName: "Sofia", lastName: "López", grade: grade || "1A" },
                { id: 7, firstName: "Diego", lastName: "Sánchez", grade: grade || "1A" },
                { id: 8, firstName: "Valentina", lastName: "Díaz", grade: grade || "1A" },
            ])
        }

        const students = await prismaInstance.student.findMany({
            where: grade ? { grade } : undefined,
            orderBy: { firstName: "asc" },
        })

        return NextResponse.json(students)
    } catch (error) {
        console.error("[v0] Error fetching students:", error)
        return NextResponse.json([])
    }
}

// POST create new student
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { firstName, lastName, grade } = body

        const student = await prismaInstance.student.create({
            data: {
                firstName,
                lastName,
                grade,
            },
        })

        return NextResponse.json(student)
    } catch (error) {
        console.error("[v0] Error creating student:", error)
        return NextResponse.json({ error: "Error al crear estudiante" }, { status: 500 })
    }
}
