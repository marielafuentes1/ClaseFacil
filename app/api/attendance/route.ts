import PocketBase from "pocketbase";

// Definir el tipo de un 'record' de asistencia
interface Asistencia {
  studentName: string;
  status: string;
  studentId: string;
}

const pb = new PocketBase("http://127.0.0.1:8090");

export async function POST(req: Request) {
  const body = await req.json();
  const { date, asistencias, teacherId } = body;

  try {
    const isoDate = new Date(date).toISOString();  // Convierte la fecha a formato ISO

    const records = await Promise.all(
      asistencias.map((record: Asistencia) =>
        pb.collection("asistencias").create({
          date: isoDate,  // Fecha en formato ISO
          alumno: record.studentName,  // Nombre del alumno
          estado: record.status,  // Estado de la asistencia
          studentId: record.studentId,  // ID del estudiante
          teacherId,  // ID del profesor
        })
      )
    );

    return new Response(JSON.stringify(records), { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("[ERROR] Error al guardar asistencia:", err.message);
    } else {
      console.error("[ERROR] Error desconocido");
    }

    return new Response(JSON.stringify({ error: "Error al guardar" }), { status: 500 });
  }
}
