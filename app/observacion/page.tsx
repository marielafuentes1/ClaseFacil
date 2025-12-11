"use client";

import React, { useState } from 'react'; 
import { type PropsWithChildren } from 'react'; 

// 🚨 COMPONENTES DE TABLA SIMPLIFICADOS (Mantienen el estilo de borde azul sutil)
const Table: React.FC<any> = ({ children, ...props }) => (
    <div className="p-4" {...props}>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">{children}</table>
        </div>
    </div>
);
const TableHead: React.FC<any> = ({ children, ...props }) => <thead className="bg-gray-200 dark:bg-gray-700" {...props}>{children}</thead>;
const TableBody: React.FC<any> = ({ children, ...props }) => <tbody {...props}>{children}</tbody>;
// Resaltado sutil con borde azul
const TableRow: React.FC<any> = ({ children, isSelected = false, ...props }) => (
    <tr 
        className={`border-b border-gray-200 dark:border-gray-700 transition duration-150 ease-in-out hover:bg-gray-700/50
                   ${isSelected ? 'border-l-4 border-blue-500' : ''}`} 
        {...props}
    >
        {children}
    </tr>
);
const TableHeader: React.FC<any> = ({ children, ...props }) => <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200" {...props}>{children}</th>;
const TableCell: React.FC<any> = ({ children, ...props }) => <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100 align-top" {...props}>{children}</td>;


// ----------------------------------------------------
// 1. ESTRUCTURA DE DATOS E INICIALES
// ----------------------------------------------------

interface Observacion { texto: string; nota: number; }
interface CalificacionItem { 
    id: number; 
    nombre: string; 
    calificacion: number; 
    // Ahora observacion contiene solo UN elemento por fila, 
    // porque cada nueva observación será una nueva fila.
    observacion: Observacion[]; 
    // Usamos un ID único para la fila (key), ya que los IDs de alumno se repiten
    filaId: number; 
}

const nombresAlumnos = ["Sofía Rodríguez", "Andrés Pérez", "Valentina Díaz"];
let nextFilaId = nombresAlumnos.length + 1;

// Generación de calificaciones iniciales (Una observación por defecto)
const calificacionesIniciales: CalificacionItem[] = nombresAlumnos.map((nombre, indice) => {
    return {
        id: indice + 1, // ID del alumno (se repite)
        filaId: indice + 1, // ID único de la fila
        nombre: nombre,
        calificacion: Math.floor(Math.random() * 5) + 6,
        observacion: [{ texto: "Observación inicial.", nota: 8 }] 
    };
});

// ----------------------------------------------------
// 2. COMPONENTE PRINCIPAL Y LÓGICA
// ----------------------------------------------------

