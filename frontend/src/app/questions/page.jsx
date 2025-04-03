"use client";

import Header from "@/app/components/Header";

export default function UserQuestionsPage() {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <Header />
            <main className="p-6 mt-20 w-full">
                <div className="max-w-full">
                    <h2 className="text-2xl font-bold mb-4 border-b-2 pb-2">Preguntas de Usuarios</h2>
                    <p className="mb-4 text-sm text-gray-600">
                        Revisa y responde las preguntas enviadas por los usuarios.
                    </p>
                </div>
            </main>
        </div>
    );
}
