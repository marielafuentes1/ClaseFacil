import React from 'react'

const stash = () => {
  return (
        {/* History
        {savedAttendance.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Historial de Asistencia
            </h2>
            <div className="space-y-2">
              {savedAttendance
                .sort(
                  (a, b) =>
                    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
                )
                .map((record) => {
                  const presentes = record.asistencias.filter(
                    (s) => s.status === "Presente"
                  ).length;
                  const ausentes = record.asistencias.filter(
                    (s) => s.status === "Ausente"
                  ).length;
                  const tardes = record.asistencias.filter(
                    (s) => s.status === "Tarde"
                  ).length;

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
                          Presentes: {presentes} | Ausentes: {ausentes} | Tarde:{" "}
                          {tardes}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedRecord(record)}
                      >
                        Ver detalles
                      </Button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>


      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl border-2 border-gray-800 bg-white">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-gray-800 bg-green-200 p-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Detalles de Asistencia
                </h2>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedRecord(null)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-6">
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl border-2 border-gray-800 bg-green-100 p-4">
                  <p className="text-sm font-medium text-gray-600">Presentes</p>
                  <p className="text-3xl font-bold text-green-700">
                    {
                      selectedRecord.asistencias.filter(
                        (s) => s.status === "Presente"
                      ).length
                    }
                  </p>
                </div>
                <div className="rounded-xl border-2 border-gray-800 bg-red-100 p-4">
                  <p className="text-sm font-medium text-gray-600">Ausentes</p>
                  <p className="text-3xl font-bold text-red-700">
                    {
                      selectedRecord.asistencias.filter(
                        (s) => s.status === "Ausente"
                      ).length
                    }
                  </p>
                </div>
                <div className="rounded-xl border-2 border-gray-800 bg-yellow-100 p-4">
                  <p className="text-sm font-medium text-gray-600">Tarde</p>
                  <p className="text-3xl font-bold text-yellow-700">
                    {
                      selectedRecord.asistencias.filter(
                        (s) => s.status === "Tarde"
                      ).length
                    }
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
                      <th className="px-6 py-4 text-left font-semibold text-gray-800">
                        Observaciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-green-50">
                    {selectedRecord.asistencias.map((student, index) => (
                      <tr
                        key={student.id}
                        className={
                          index !== selectedRecord.asistencias.length - 1
                            ? "border-b-2 border-gray-800"
                            : ""
                        }
                      >
                        <td className="border-r-2 border-gray-800 px-6 py-4 font-medium text-gray-800">
                          {student.name}
                        </td>
                        <td className="border-r-2 border-gray-800 px-6 py-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                          <div>stash</div>        student.status === "Presente"
                                ? "bg-green-200 text-green-800"
                                : student.status === "Ausente"
                                ? "bg-red-200 text-red-800"
                                : "bg-yellow-200 text-yellow-800"
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {student.observations || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setSelectedRecord(null)}
                  className="bg-gray-800 text-white hover:bg-gray-700"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )} */}
  )
}

export default stash