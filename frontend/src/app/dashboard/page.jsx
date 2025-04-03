"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import StatCard from  "@/app/components/StatCard"

export default function Dashboard() {
    const [reports, setReports] = useState(0);
    const [ matches, setMatches ] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <Header/>
            <main className="p-6 mt-20">
                <h2 className="text-2xl font-semibold mb-6 mb-4 border-b-2 pb-2">Bienvenido al Panel Administrativo</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Aquí puedes revisar un resumen rápido del estado de la aplicación.
                </p>
                <div className="text-white grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard title="Reportes Pendientes" value={reports} />
                    <StatCard title="Matches Hoy" value={matches} />
                    <StatCard title="Usuarios Activos Hoy" value={activeUsers} />
                </div>
            </main>
        </div>
    );
}