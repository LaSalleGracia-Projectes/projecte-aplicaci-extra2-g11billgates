"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import StatCard from  "@/app/components/StatCard"

export default function Dashboard() {
    const [reports, setReports] = useState(0);
    const [unansweredQuestions, setUnansweredQuestions] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <Header/>

            <main className="p-6 mt-20">
                <h2 className="text-2xl font-semibold mb-6">Bienvenido al Panel Administrativo</h2>

                <div className="text-white grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard title="Reportes Pendientes" value={reports} />
                    <StatCard title="Preguntas sin Responder" value={unansweredQuestions} />
                    <StatCard title="Usuarios Activos" value={activeUsers} />
                </div>
            </main>
        </div>
    );
}