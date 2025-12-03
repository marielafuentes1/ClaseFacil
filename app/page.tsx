"use client";

import Link from "next/link";
import { ArrowLeft, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
// import { getPocketBase } from "@/lib/pocketbase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
interface Student {
  id: number;
  name: string;
  status: "Presente" | "Ausente" | "Tarde";
  observations: string;
}

interface SavedAttendance {
  fecha: string;
  grupo: string;
  asistencias: Student[];
}

const CLASSES = ["1A", "1B", "2A", "2B", "3A", "3B"];

export default function AsistenciaPage() {
  // const pb = getPocketBase();

  const queryClient = useQueryClient();
  async function actualizarEstado({
    id, //definicion de parametro
    estadoPorActualizar,
  }: {
    id: string;
    estadoPorActualizar: "presente" | "ausente" | "tarde"; // definicion del tipo de parametro
  }) {
    // example update data
    const data = {
      estado: estadoPorActualizar,
    };
    const record = await pb.collection("asistencias").update(id, data);
    return record;
  }

  async function actualizarObservacion({
    id, //definicion de parametro
    observacionPorActualizar,
  }: {
    id: string;
    observacionPorActualizar: string; // definicion del tipo de parametro
  }) {
    // example update data
    const data = {
      observaciones: observacionPorActualizar,
    };
  }
  //  function name(params:type) {

  //   }

  //   async (params:type) => {

  //   }

  // Mutations
  const mutacionParaActualizarElEstadoDeUnEstudiante = useMutation({
    mutationFn: actualizarEstado,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["asistencias"] });
    },
  });

  const mutacionParaActualizarObservacionDeUnEstudiante = useMutation({
    mutationFn: actualizarObservacion,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["asistencia"] });
    },
  });

  const [selectedClass, setSelectedClass] = useState<"1ºA" | "1ºB" | "2ºA">(
    "1ºA"
  );

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  async function obtenerInformacionDeEstudiante() {
    const records = await pb.collection("estudiantes").getFullList({
      filter: `grado = "${selectedClass}"`,
      sort: "nombre",
    });
    console.table(records);
    return records;
  }
  const query = useQuery({
    queryKey: ["estudiantes"],
    queryFn: obtenerInformacionDeEstudiante,
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
            <h1 className="text-3xl font-bold text-gray-800">
              Tomar Asistencia
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="class"
                className="text-sm font-medium text-gray-700"
              >
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
              <label
                htmlFor="date"
                className="text-sm font-medium text-gray-700"
              >
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

        {/* Totals */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-xl border-2 border-gray-800 bg-blue-100 p-4">
            <p className="text-sm font-medium text-gray-600">Total Alumnos</p>
            <p className="text-3xl font-bold text-gray-800">
              {query.data?.length}
            </p>
          </div>
          <div className="rounded-xl border-2 border-gray-800 bg-green-100 p-4">
            <p className="text-sm font-medium text-gray-600">Presentes</p>
            {/* const presentes = students.filter((s) => s.status === "Presente").length; */}
            <p className="text-3xl font-bold text-green-700">
              {
                query.data?.filter(
                  (estudiante) => estudiante.estado === "Presente"
                ).length
              }
            </p>
          </div>
          <div className="rounded-xl border-2 border-gray-800 bg-red-100 p-4">
            <p className="text-sm font-medium text-gray-600">Ausentes</p>
            <p className="text-3xl font-bold text-green-700">
              {
                query.data?.filter(
                  (estudiante) => estudiante.estado === "Ausente"
                ).length
              }
            </p>
          </div>
          <div className="rounded-xl border-2 border-gray-800 bg-yellow-100 p-4">
            <p className="text-sm font-medium text-gray-600">Tarde</p>
            <p className="text-3xl font-bold text-green-700">
              {
                query.data?.filter(
                  (estudiante) => estudiante.estado === "Tarde"
                ).length
              }
            </p>{" "}
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-hidden rounded-2xl border-2 border-gray-800 bg-green-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-gray-800 bg-green-200">
                <tr>
                  <th className="border-r-2 border-gray-800 px-6 py-4 text-left font-semibold text-gray-800">
                    fecha
                  </th>
                  <th className="border-r-2 border-gray-800 px-6 py-4 text-left font-semibold text-gray-800">
                    alumno
                  </th>
                  <th className="border-r-2 border-gray-800 px-6 py-4 text-left font-semibold text-gray-800">
                    estado
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">
                    observaciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {query.data?.map((student, index) => (
                  <tr
                    key={student.id}
                    className={
                      index !== query.data?.length - 1
                        ? "border-b-2 border-gray-800"
                        : ""
                    }
                  >
                    <td className="border-r-2 border-gray-800 px-6 py-4 text-gray-800">
                      {new Date(selectedDate).toLocaleDateString("es-ES")}
                    </td>
                    <td className="border-r-2 border-gray-800 px-6 py-4 text-gray-800">
                      {student.nombre}
                    </td>
                    <td className="border-r-2 border-gray-800 px-6 py-4">
                      <select
                        value={student.status}
                        onChange={(e) =>
                          mutacionParaActualizarElEstadoDeUnEstudiante.mutate({
                            id: student.id,
                            estadoPorActualizar: e.target.value as
                              | "presente"
                              | "ausente"
                              | "tarde",
                          })
                        }
                        className="rounded-lg border border-gray-800 bg-white px-3 py-1 text-gray-800"
                      >
                        <option value="presente">Presente</option>
                        <option value="ausente">Ausente</option>
                        <option value="tarde">Tarde</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={student.observations}
                        onChange={(e) =>
                          mutacionParaActualizarObservacionDeUnEstudiante.mutate(
                            {
                              id: student.id,
                              observacionPorActualizar: e.target.value,
                            }
                          )
                        }
                        placeholder="Agregar observación..."
                        className="w-full rounded-lg border border-gray-800 bg-white px-3 py-1 text-gray-800"
                      />
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