export default function TablaCalificacionesConMutacion() {
    const [calificaciones, setCalificaciones] = useState(calificacionesIniciales);
    const [alumnoSeleccionadoId, setAlumnoSeleccionadoId] = useState<number | null>(calificacionesIniciales[0].id);

    // FUNCIÓN PARA EDITAR UNA OBSERVACIÓN/NOTA ESPECÍFICA
    // Nota: Ahora solo accedemos al índice 0 porque cada fila solo tiene una observación
    const manejarCambioObservacion = (filaId, campo, valor) => {
        setCalificaciones(calificacionesAnteriores =>
            calificacionesAnteriores.map(item => {
                if (item.filaId === filaId) {
                    const nuevaObs = {
                        ...item.observacion[0], // Siempre es la primera y única observación
                        [campo]: valor 
                    };
                    return { ...item, observacion: [nuevaObs] };
                }
                return item;
            })
        );
    };

    // 🌟 FUNCIÓN CLAVE: Agrega una NUEVA FILA con la observación del alumno seleccionado 🌟
    const agregarObservacionASeleccionado = () => {
        if (alumnoSeleccionadoId === null) return; 

        // 1. Encontrar el alumno seleccionado para obtener su nombre
        const alumnoBase = calificaciones.find(item => item.id === alumnoSeleccionadoId);
        if (!alumnoBase) return;

        // 2. Crear la nueva fila/registro
        const nuevaFila: CalificacionItem = {
            id: alumnoBase.id, // Mismo ID de alumno
            filaId: nextFilaId++, // Nuevo ID de fila único
            nombre: alumnoBase.nombre, // Nombre repetido
            calificacion: alumnoBase.calificacion, // Calificación base
            observacion: [{ texto: "", nota: 0 }] // Nueva observación vacía
        };

        // 3. Agregar la nueva fila al FINAL de la lista de calificaciones
        setCalificaciones(calificacionesAnteriores => [...calificacionesAnteriores, nuevaFila]);
        
        // Opcional: Reenfocar el ID al nuevo registro creado si se quiere editar inmediatamente
        setAlumnoSeleccionadoId(nuevaFila.id); 
    };

    // Función para manejar el cambio de calificación principal
    // (Esta ahora modifica todas las filas que compartan el mismo ID de alumno, o solo la fila actual)
    const manejarCambioCalificacion = (filaId, valor) => {
        setCalificaciones(calificacionesAnteriores =>
            calificacionesAnteriores.map(item => {
                if (item.filaId === filaId) { 
                    // Solo cambia la calificación en la fila actual
                    return { ...item, calificacion: parseInt(valor) || 0 };
                }
                return item;
            })
        );
    };
    
    return (
        <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Registro de Calificaciones
            </h1>

            {/* TABLA PRINCIPAL */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeader>Nombre del Alumno </TableHeader>
                        <TableHeader>Calificación</TableHeader>
                        <TableHeader style={{ minWidth: '400px' }}>Observación y Nota</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {calificaciones.map((item) => {
                        // Ahora usamos filaId para la key y filaId para identificar qué fila es activa
                        const isSelected = item.filaId === alumnoSeleccionadoId;

                        // Solo tomamos la primera (y única) observación de la fila
                        const obs = item.observacion[0];

                        return (
                            <TableRow key={item.filaId} isSelected={isSelected}>
                                {/* Celda Nombre: Funciona como botón de selección */}
                                <TableCell 
                                    className={`font-semibold cursor-pointer ${isSelected ? 'text-blue-400' : 'text-gray-200'}`}
                                    // 🌟 CLAVE: Al hacer clic, activamos el filaId para que el botón lo modifique
                                    onClick={() => setAlumnoSeleccionadoId(item.filaId)}
                                >
                                    {item.nombre}
                                    {isSelected && <span className="ml-2 text-xs bg-white-100 px-2 py-0.5 rounded">seleccionado</span>}
                                </TableCell>

                                {/* Celda Calificación Principal */}
                                <TableCell>
                                    <input
                                        type="number"
                                        value={item.calificacion}
                                        // CLAVE: Modificamos la calificación de ESTA fila
                                        onChange={(e) => manejarCambioCalificacion(item.filaId, e.target.value)}
                                        min="0"
                                        max="10"
                                        className="w-[60px] text-center border rounded-md p-1 dark:bg-gray-800 dark:text-white"
                                    />
                                </TableCell>

                                {/* Celda Observación y Nota (Una por fila) */}
                                <TableCell className="flex items-center gap-2">
                                    {/* INPUT DE TEXTO */}
                                    <input
                                        type="text"
                                        value={obs.texto || ''} 
                                        // CLAVE: Modificamos la observación de ESTA fila
                                        onChange={(e) => manejarCambioObservacion(item.filaId, 'texto', e.target.value)} 
                                        placeholder={`Observación...`}
                                        className="w-full border border-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md p-2"
                                    />

                                    {/* INPUT DE NOTA */}
                                    <input
                                        type="number"
                                        value={obs.nota || 0} 
                                        // CLAVE: Modificamos la nota de ESTA fila
                                        onChange={(e) => manejarCambioObservacion(item.filaId, 'nota', parseInt(e.target.value) || 0)} 
                                        min="0"
                                        max="10"
                                        className="w-[60px] text-center border rounded-md p-1 dark:bg-gray-800 dark:text-white"
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            
            {/* 🌟 BOTÓN ÚNICO ABAJO DE LA TABLA 🌟 */}
            <div className="mt-6 flex justify-center">
                <button
                    type="button"
                    disabled={alumnoSeleccionadoId === null}
                    onClick={agregarObservacionASeleccionado} 
                    className={`font-bold py-2 px-6 rounded-lg transition-colors shadow-lg 
                                ${alumnoSeleccionadoId !== null ? 'bg--600 hover:bg-green-700 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
                >
                    ➕ Agregar Nueva Observación 
                </button>
            </div>
        </div>
    );
}