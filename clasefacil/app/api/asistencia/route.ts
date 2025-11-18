import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

function getTeacherIdFromCookie(userCookieValue: string): number | null {
    try {
        const user = JSON.parse(userCookieValue);
        const teacherId = Number(user.id);
        return Number.isNaN(teacherId) ? null : teacherId;
    } catch {
        return null;
    }
}

// =============================
//          POST
// =============================
export async function POST(request: NextRequest) {
    try {
        const cookieStore: ReadonlyRequestCookies = cookies();
        const userCookie = cookieStore.get("user");

        if (!userCookie) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const teacherId = getTeacherIdFromCookie(userCookie.value);

        if (!teacherId) {
            return NextResponse.json(
                { error: "ID de profesor inválido en cookie" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { asistencias } = body;

        if (!Array.isArray(asistencias)) {
            return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 🔥 ESTA ES LA PARTE CORREGIDA SIN ERRORES
        const dbOperations = asistencias.flatMap((item: any) => {
            const studentId = Number(item.studentId);
            if (Number.isNaN(studentId)) return [];

            return prisma.attendance
                .findFirst({
                    where: {
                        studentId,
                        date: { gte: today },
                    },
                })
                .then(existing => {
                    if (existing) {
                        return prisma.attendance.update({
                            where: { id: existing.id },
                            data: { status: item.status },
                        });
                    }

                    return prisma.attendance.create({
                        data: {
                            studentId,
                            teacherId,
                            status: item.status,
                        },
                    });
                });
        });

        const results = await prisma.$transaction(dbOperations);

        return NextResponse.json({
            success: true,
            message: "Asistencia guardada correctamente",
            data: results,
        });
    } catch (error) {
        console.error("Error al guardar asistencia:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// =============================
//          GET
// =============================
export async function GET(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const userCookie = cookieStore.get("user");

        if (!userCookie) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const asistenciaHoy = await prisma.attendance.findMany({
            where: { date: { gte: today } },
            include: { student: true },
        });

        return NextResponse.json({
            success: true,
            data: asistenciaHoy,
        });
    } catch (error) {
        console.error("Error al obtener asistencia:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
