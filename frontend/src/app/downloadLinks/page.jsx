"use client";

import { useState } from "react";
import Header from "@/app/components/Header";

export default function DownloadLinks() {
    const [links, setLinks] = useState([
        {
            id: 1,
            url: "https://www.apple.com/app-store/",
            type: "descarga",
            description: "Link de descarga en App Store",
        },
        {
            id: 2,
            url: "https://teamup.com/update-log",
            type: "actualizacion",
            description: "Historial de actualizaciones",
        },
    ]);
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <Header />
            <main className="p-6 mt-20">
                <h2 className="text-2xl font-bold mb-6 border-b-2 pb-2">Enlaces de Descarga</h2>
                
                <section className="mb-10">
                    <h3 className="text-xl font-semibold mb-4">Enlaces Disponibles</h3>
                    <table className="w-full border border-gray-300 text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2">ID</th>
                                <th className="p-2">Tipo</th>
                                <th className="p-2">URL</th>
                                <th className="p-2">Descripción</th>
                                <th className="p-2">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map((link) => (
                                <tr key={link.id} className="border-t">
                                    <td className="p-2">{link.id}</td>
                                    <td className="p-2 capitalize">{link.type}</td>
                                    <td className="p-2">{link.url}</td>
                                    <td className="p-2">{link.description}</td>
                                    <td className="p-2 flex gap-2">
                                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Eliminar</button>
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Editar</button>
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
