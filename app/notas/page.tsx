"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Student {
  id: number
  firstName: string
  lastName: string
  grade: string
}

interface GradeEntry {
  studentId: number
  score: string
  observations: string
}

export default function NotasPage() {
  const [selectedGrade, setSelectedGrade] = useState("1A")
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Record<number, GradeEntry>>({})
  const [evaluationType, setEvaluationType] = useState("Participación")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [savedGrades, setSavedGrades] = useState<any[]>([])

  const GRADES = {
    "1A": "1A",
    "1B": "1B",
    "2A": "2A",
    "2B": "2B",
    "3A": "3A",
  }

  const EVALUATION_TYPES = ["Participación", "Examen", "Tarea", "Proyecto", "Práctica"]

  useEffect(() => {
    loadStudents()
  }, [selectedGrade])

  useEffect(() => {
    loadSavedGrades()
  }, [])

  const loadStudents = async () => {
    try {
      const response = await fetch(`/api/students?grade=${selectedGrade}`)

      if (response.ok) {
        const data = await response.json()
        setStudents(data)
        // Initialize grades object
        const initialGrades: Record<number, GradeEntry> = {}
        data.forEach((student: Student) => {
          initialGrades[student.id] = { studentId: student.id, score: "", observations: "" }
        })
        setGrades(initialGrades)
      }
    } catch (error) {
      console.log("[v0] Using default students")
      // Default students
      const defaultStudents = [
        { id: 1, firstName: "Juan", lastName: "Pérez", grade: selectedGrade },
        { id: 2, firstName: "María", lastName: "García", grade: selectedGrade },
        { id: 3, firstName: "Carlos", lastName: "López", grade: selectedGrade },
        { id: 4, firstName: "Ana", lastName: "Martínez", grade: selectedGrade },
        { id: 5, firstName: "Luis", lastName: "Rodríguez", grade: selectedGrade },
      ]
      setStudents(defaultStudents)
      const initialGrades: Record<number, GradeEntry> = {}
      defaultStudents.forEach((student) => {
        initialGrades[student.id] = { studentId: student.id, score: "", observations: "" }
      })
      setGrades(initialGrades)
    }
  }

  const loadSavedGrades = () => {
    try {
      const saved = localStorage.getItem("grades_history")
      if (saved) {
        setSavedGrades(JSON.parse(saved))
      }
    } catch (error) {
      console.log("[v0] Error loading saved grades")
    }
  }

  const handleScoreChange = (studentId: number, score: string) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], score },
    }))
  }

  const handleObservationsChange = (studentId: number, observations: string) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], observations },
    }))
  }

  const handleSaveGrades = async () => {
    // Filter only students with scores
    const gradesToSave = Object.values(grades).filter((g) => g.score !== "")

    if (gradesToSave.length === 0) {
      alert("Por favor asigna al menos una calificación")
      return
    }

    const gradeData = {
      date: selectedDate,
      grade: selectedGrade,
      evaluationType,
      grades: gradesToSave.map((g) => ({
        studentId: g.studentId,
        score: Number.parseFloat(g.score),
        observations: g.observations,
      })),
    }

    try {
      // Try to save to API
      const response = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gradeData),
      })

      if (response.ok) {
        console.log("[v0] Grades saved to database")
      }
    } catch (error) {
      console.log("[v0] Database not available, saving to localStorage")
    }

    // Always save to localStorage as backup
    const newSavedGrades = [...savedGrades, { ...gradeData, id: Date.now() }]
    localStorage.setItem("grades_history", JSON.stringify(newSavedGrades))
    setSavedGrades(newSavedGrades)

    alert("Calificaciones guardadas exitosamente")

    // Reset scores
    const resetGrades: Record<number, GradeEntry> = {}
    students.forEach((student) => {
      resetGrades[student.id] = { studentId: student.id, score: "", observations: "" }
    })
    setGrades(resetGrades)
  }

  const getScoreColor = (score: string) => {
    const numScore = Number.parseFloat(score)
    if (isNaN(numScore)) return "bg-white"
    if (numScore >= 8) return "bg-green-100"
    if (numScore >= 6) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Evaluación y Notas</h1>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border-2 border-gray-800 px-4 py-2"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Grado</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="rounded-lg border-2 border-gray-800 px-4 py-2"
            >
              {Object.entries(GRADES).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de Evaluación</label>
            <select
              value={evaluationType}
              onChange={(e) => setEvaluationType(e.target.value)}
              className="rounded-lg border-2 border-gray-800 px-4 py-2"
            >
              {EVALUATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grades Table */}
        <div className="overflow-hidden rounded-2xl border-2 border-gray-800 bg-yellow-100 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-gray-800 bg-yellow-200">
                <tr>
                  <th className="border-r-2 border-gray-800 px-6 py-4 text-left font-semibold text-gray-800">Alumno</th>
                  <th className="border-r-2 border-gray-800 px-6 py-4 text-center font-semibold text-gray-800">
                    Calificación (1-10)
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className={index !== students.length - 1 ? "border-b-2 border-gray-800" : ""}>
                    <td className="border-r-2 border-gray-800 px-6 py-4 font-medium text-gray-800">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="border-r-2 border-gray-800 px-6 py-4 text-center">
                      <input
                        type="number"
                        value={grades[student.id]?.score || ""}
                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                        min="1"
                        max="10"
                        step="0.1"
                        placeholder="1-10"
                        className={`w-24 rounded-lg border-2 border-gray-800 px-3 py-2 text-center text-gray-800 ${getScoreColor(grades[student.id]?.score || "")}`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={grades[student.id]?.observations || ""}
                        onChange={(e) => handleObservationsChange(student.id, e.target.value)}
                        placeholder="Observaciones del desempeño..."
                        className="w-full rounded-lg border border-gray-800 bg-white px-3 py-2 text-gray-800"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t-2 border-gray-800 bg-yellow-200 p-4">
            <Button onClick={handleSaveGrades} className="bg-gray-800 text-white hover:bg-gray-700">
              <Save className="mr-2 h-4 w-4" />
              Guardar Calificaciones
            </Button>
          </div>
        </div>

        {/* History */}
        <Card className="border-2 border-gray-800">
          <CardHeader className="bg-yellow-50">
            <CardTitle>Historial de Evaluaciones</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {savedGrades.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay evaluaciones guardadas</p>
            ) : (
              <div className="space-y-4">
                {savedGrades
                  .slice()
                  .reverse()
                  .map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between rounded-lg border-2 border-gray-800 bg-white p-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {record.evaluationType} - Grado {record.grade}
                        </p>
                        <p className="text-sm text-gray-600">{record.date}</p>
                        <p className="text-sm text-gray-600">{record.grades.length} estudiantes evaluados</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
