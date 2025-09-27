"use client";
import { Button } from "./ui/button";
import Link from 'next/link';
import Image from 'next/image';
export default function Navbar() {
    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl">
            <nav className="mx-4 flex items-center justify-between rounded-full bg-black/20 p-3 text-white backdrop-blur-xl border border-white/10 shadow-lg">
                <Link href="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                    <Image
                        src="/images/celesta-icon.png"
                        alt="Linked-Dao"
                        width={40}
                        height={40}
                    />
                    <span className="font-orbitron text-xl font-bold tracking-wider select-none">CELESTA</span>
                </Link>
                <div className="hidden md:flex items-center gap-6 font-orbitron text-sm uppercase">
                    <Link href="/" className="opacity-80 hover:opacity-100 transition">Home</Link>
                    <Link href="" className="opacity-80 hover:opacity-100 transition">Events</Link>
                    <Link href="/spons" className="opacity-80 hover:opacity-100 transition">Sponsors</Link>
                    <Link href="/gallery" className="opacity-80 hover:opacity-100 transition">Gallery</Link>
                    <Link href="/login" className="rounded-full border-2 border-teal-500 px-5 py-2 opacity-80 hover:opacity-100 hover:bg-teal-500 hover:text-black transition">Login</Link>
                    <Link href="/register" className="rounded-full bg-teal-500 px-5 py-2 text-black hover:bg-teal-400 transition">Register</Link>
                </div>
            </nav>
        </header>
    );
}

