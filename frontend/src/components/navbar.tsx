"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
//import Image from 'next/image';
import { useState } from 'react';

export default function Navbar ()  {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
      return (
         <header className="w-full">
              <nav className="w-full bg-white backdrop-blur fixed top-0 left-0 right-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <button className="bg-white rounded-md p-0 cursor-pointer" aria-label="Go to home">
                      {/*<Image src="/logo.img" alt="Linked-Dao" className="h-20 object-contain" />*/}
                    </button>
                  </div>
        
                  {/* Desktop Nav */}
                  <div className="hidden font-orbitron md:flex items-center space-x-8 lg:space-x-10 text-gray-800 text-sm lg:text-base">
                    <button className={`hover:text-blue-600 transition-colors hover:underline underline-offset-8 decoration-2`}>Profile</button>
                    <button className={`hover:text-blue-600 transition-colors hover:underline underline-offset-8 decoration-2`}>Listing</button>
                    <button className={`hover:text-blue-600 transition-colors hover:underline underline-offset-8 decoration-2`}>Reviews</button>
                    <button className={`hover:text-blue-600 transition-colors hover:underline underline-offset-8 decoration-2`}>Jobs</button>
                  </div>
        
                  {/* Desktop CTA */}
                  <div className="hidden md:flex items-center">
                    <button 
                      className="cursor-pointer"
                    >
                       <ConnectButton />
                    </button>
                  </div>
        
                  {/* Mobile Hamburger */}
                  <div className="md:hidden flex items-center">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      aria-controls="mobile-menu"
                      aria-expanded={isMobileMenuOpen}
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                      <span className="sr-only">Open main menu</span>
                      {isMobileMenuOpen ? (
                        // X icon
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        // Hamburger icon
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
        
                {/* Mobile Menu Panel */}
                <div
                  id="mobile-menu"
                  className={`${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} md:hidden overflow-hidden transition-all duration-300 ease-out bg-white shadow-lg`}
                >
                  <div className="px-6 pt-2 pb-6 space-y-1 text-gray-800">
                    <button className={`block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100`}>Profile</button>
                    <button className={`block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100`}>Listing</button>
                    <button className={`block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100`}>Reviews</button>
                    <button className={`block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100`}>Jobs</button>
                    <div className="pt-2">
                      <button 
    
                        className="w-full"
                      >
                        <ConnectButton />
                      </button>
                    </div>
                  </div>
                </div>
              </nav>
              </header>

    );
  
}

