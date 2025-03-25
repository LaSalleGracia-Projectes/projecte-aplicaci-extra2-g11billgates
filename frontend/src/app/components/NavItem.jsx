"use client"; 

import Link from "next/link";

export default function NavItem({ href, label }) {
  return (
    <li>
      <Link href={href} className="text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        {label}
      </Link>
    </li>
  );
}
