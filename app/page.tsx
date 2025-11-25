"use client"

import Link from "next/link"
import { ArrowLeft, X } from "lucide-react"
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

const CLASSES = ["1A", "1B", "2A", "2B", "3A", "3B"]

export default function AsistenciaPage() {
  const [selectedClass, setSelectedClass] = useState("1A")
  const [students, setStudents] = useState<Student[]>([])
  const [savedAttendance, setSavedAttendance] = useState<SavedAttendance[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<SavedAttendance | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadStudents()
  }, [selectedClass])

  useEffect(() => {
    loadAttendanceHistory()
  }, [])

  useEffect(() => {
    loadAttendanceForDate()
  }, [selectedDate, selectedClass])

  const loadStudents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/students?grade=${selectedClass}`)

      if (!response.ok) {
        console.log("[v0] API not available, using default students")
        setStudents(getDefaultStudents())
        return
      }

      const text = await response.text()
      if (!text) {
        console.log("[v0] Empty response, using default students")
        setStudents(getDefaultStudents())
        return
      }

      try {
        const data = JSON.parse(text)

        if (Array.isArray(data) && data.length > 0) {
          const transformedStudents = data.map((student: any) => ({
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
            status: "Presente" as const,
            observations: "",
          }))
          setStudents(transformedStudents)
        } else {
          setStudents(getDefaultStudents())
        }
      } catch (parseError) {
        console.log("[v0] JSON parse error, using default students")
        setStudents(getDefaultStudents())
      }
    } catch (error) {
      console.log("[v0] Fetch error, using default students:", error)
      setStudents(getDefaultStudents())
    } finally {
      setIsLoading(false)
    }
  }

  const getDefaultStudents = (): Student[] => {
    const names = [
      "Juan Pérez",
      "María González",
      "Carlos Rodríguez",
      "Ana Martínez",
      "Luis Fernández",
      "Sofia López",
      "Diego Sánchez",
      "Valentina Díaz",
    ]

    return names.map((name, index) => ({
      id: index + 1,
      name,
      status: "Presente" as const,
      observations: "",
    }))
  }

  const loadAttendanceHistory = async () => {
    try {
      const response = await fetch("/api/attendance/history")

      if (!response.ok) {
        console.log("[v0] Could not load history from database, using localStorage")
        loadHistoryFromLocalStorage()
        return
      }

      const text = await response.text()
      if (!text) {
        loadHistoryFromLocalStorage()
        return
      }

      try {
        const data = JSON.parse(text)
        setSavedAttendance(Array.isArray(data) ? data : [])
      } catch (parseError) {
        console.log("[v0] JSON parse error in history, using localStorage")
        loadHistoryFromLocalStorage()
      }
    } catch (error) {
      console.log("[v0] Error loading history:", error)
      loadHistoryFromLocalStorage()
    }
  }

  const loadHistoryFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem("attendanceHistory")
      if (saved) {
        const parsed = JSON.parse(saved)
        setSavedAttendance(Array.isArray(parsed) ? parsed : [])
      }
    } catch (error) {
      console.error("[v0] Error loading from localStorage:", error)
      setSavedAttendance([])
    }
  }

  const loadAttendanceForDate = async () => {
    try {
      const response = await fetch(`/api/attendance?date=${selectedDate}&grade=${selectedClass}`)

      if (!response.ok) {
        console.log("[v0] No attendance found for this date, loading default students")
        loadStudents()
        return
      }

      const text = await response.text()
      if (!text) {
        loadStudents()
        return
      }

      try {
        const data = JSON.parse(text)

        if (Array.isArray(data) && data.length > 0) {
          const existingAttendance = data.map((record: any) => ({
            id: record.student.id,
            name: `${record.student.firstName} ${record.student.lastName}`,
            status: record.status,
            observations: record.observations || "",
          }))
          setStudents(existingAttendance)
        } else {
          loadStudents()
        }
      } catch (parseError) {
        console.log("[v0] JSON parse error, loading default students")
        loadStudents()
      }
    } catch (error) {
      console.log("[v0] Error loading attendance for date:", error)
      loadStudents()
    }
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
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          grade: selectedClass,
          asistencias: students.map((s) => ({
            studentId: s.id,
            status: s.status,
            observations: s.observations,
          })),
          teacherId: 1,
        }),
      })

      if (!response.ok) {
        console.log("[v0] API failed, saving to localStorage")
        saveToLocalStorage()
        return
      }

      await loadAttendanceHistory()

      toast({
        title: "Asistencia guardada",
        description: `Asistencia del ${new Date(selectedDate).toLocaleDateString("es-ES")} - Grado ${selectedClass} guardada correctamente`,
      })
    } catch (error) {
      console.error("[v0] Error saving attendance:", error)
      saveToLocalStorage()
    } finally {
      setIsSaving(false)
    }
  }

  const saveToLocalStorage = () => {
    try {
      const newRecord: SavedAttendance = {
        fecha: selectedDate,
        grupo: selectedClass,
        asistencias: students,
      }

      const existing = localStorage.getItem("attendanceHistory")
      const history = existing ? JSON.parse(existing) : []

      const filtered = history.filter((r: SavedAttendance) => !(r.fecha === selectedDate && r.grupo === selectedClass))

      filtered.push(newRecord)
      localStorage.setItem("attendanceHistory", JSON.stringify(filtered))

      setSavedAttendance(filtered)

      toast({
        title: "Asistencia guardada",
        description: `Asistencia del ${new Date(selectedDate).toLocaleDateString("es-ES")} - Grado ${selectedClass} guardada localmente`,
      })
    } catch (error) {
      console.error("[v0] Error saving to localStorage:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la asistencia",
        variant: "destructive",
      })
    }
  }

  const presentes = students.filter((s) => s.status === "Presente").length
  const ausentes = students.filter((s) => s.status === "Ausente").length
  const tardes = students.filter((s) => s.status === "Tarde").length
  const total = students.length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    )
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

        {/* Totals */}
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

        {/* History */}
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
                          })}{" "}
                          - Grado {record.grupo}
                        </p>
                        <p className="text-sm text-gray-600">
                          Presentes: {presentes} | Ausentes: {ausentes} | Tarde: {tardes}
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => setSelectedRecord(record)}>
                        Ver detalles
                      </Button>
                    </div>
                  )
                })}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl border-2 border-gray-800 bg-white">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-gray-800 bg-green-200 p-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Detalles de Asistencia</h2>
                <p className="text-gray-700">
                  {new Date(selectedRecord.fecha).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  - Grado {selectedRecord.grupo}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedRecord(null)}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-6">
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl border-2 border-gray-800 bg-green-100 p-4">
                  <p className="text-sm font-medium text-gray-600">Presentes</p>
                  <p className="text-3xl font-bold text-green-700">
                    {selectedRecord.asistencias.filter((s) => s.status === "Presente").length}
                  </p>
                </div>
                <div className="rounded-xl border-2 border-gray-800 bg-red-100 p-4">
                  <p className="text-sm font-medium text-gray-600">Ausentes</p>
                  <p className="text-3xl font-bold text-red-700">
                    {selectedRecord.asistencias.filter((s) => s.status === "Ausente").length}
                  </p>
                </div>
                <div className="rounded-xl border-2 border-gray-800 bg-yellow-100 p-4">
                  <p className="text-sm font-medium text-gray-600">Tarde</p>
                  <p className="text-3xl font-bold text-yellow-700">
                    {selectedRecord.asistencias.filter((s) => s.status === "Tarde").length}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border-2 border-gray-800">
                <table className="w-full">
                  <thead className="border-b-2 border-gray-800 bg-green-200">
                    <tr>
                      <th className="border-r-2 border-gray-800 px-6 py-4 text-left font-semibold text-gray-800">
                        Alumno
                      </th>
                      <th className="border-r-2 border-gray-800 px-6 py-4 text-left font-semibold text-gray-800">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-800">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-green-50">
                    {selectedRecord.asistencias.map((student, index) => (
                      <tr
                        key={student.id}
                        className={index !== selectedRecord.asistencias.length - 1 ? "border-b-2 border-gray-800" : ""}
                      >
                        <td className="border-r-2 border-gray-800 px-6 py-4 font-medium text-gray-800">
                          {student.name}
                        </td>
                        <td className="border-r-2 border-gray-800 px-6 py-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                              student.status === "Presente"
                                ? "bg-green-200 text-green-800"
                                : student.status === "Ausente"
                                  ? "bg-red-200 text-red-800"
                                  : "bg-yellow-200 text-yellow-800"
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{student.observations || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={() => setSelectedRecord(null)} className="bg-gray-800 text-white hover:bg-gray-700">
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
