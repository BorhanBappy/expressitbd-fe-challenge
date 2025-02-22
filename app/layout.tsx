import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExpressIt BD - FE Challenge",
  description: "A front-end challenge for ExpressIt BD using Next.js.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen`}>
        {/* Navbar */}
        <Navbar />
        {/* Page Content */}
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
