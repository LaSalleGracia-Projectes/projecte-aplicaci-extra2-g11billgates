"use client";

import { useState } from "react";
import Header from "@/app/components/Header";

export default function contentManagment () {

    const [reports, setReports] = useState ([
        { id: 12, title: "Player123", reason: "Comportamiento tóxico" },
        { id: 14, title: "Player78", reason: "Vocabulario inadecuado" },
    ]);
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <Header />
            <main className="p-6 mt-20">
                <h2 className="text-2xl font-bold mb-4 border-b-2 pb-2">
                    Gestión de Contenido para TeamUp
                </h2>
                <section>
                    <h3 className="text-xl font-semibold mb-2">Reportes de Jugadores</h3>
                    <p className="mb-4 text-sm text-gray-600">
                        Aquí puedes ver los jugadores que han sido reportados por otros por mal comportamiento durante las partidas o en el chat. Toma medidas si es necesario.
                    </p>
                    <table className="w-full border border-gray-300 text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2">ID</th>
                                <th className="p-2">Usuario</th>
                                <th className="p-2">Motivo</th>
                                <th className="p-2">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.id} className="border-t">
                                    <td className="p-2">{report.id}</td>
                                    <td className="p-2">{report.title}</td>
                                    <td className="p-2">{report.reason}</td>
                                    <td className="p-2 flex gap-2">
                                        <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                                            Advertencia
                                        </button>
                                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                                            Banear
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}