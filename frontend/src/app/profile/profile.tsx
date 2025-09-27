"use client";

import Image from 'next/image';
import { StarIcon, ArrowRightIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { WalletIcon } from '@heroicons/react/24/solid';
import React from 'react';

// Reusable Card Component with frosted glass effect
interface ProfileCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ title, children, className }) => (
  <div className={`flex flex-col rounded-xl border border-white/10 p-4 bg-white/5 backdrop-blur-lg ${className}`}>
    <h2 className="text-lg font-medium text-gray-200">{title}</h2>
    {children}
  </div>
);


// Main Profile Component
export default function Profile() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Main container with frosted glass effect */}
      <div className="max-w-3xl mx-auto bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 space-y-6 border border-white/10">

        {/* --- Profile Header Section --- */}
        <div className="relative flex flex-col items-center p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-t-xl opacity-40"></div>
          <div className="relative z-10 w-28 h-28 rounded-full border-4 border-gray-800 bg-gray-600 flex items-center justify-center mb-4 mt-6">
            <svg className="h-16 w-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <p className="text-xl font-semibold mb-2">Bio</p>
          <p className="text-lg tracking-widest text-gray-400">************</p>
        </div>

        {/* --- Wallet & Blockchain Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileCard title="Wallet Address" className="h-32">
            <p className="text-lg font-mono text-gray-300 mt-2 break-all">
              ********************
            </p>
          </ProfileCard>
          <ProfileCard title="Blockchain Status" className="h-32 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <p className="text-xl font-semibold text-gray-300">Active</p>
              <WalletIcon className="h-8 w-8 text-green-400" />
            </div>
          </ProfileCard>
        </div>

        {/* --- Credit & Reputation Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileCard title="Credit Balance" className="h-32">
            <p className="text-3xl font-bold text-teal-400 mt-2">12.82500.60</p>
          </ProfileCard>
          <ProfileCard title="Reputation Score" className="h-32 flex items-center justify-center">
            <div className="flex items-center gap-1 mt-2">
              {[...Array(3)].map((_, i) => (
                <StarIcon key={`filled-${i}`} className="h-8 w-8 text-yellow-400 fill-current" />
              ))}
              {[...Array(2)].map((_, i) => (
                <StarIcon key={`empty-${i}`} className="h-8 w-8 text-gray-500" />
              ))}
            </div>
          </ProfileCard>
        </div>

        {/* --- Profile Update Section --- */}
        <ProfileCard title="Profile Update" className="h-32 flex items-center justify-center">
          <div className="flex space-x-8">
            <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
              <ArrowsPointingOutIcon className="h-8 w-8 text-white" />
            </button>
            <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
              <ArrowRightIcon className="h-8 w-8 text-white" />
            </button>
          </div>
        </ProfileCard>

      </div>
    </div>
  );
}

