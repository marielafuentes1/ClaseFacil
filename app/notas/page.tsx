"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";

const CLASSES = ["1A", "1B", "2A", "2B", "3A", "3B"];

async function actualizarCalificacion({
  id,
  calificacionPorActualizar,
}: {
  id: string;
  calificacionPorActualizar: string;
}) {
  const data = {
    id: id,
    calificacion: calificacionPorActualizar,
  };

  // Crear un nuevo registro en la colección "calificaciones"
  const record = await pb.collection('calificaciones').update(id, data);
    return record;
  }

export default function AsistenciaPage() {
  const queryClient = useQueryClient();

  // Llamada al hook dentro del componente
  const mutacionParaActualizarCalificacionDeUnEstudiante = useMutation({
    mutationFn: actualizarCalificacion,
    onSuccess: () => {
      // Invalidate and refetch, en este caso las calificaciones
      queryClient.invalidateQueries({ queryKey: ["calificaciones"] });
    },
  });

  const [selectedClass, setSelectedClass] = useState<"1ºA" | "1ºB" | "2ºA">(
    "1ºA"
  );

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  async function obtenerInformacionDeCalificaciones() {
    const records = await pb.collection("calificaciones").getFullList({
    });
    return records;
  }

  const query = useQuery({
    queryKey: ["calificaciones"],
    queryFn: obtenerInformacionDeCalificaciones,
  });

  if (query.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Hubo un problema:</p>
        <p className="text-xl text-gray-600">{query.error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Registrar Calificaciones</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="class" className="text-sm font-medium text-gray-700">
                Grado:
              </label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="rounded-lg border-2 border-gray-800 bg-white px-3 py-2 text-gray-800 font-medium"
              >
                {CLASSES.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="date" className="text-sm font-medium text-gray-700">
                Fecha:
              </label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border-2 border-gray-800 bg-white px-3 py-2 text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-hidden rounded-2xl border-2 border-gray-800 bg-red-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-gray-800 bg-red-300">
                <tr>
                  <th className="border-r-2 border-gray-800 px-6 py-4 text-left font-semibold text-gray-800">
                    Fecha
                  </th>
                  <th className="border-r-2 border-gray-800 px-6 py-4 text-left font-semibold text-gray-800">
                    Alumno
                  </th>
                  <th className="border-r-2 border-gray-800 px-6 py-4 text-left font-semibold text-gray-800">
                    Calificación
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">
                    Observaciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {query.data?.map((student, index) => (
                  <tr
                    key={student.id}
                    className={index !== query.data?.length - 1 ? "border-b-2 border-gray-800" : ""}
                  >
                    <td className="border-r-2 border-gray-800 px-6 py-4 text-gray-800">
                      {new Date(selectedDate).toLocaleDateString("es-ES")}
                    </td>
                    <td className="border-r-2 border-gray-800 px-6 py-4 text-gray-800">
                      {student.nombre}
                    </td>
                    <td className="border-r-2 border-gray-800 px-6 py-4">
                      <input
                        type="number"
                        value={student.calificacion || ""}
                        onChange={(e) =>
                          mutacionParaActualizarCalificacionDeUnEstudiante.mutate({
                            id: student.id, 
                            calificacionPorActualizar: e.target.value, 
                          })
                        }
                        placeholder="Agregar calificación..."
                        className="w-full rounded-lg border border-gray-800 bg-white px-3 py-1 text-gray-800"
                      />
                    </td>
                    <td className="px-6 py-4">
                      {/* Aquí también puedes incluir la lógica de observaciones si es necesario */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
