"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import StatCard from "@/app/components/StatCard";
import Cookies from "js-cookie";

export default function Dashboard() {
  const [activeUsers, setActiveUsers] = useState(0);
  const [bannedUsers, setBannedUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [admins, setAdmins] = useState(0);

  useEffect(() => {
    const token = Cookies.get("sessionToken");

    fetch("http://localhost:3003/api/users/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener estadísticas");
        }
        return res.json();
      })
      .then((data) => {
        setTotalUsers(data.totalUsers);
        setActiveUsers(data.activeUsers);
        setAdmins(data.admins);
        setBannedUsers(data.suspendedUsers);
      })
      .catch((error) => {
        console.error("Error al cargar estadísticas:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="p-6 mt-20">
        <h2 className="text-2xl font-bold mb-6 border-b-2 pb-2">
          Panel de Administración
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Consulta un resumen general del estado actual de la plataforma.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <StatCard title="Total de usuarios" value={totalUsers} />
          <StatCard title="Admins" value={admins} />
          <StatCard title="Usuarios Activos" value={activeUsers} />
          <StatCard title="Usuarios suspendidos" value={bannedUsers} />
        </div>
      </main>
    </div>
  );
}
