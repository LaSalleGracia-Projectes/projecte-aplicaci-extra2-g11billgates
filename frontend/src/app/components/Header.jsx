"use client";

import NavItem from "../components/NavItem";
import Image from "next/image";

export default function Header() {
    return (
        <header className="bg-gray-800 p-4 flex justify-between items-center shadow-lg fixed w-full top-0 left-0 z-50">
        <div className="flex items-center gap-4">
        <Image src="/LogoTeamUp.png" alt="TeamUp Logo" width={40} height={40} />
      </div>
            <div className= "flex items-center gap-4">
                <nav>
                    <ul className="flex flex-wrap gap-4">
                        <NavItem href="/dashboard" label="Dashboard"></NavItem>
                        <NavItem href="/users" label="Gestión de Usuarios" />
                        <NavItem href="/contentManagment" label="Contenido App" />
                        <NavItem href="/questions" label="Preguntas" />
                        <NavItem href="/downloadLinks" label="Enlaces de Descarga" />
                    </ul>
                </nav>
                <button className="bg-red-600 px-4 py-2 rounded-full hover:bg-red-700 transition text-white font-semibold">
                    Cerrar Sesión
                </button>
            </div>
        </header>
    );
}