"use client";

import { PencilIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

// Dev level options
const DEV_LEVELS = [
  { value: 'L1', label: 'L1 - Junior Developer', description: 'Entry level, 0-2 years experience' },
  { value: 'L2', label: 'L2 - Mid-level Developer', description: '2-4 years experience' },
  { value: 'L3', label: 'L3 - Senior Developer', description: '4-7 years experience' },
  { value: 'L4', label: 'L4 - Lead Developer', description: '7-10 years experience' },
  { value: 'L5', label: 'L5 - Principal Developer', description: '10+ years experience' }
];

interface DevLevelModalProps {
  isOpen: boolean;
  currentLevel: string;
  onClose: () => void;
  onSubmit: (level: string) => void;
}

// Dev Level Modal Component
const DevLevelModal: React.FC<DevLevelModalProps> = ({ isOpen, currentLevel, onClose, onSubmit }) => {
  const [selectedLevel, setSelectedLevel] = useState(currentLevel);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(selectedLevel);
    alert('DAO will review your profile. If you still wish to be a reviewer, please wait for approval.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Update Developer Level</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Dev Level Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select your developer level:
            </label>
            <div className="space-y-2">
              {DEV_LEVELS.map((level) => (
                <label
                  key={level.value}
                  className={`flex items-start space-x-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedLevel === level.value
                      ? 'bg-blue-600/20 border border-blue-600/50'
                      : 'bg-gray-800/50 hover:bg-gray-700/50 border border-transparent'
                    }`}
                >
                  <input
                    type="radio"
                    name="devLevel"
                    value={level.value}
                    checked={selectedLevel === level.value}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{level.label}</div>
                    <div className="text-sm text-gray-400">{level.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors"
          >
            Update Level
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Profile Component
export default function Profile() {
  const [devLevel, setDevLevel] = useState('L3');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - in real app, this would come from wallet/API
  const walletAddress = "0x742d35Cc6636C0532925a3b8b93e7fB21f7E6C";
  const creditBalance = 1250.75;
  const reputationScore = 7;

  const handleDevLevelUpdate = (newLevel: string) => {
    setDevLevel(newLevel);
    // Here you would typically make an API call to update the user's profile
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatCreditBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(balance);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-400 text-sm">Manage your developer profile</p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 space-y-6">

        {/* Profile Avatar */}
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Wallet Address */}
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Wallet Address</h3>
          <p className="text-lg font-mono text-white">{formatWalletAddress(walletAddress)}</p>
          <p className="text-xs text-gray-500 mt-1 font-mono">{walletAddress}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4">

          {/* Credit Balance */}
          <div className="bg-gray-700/50 rounded-xl p-4 text-center">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Credit Balance</h4>
            <p className="text-2xl font-bold text-green-400">{formatCreditBalance(creditBalance)}</p>
            <p className="text-xs text-gray-500">ETH</p>
          </div>

          {/* Reputation Score */}
          <div className="bg-gray-700/50 rounded-xl p-4 text-center">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Reputation Score</h4>
            <p className="text-2xl font-bold text-yellow-400">{reputationScore}/10</p>
            <div className="flex justify-center mt-2">
              <div className="flex space-x-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i < reputationScore ? 'bg-yellow-400' : 'bg-gray-600'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Developer Level */}
          <div className="bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-400">Developer Level</h4>
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                <PencilIcon className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{devLevel}</p>
              <p className="text-xs text-gray-500 mt-1">
                {DEV_LEVELS.find(level => level.value === devLevel)?.description}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Dev Level Modal */}
      <DevLevelModal
        isOpen={isModalOpen}
        currentLevel={devLevel}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleDevLevelUpdate}
      />
    </div>
  );
}

