"use client";

import Header from "@/app/components/Header";

export default function UserManagementPage() {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <Header />
            <main className="p-6 mt-20 w-full">
                <h2 className="text-2xl font-bold mb-6 border-b-2 pb-2">Gestión de usuarios</h2>
            </main>
        </div>
    );
}

