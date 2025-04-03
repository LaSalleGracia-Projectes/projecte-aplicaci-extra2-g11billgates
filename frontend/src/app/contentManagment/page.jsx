"use client";

import { useState } from "react";
import Header from "@/app/components/Header";

export default function contentManagment () {

    const [notifications, setNotifications] = useState ([
        { id: 1, title: "Mensaje de Bienvenida" },
        { id: 2, title: "Mensajes automáticos para reporte" },
        { id: 3, title: "Mensajes de error o ayuda" },
    ]);

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

                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Mensajes del Sistema</h3>
                    <p className="mb-4 text-sm text-gray-600">
                        Gestiona los mensajes que los jugadores ven al entrar a la app, al hacer match o al reportar a otros.
                    </p>
                    <table className="w-full border border-gray-300 text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2">ID</th>
                                <th className="p-2">Título</th>
                                <th className="p-2">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-2">{item.id}</td>
                                    <td className="p-2">{item.title}</td>
                                    <td className="p-2 flex gap-2">
                                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                                            Eliminar
                                        </button>
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

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