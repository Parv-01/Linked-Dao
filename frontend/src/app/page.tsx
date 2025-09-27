"use client"; // This page needs to be a client component for wallet interaction

import Wallet from './wallet/wallet'; // Import the new Wallet component

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] text-center px-4">
      <h1 className="text-5xl font-bold mb-8">Welcome to the Homepage</h1>
      <p className="text-xl text-gray-300 mb-8">Connect your wallet to get started!</p>

      {/* Render the Wallet component here in the center */}
      <div className="mt-8">
        <Wallet />
      </div>
    </div>
  );
}
