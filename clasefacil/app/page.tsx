"use client"

import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: number
  name: string
  status: "Presente" | "Ausente" | "Tarde"
  observations: string
}

interface SavedAttendance {
  fecha: string
  grupo: string
  asistencias: Student[]
}

const CLASSES = {
  "1A": [
    { id: 1, name: "Juan Pérez", status: "Presente" as const, observations: "" },
    { id: 2, name: "María García", status: "Presente" as const, observations: "" },
    { id: 3, name: "Carlos López", status: "Presente" as const, observations: "" },
    { id: 4, name: "Ana Martínez", status: "Presente" as const, observations: "" },
    { id: 5, name: "Luis Rodríguez", status: "Presente" as const, observations: "" },
  ],
  "1B": [
    { id: 6, name: "Pedro Sánchez", status: "Presente" as const, observations: "" },
    { id: 7, name: "Laura Torres", status: "Presente" as const, observations: "" },
    { id: 8, name: "Diego Ramírez", status: "Presente" as const, observations: "" },
    { id: 9, name: "Sofía Morales", status: "Presente" as const, observations: "" },
    { id: 10, name: "Miguel Fernández", status: "Presente" as const, observations: "" },
  ],
  "2A": [
    { id: 11, name: "Elena Castro", status: "Presente" as const, observations: "" },
    { id: 12, name: "Roberto Díaz", status: "Presente" as const, observations: "" },
    { id: 13, name: "Carmen Ruiz", status: "Presente" as const, observations: "" },
    { id: 14, name: "Javier Ortiz", status: "Presente" as const, observations: "" },
    { id: 15, name: "Isabel Vargas", status: "Presente" as const, observations: "" },
  ],
}

