"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import StatCard from  "@/app/components/StatCard"

export default function Dashboard() {
    const [reports, setReports] = useState(0);
    const [ questions, setQuestions ] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [bannedUsers, setBannedUsers] = useState(0);
    const [users, setUsers] = useState(0);
    const [admins, setAdmins] = useState(0);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <Header/>
            <main className="p-6 mt-20">
                <h2 className="text-2xl font-semibold mb-6 mb-4 border-b-2 pb-2">Panel de Administración</h2>
                <p className="text-sm text-gray-600 mb-6">
                Consulta un resumen general del estado actual de la plataforma.
                </p>
                <div className="text-white grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard title="Reportes por revisar" value={reports} />
                    <StatCard title="Preguntas no respondidas" value={questions} />
                    <StatCard title="Total de usuarios" value={users} />
                    <StatCard title="Admins" value={admins} />
                    <StatCard title="Usuarios Activos" value={activeUsers} />
                    <StatCard title="Usuarios suspendidos" value={bannedUsers} />
                </div>
            </main>
        </div>
    );
}