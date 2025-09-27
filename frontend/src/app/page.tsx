"use client"; // This page needs to be a client component for wallet interaction

import Wallet from './wallet/wallet'; // Import the new Wallet component

export default function Home() {
  return (
    <section className="w-full max-w-md mx-auto flex flex-col items-center justify-start pt-12 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Linked-Dao</h1>
      <p className="text-base text-gray-300 mb-6">Connect your wallet to get started!</p>
      <div className="mt-4 w-full flex justify-center">
        <Wallet />
      </div>
    </section>
  );
}
