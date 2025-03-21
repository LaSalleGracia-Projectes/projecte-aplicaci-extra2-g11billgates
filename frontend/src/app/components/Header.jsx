"use client";

import Link from "react";

export default function Header() {
    return (
        <header className="bg-gray-800 p-4 flex justify-between items-center shadow-lg fixed w-full top-0 left-0 z-50">
            <h1 className="text-3xl font-extrabold text-white">
            TeamUp - Panel de Administración
            </h1>
        <div className= "flex items-center gap-4">
            <nav>
                <ul className="flex flex-wrap gap-4">
                    <NavItem href="/admin/usuarios" label="Gestión de Usuarios" />
                    <NavItem href="/admin/contenido" label="Contenido App" />
                    <NavItem href="/admin/reportes" label="Reportes" />
                    <NavItem href="/admin/preguntas" label="Preguntas" />
                    <NavItem href="/admin/enlaces" label="Enlaces de Descarga" />
                </ul>
            </nav>
        </div>
        </header>
    )
}