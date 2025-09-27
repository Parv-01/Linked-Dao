"use client";

import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

// Mock data for demonstration purposes
const mockListings = [
  { id: 1, skills: ['UI/UX Design', 'Figma'], rating: 4.5, credits: 120 },
  { id: 2, skills: ['Frontend Dev', 'React'], rating: 4.8, credits: 150 },
  { id: 3, skills: ['Backend Dev', 'Node.js'], rating: 4.2, credits: 110 },
  { id: 4, skills: ['Smart Contracts', 'Solidity'], rating: 5.0, credits: 200 },
  { id: 5, skills: ['Project Management', 'Agile'], rating: 4.0, credits: 90 },
];

// Reusable Listing Card Component
const ListingCard = ({ listing }: { listing: typeof mockListings[0] }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2 hover:border-teal-500 transition-colors duration-300">
        <p><span className="font-semibold">Skills:</span> {listing.skills.join(', ')}</p>
        <p><span className="font-semibold">Average Rating:</span> {listing.rating}/5.0</p>
        <p><span className="font-semibold">Credits Spent:</span> ${listing.credits}</p>
    </div>
);

// Main Listings Component
export default function Listings() {
  const [activeSort, setActiveSort] = useState('Newest');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Reviewer & Junior Listings</h1>

      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 gap-8">

        {/* --- Filters Section (Left) --- */}
        <aside className="md:col-span-2 lg:col-span-1 bg-gray-800/50 border border-gray-700 rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          <div className="space-y-4">
            {/* Role Type Dropdown */}
            <div className="relative">
              <select className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Role Type</option>
                <option>Reviewer</option>
                <option>Junior</option>
              </select>
              <ChevronDownIcon className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {/* Skill Category Dropdown */}
            <div className="relative">
              <select className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Skill Category</option>
                <option>Design</option>
                <option>Development</option>
                <option>Blockchain</option>
              </select>
              <ChevronDownIcon className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {/* Location Input */}
            <div>
              <input 
                type="text" 
                placeholder="Location" 
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
              />
            </div>
          </div>
        </aside>

        {/* --- Listings Section (Middle) --- */}
        <main className="md:col-span-4 lg:col-span-3">
            <h2 className="text-2xl font-bold mb-4">Reviewer</h2>
            <div className="space-y-4">
                {mockListings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>
        </main>

        {/* --- Sort Options (Right) --- */}
        <aside className="md:col-span-6 lg:col-span-1 bg-gray-800/50 border border-gray-700 rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Sort Options</h2>
          <div className="space-y-3">
            {['Newest', 'Highest Rating', 'Lowest Credits'].map(option => (
              <button 
                key={option}
                onClick={() => setActiveSort(option)}
                className={`w-full text-left px-4 py-2 rounded-md border-2 transition-colors duration-200 ${
                  activeSort === option 
                    ? 'bg-teal-500 border-teal-500 text-white font-semibold' 
                    : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}
