"use client";

import { useState } from 'react';
import Link from 'next/link';

// Define the navigation links
const navLinks = [
    { href: "/profile", label: "Profile" },
    { href: "/listings", label: "Listings" },
    { href: "/jobs", label: "Jobs" },
    { href: "/reviews", label: "Reviews" },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="fixed top-4 left-0 right-0 z-50 px-4">
                <nav className="relative flex items-center justify-center max-w-5xl mx-auto rounded-full bg-black/40 p-3 text-white backdrop-blur-xl border border-white/10 shadow-2xl">
                    
                    {/* Centered Logo and Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-10">
                        <Link href="/" className="flex left gap-10" onClick={() => setIsMenuOpen(false)}>
                            <span className="font-bold text-xl tracking-wider select-none">Linked-Dao</span>
                        </Link>
                        <div className="flex items-center gap-8 text-base">
                            {navLinks.map((link) => (
                                 <Link key={link.href} href={link.href} className="opacity-80 hover:opacity-30 transition-opacity">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Logo for Mobile View (Centered) */}
                     <Link href="/" className="md:hidden flex items-center gap-3">
                        <span className="font-bold text-xl tracking-wider select-none">Linked-Dao</span>
                    </Link>


                    {/* Mobile Menu Button */}
                    <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Panel */}
            {isMenuOpen && (
                <div className="md:hidden fixed top-[80px] left-4 right-4 z-40 rounded-xl bg-black/50 backdrop-blur-lg border border-white/10 shadow-lg">
                    <div className="flex flex-col items-center space-y-4 p-6">
                        {navLinks.map((link) => (
                             <Link
                                key={link.href}
                                href={link.href}
                                className="w-full text-center text-white py-2 rounded-md hover:bg-white/10 transition-colors text-lg"
                                onClick={() => setIsMenuOpen(false)} // Close menu on click
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
