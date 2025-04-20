"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import StatCard from  "@/app/components/StatCard"

export default function Reports() {
    const [registers, setRegisters] = useState(0);
    const [ totalUsers, setTotalUsers ] = useState(0);
    const [ matches, setMatches ] = useState(0);
 return (
         <div className="min-h-screen bg-gray-100 text-gray-900">
             <Header/>
 
             <main className="p-6 mt-20">
                 <h2 className="text-2xl font-semibold mb-6 mb-4 border-b-2 pb-2">Reportes y Métricas</h2>
                 <p className="text-gray-600 mb-6 text-sm">
                    Aquí puedes visualizar estadísticas clave sobre el uso de la aplicación.
                 </p>
                 <div className="text-white grid grid-cols-1 md:grid-cols-3 gap-8">
                     <StatCard title="Nuevos Registros" value={registers} />
                     <StatCard title="Usuarios Totales" value={totalUsers} />
                     <StatCard title="Matches" value={matches} />
                 </div>
             </main>
         </div>
     );  
}