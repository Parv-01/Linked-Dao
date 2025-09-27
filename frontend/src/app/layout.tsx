import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./wallet/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Awesome App",
  description: "A cool app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        {/* Background Image Container */}
        <div className="fixed inset-0 z-[-1] bg-[url('/logowname.svg')] bg-cover bg-center" />
        {/* Overlay */}
        <div className="fixed inset-0 z-[-1] bg-black/60" />

        <Providers>
          <Navbar />
          <main className="relative z-10 pt-24 min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

