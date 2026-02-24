"use client";

import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";

export default function ObservacionesPage() {
  const [estudiantes, setEstudiantes] = useState<any[]>([]);
  const [observaciones, setObservaciones] = useState<any[]>([]);
  const [alumno, setAlumno] = useState("");
  const [texto, setTexto] = useState("");

  // Cargar estudiantes y observaciones
  const cargarDatos = async () => {
    const est = await pb.collection("estudiantes").getFullList();
    setEstudiantes(est);

    const obs = await pb.collection("observaciones").getFullList({
      sort: "-created",
    });

    setObservaciones(obs);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardar = async () => {
    if (!alumno || !texto.trim()) {
      alert("Completá alumno y observación");
      return;
    }

    await pb.collection("observaciones").create({
      alumno: alumno,
      observacion_personalizada: texto,
      fecha: new Date().toISOString(),
    });

    setTexto("");
    setAlumno("");

    await cargarDatos();
  };

  // Función para obtener nombre del alumno sin usar expand
  const obtenerNombreAlumno = (id: string) => {
    const encontrado = estudiantes.find((e) => e.id === id);
    return encontrado ? encontrado.nombre : "Alumno no encontrado";
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Observaciones</h1>

      <div style={{ marginBottom: 20 }}>
        <select value={alumno} onChange={(e) => setAlumno(e.target.value)}>
          <option value="">Seleccionar alumno</option>
          {estudiantes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Escribir observación..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          style={{ marginLeft: 10 }}
        />

        <button onClick={guardar} style={{ marginLeft: 10 }}>
          Guardar
        </button>
      </div>

      <hr />

      {observaciones.map((obs) => (
        <div
          key={obs.id}
          style={{
            border: "1px solid white",
            padding: 10,
            marginTop: 10,
          }}
        >
          <p><strong>Alumno:</strong> {obtenerNombreAlumno(obs.alumno)}</p>
          <p><strong>Observación:</strong> {obs.observacion_personalizada}</p>
          <p><strong>Fecha:</strong> {new Date(obs.fecha).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}