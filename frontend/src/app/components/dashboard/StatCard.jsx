"use client";

export default function StatCard ({ title,value }) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
    );
}
