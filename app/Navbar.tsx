"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-5 px-6 shadow-xl">
      <div className="container mx-auto flex justify-center space-x-8">
        <Link
          href="/"
          className={`text-lg font-medium px-6 py-2 rounded-full transition-all duration-200
                      hover:bg-white/10 hover:scale-[1.02] hover:shadow-sm
                      ${
                        pathname === "/"
                          ? "bg-gradient-to-br from-coral-400 to-amber-400 text-white shadow-md font-semibold border-b-2 border-white/30"
                          : "text-gray-300 hover:text-white"
                      }`}
        >
          Home
        </Link>
        <Link
          href="/task1"
          className={`text-lg font-medium px-6 py-2 rounded-full transition-all duration-200
                      hover:bg-white/10 hover:scale-[1.02] hover:shadow-sm
                      ${
                        pathname === "/task1"
                          ? "bg-gradient-to-br from-coral-400 to-amber-400 text-white shadow-md font-semibold border-b-2 border-white/30"
                          : "text-gray-300 hover:text-white"
                      }`}
        >
          Task 1
        </Link>
        <Link
          href="/task2"
          className={`text-lg font-medium px-6 py-2 rounded-full transition-all duration-200
                      hover:bg-white/10 hover:scale-[1.02] hover:shadow-sm
                      ${
                        pathname === "/task2"
                          ? "bg-gradient-to-br from-coral-400 to-amber-400 text-white shadow-md font-semibold border-b-2 border-white/30"
                          : "text-gray-300 hover:text-white"
                      }`}
        >
          Task 2
        </Link>
      </div>
    </nav>
  );
}
