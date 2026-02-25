"use client";

import { useState } from "react";

export default function ConsignasPage() {
  const [texto, setTexto] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [consignas, setConsignas] = useState<any[]>([]);

  async function guardarConsigna() {
    if (!texto.trim()) {
      alert("Escribí la consigna");
      return;
    }

    const nuevaConsigna = {
      id: Date.now(),
      consigna: texto,
      archivo: archivo ? URL.createObjectURL(archivo) : null,
      fecha: new Date().toLocaleDateString(),
    };

    setConsignas([nuevaConsigna, ...consignas]);

    setTexto("");
    setArchivo(null);
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-8">

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-blue-400 text-center mb-2">
          Asignación de consignas
        </h1>

        <p className="text-center text-black mb-8">
          Agregá la consigna y adjuntá archivos o imágenes si lo necesitás
        </p>

        <textarea
          placeholder="Escribí la consigna aquí..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="w-full h-40 border-2 border-blue-200 rounded-2xl p-4 
          focus:outline-none focus:border-blue-400 transition
          text-gray-800 bg-white placeholder-gray-400"
        />

        <div className="mt-6">
          <label className="block text-gray-600 font-medium mb-2">
            Adjuntar archivo o imagen
          </label>

          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={(e) =>
              setArchivo(e.target.files ? e.target.files[0] : null)
            }
            className="block w-full text-sm text-gray-600
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:bg-blue-100 file:text-blue-500
            hover:file:bg-blue-200 transition"
          />

          <p className="text-xs text-gray-400 mt-2">
            Podés subir imágenes o documentos PDF / Word
          </p>
        </div>

        <button
          onClick={guardarConsigna}
          className="mt-8 w-full bg-blue-300 hover:bg-blue-400 text-black font-semibold py-3 rounded-xl transition shadow-md"
        >
          Guardar consigna
        </button>

        {/* Mostrar consignas guardadas */}
        <div className="mt-10">
          {consignas.map((c) => (
            <div
              key={c.id}
              className="border-2 border-blue-100 rounded-xl p-4 mt-4 bg-blue-50"
            >
              <p className="text-gray-800">{c.consigna}</p>

              {c.archivo && (
                <a
                  href={c.archivo}
                  target="_blank"
                  className="text-blue-600 text-sm mt-2 block"
                >
                  Ver archivo adjunto
                </a>
              )}

              <p className="text-xs text-gray-400 mt-2">{c.fecha}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}