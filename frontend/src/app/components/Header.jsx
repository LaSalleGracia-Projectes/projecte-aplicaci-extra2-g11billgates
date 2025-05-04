"use client";

import NavItem from "../components/NavItem";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        const token = Cookies.get("sessionToken");

        if (token) {
            try {
                await fetch("http://localhost:3003/api/users/logout", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (err) {
                console.error("Error al cerrar sesión:", err);
            }
        }

        Cookies.remove("sessionToken");
        router.push("/");
    };

    return (
        <header className="bg-gray-800 p-4 flex justify-between items-center shadow-lg fixed w-full top-0 left-0 z-50">
            <div className="flex items-center gap-4">
                <Image src="/LogoTeamUp.png" alt="TeamUp Logo" width={40} height={40} />
            </div>
            <div className="flex items-center gap-4">
                <nav>
                    <ul className="flex flex-wrap gap-4">
                        <NavItem href="/dashboard" label="Dashboard" />
                        <NavItem href="/users" label="Gestión de Usuarios" />
                        <NavItem href="/contentManagment" label="Contenido App" />
                        <NavItem href="/questions" label="Preguntas" />
                        <NavItem href="/downloadLinks" label="Enlaces de Descarga" />
                    </ul>
                </nav>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 px-4 py-2 rounded-full hover:bg-red-700 transition text-white font-semibold"
                >
                    Cerrar Sesión
                </button>
            </div>
        </header>
    );
}
