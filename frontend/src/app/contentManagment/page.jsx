"use client";

import { useState } from "react";
import Header from "@/app/components/Header";

export default function contentManagment () {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <Header />
            <main className="p-6 mt-20">
                <h2 className="text-2xl font-bold mb-4 border-b-2 pb-2">
                    Gestión de Contenido para TeamUp
                </h2>
            </main>
        </div>
    );
}