export default function AsistenciaPage() {
  const [selectedClass, setSelectedClass] = useState<keyof typeof CLASSES>("1A")
  const [students, setStudents] = useState<Student[]>(CLASSES["1A"])
  const [savedAttendance, setSavedAttendance] = useState<SavedAttendance[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    try {
      const saved = localStorage.getItem("attendance_records")
      if (saved) {
        setSavedAttendance(JSON.parse(saved))
      }
    } catch (error) {
      console.log("[v0] Error loading saved attendance:", error)
    }
  }, [])

  useEffect(() => {
    const recordKey = `${selectedDate}_${selectedClass}`
    const recordForDate = savedAttendance.find((r) => r.fecha === selectedDate && r.grupo === selectedClass)
    if (recordForDate) {
      setStudents(recordForDate.asistencias)
    } else {
      setStudents(CLASSES[selectedClass])
    }
  }, [selectedDate, selectedClass, savedAttendance])

  const handleClassChange = (newClass: keyof typeof CLASSES) => {
    setSelectedClass(newClass)
  }

  const updateStudentStatus = (id: number, status: "Presente" | "Ausente" | "Tarde") => {
    setStudents((prev) => prev.map((student) => (student.id === id ? { ...student, status } : student)))
  }

  const updateStudentObservations = (id: number, observations: string) => {
    setStudents((prev) => prev.map((student) => (student.id === id ? { ...student, observations } : student)))
  }

  const handleSaveAttendance = async () => {
    setIsSaving(true)

    try {
      const newRecord = { fecha: selectedDate, grupo: selectedClass, asistencias: students }
      const updatedRecords = savedAttendance.filter((r) => !(r.fecha === selectedDate && r.grupo === selectedClass))
      updatedRecords.push(newRecord)
      localStorage.setItem("attendance_records", JSON.stringify(updatedRecords))
      setSavedAttendance(updatedRecords)

      toast({
        title: "Asistencia guardada",
        description: `Asistencia del ${new Date(selectedDate).toLocaleDateString("es-ES")} - Grupo ${selectedClass} guardada correctamente`,
      })
    } catch (error) {
      console.error("[v0] Error saving attendance:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la asistencia",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const presentes = students.filter((s) => s.status === "Presente").length
  const ausentes = students.filter((s) => s.status === "Ausente").length
  const tardes = students.filter((s) => s.status === "Tarde").length
  const total = students.length

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
            <h1 className="text-3xl font-bold text-gray-800">Tomar Asistencia</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="class" className="text-sm font-medium text-gray-700">
                Grado:
              </label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value as keyof typeof CLASSES)}
                className="rounded-lg border-2 border-gray-800 bg-white px-3 py-2 text-gray-800 font-medium"
              >
                {Object.keys(CLASSES).map((className) => (
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

        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-xl border-2 border-gray-800 bg-blue-100 p-4">
            <p className="text-sm font-medium text-gray-600">Total Alumnos</p>
            <p className="text-3xl font-bold text-gray-800">{total}</p>
          </div>
          <div className="rounded-xl border-2 border-gray-800 bg-green-100 p-4">
            <p className="text-sm font-medium text-gray-600">Presentes</p>
            <p className="text-3xl font-bold text-green-700">{presentes}</p>
          </div>
          <div className="rounded-xl border-2 border-gray-800 bg-red-100 p-4">
            <p className="text-sm font-medium text-gray-600">Ausentes</p>
            <p className="text-3xl font-bold text-red-700">{ausentes}</p>
          </div>
          <div className="rounded-xl border-2 border-gray-800 bg-yellow-100 p-4">
            <p className="text-sm font-medium text-gray-600">Tarde</p>
            <p className="text-3xl font-bold text-yellow-700">{tardes}</p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-hidden rounded-2xl border-2 border-gray-800 bg-green-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-gray-800 bg-green-200">
                <tr>
                  <th className="border-r-2 border-gray-800 px-6 py-4 text-left font-semibold text-gray-800">fecha</th>
                  <th className="border-r-2 border-gray-800 px-6 py-4 text-left font-semibold text-gray-800">alumno</th>
                  <th className="border-r-2 border-gray-800 px-6 py-4 text-left font-semibold text-gray-800">estado</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">observaciones</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className={index !== students.length - 1 ? "border-b-2 border-gray-800" : ""}>
                    <td className="border-r-2 border-gray-800 px-6 py-4 text-gray-800">
                      {new Date(selectedDate).toLocaleDateString("es-ES")}
                    </td>
                    <td className="border-r-2 border-gray-800 px-6 py-4 text-gray-800">{student.name}</td>
                    <td className="border-r-2 border-gray-800 px-6 py-4">
                      <select
                        value={student.status}
                        onChange={(e) =>
                          updateStudentStatus(student.id, e.target.value as "Presente" | "Ausente" | "Tarde")
                        }
                        className="rounded-lg border border-gray-800 bg-white px-3 py-1 text-gray-800"
                      >
                        <option value="Presente">Presente</option>
                        <option value="Ausente">Ausente</option>
                        <option value="Tarde">Tarde</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={student.observations}
                        onChange={(e) => updateStudentObservations(student.id, e.target.value)}
                        placeholder="Agregar observación..."
                        className="w-full rounded-lg border border-gray-800 bg-white px-3 py-1 text-gray-800"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t-2 border-gray-800 bg-green-200 p-4">
            <Button
              onClick={handleSaveAttendance}
              disabled={isSaving}
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              {isSaving ? "Guardando..." : "Guardar Asistencia"}
            </Button>
          </div>
        </div>

        {savedAttendance.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Historial de Asistencia</h2>
            <div className="space-y-2">
              {savedAttendance
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .map((record) => {
                  const presentes = record.asistencias.filter((s) => s.status === "Presente").length
                  const ausentes = record.asistencias.filter((s) => s.status === "Ausente").length
                  const tardes = record.asistencias.filter((s) => s.status === "Tarde").length

                  return (
                    <div
                      key={`${record.fecha}_${record.grupo}`}
                      className="flex items-center justify-between rounded-lg border-2 border-gray-800 bg-white p-4"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {new Date(record.fecha).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })} - Grado {record.grupo}
                        </p>
                        <p className="text-sm text-gray-600">
                          Presentes: {presentes} | Ausentes: {ausentes} | Tarde: {tardes}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedDate(record.fecha)
                          setSelectedClass(record.grupo as keyof typeof CLASSES)
                        }}
                      >
                        Ver detalles
                      </Button>
                    </div>
                  )
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
