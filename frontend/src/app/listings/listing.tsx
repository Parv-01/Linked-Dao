"use client";

import { XMarkIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

// Mock profile data
const mockProfiles = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    skills: ["React", "TypeScript", "UI/UX Design", "Figma", "JavaScript"],
    bio: "Passionate frontend developer with 3+ years of experience building modern web applications. Love creating intuitive user experiences.",
    rating: 4.8,
    reviews: 23
  },
  {
    id: 2,
    name: "Bob Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    skills: ["Solidity", "Smart Contracts", "Web3", "Ethereum", "DeFi"],
    bio: "Blockchain developer specializing in DeFi protocols and smart contract security. Built 10+ production dApps.",
    rating: 4.9,
    reviews: 31
  },
  {
    id: 3,
    name: "Carol Martinez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    skills: ["Node.js", "Python", "PostgreSQL", "AWS", "DevOps"],
    bio: "Full-stack engineer with expertise in scalable backend systems. Experience with microservices and cloud infrastructure.",
    rating: 4.6,
    reviews: 18
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    skills: ["Project Management", "Agile", "Scrum", "Leadership", "Strategy"],
    bio: "Product manager with 5+ years leading cross-functional teams. Delivered 20+ successful projects on time and budget.",
    rating: 4.7,
    reviews: 25
  },
];

// All available skills for the rating modal
const allSkills = [
  "React", "TypeScript", "JavaScript", "UI/UX Design", "Figma",
  "Solidity", "Smart Contracts", "Web3", "Ethereum", "DeFi",
  "Node.js", "Python", "PostgreSQL", "AWS", "DevOps",
  "Project Management", "Agile", "Scrum", "Leadership", "Strategy",
  "Vue.js", "Angular", "CSS", "HTML", "GraphQL"
];

interface RatingModalProps {
  profile: typeof mockProfiles[0];
  isOpen: boolean;
  onClose: () => void;
}

// Rating Modal Component
const RatingModal: React.FC<RatingModalProps> = ({ profile, isOpen, onClose }) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const submitRating = () => {
    // Handle rating submission here
    console.log("Rating submitted:", {
      profileId: profile.id,
      selectedSkills,
      rating
    });
    onClose();
    setSelectedSkills([]);
    setRating(0);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Rate {profile.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile Preview */}
          <div className="flex items-center space-x-3">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{profile.name}</h3>
              <p className="text-sm text-gray-400">{profile.rating} ⭐ ({profile.reviews} reviews)</p>
            </div>
          </div>

          {/* Skills Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">Select skills to rate:</h3>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${selectedSkills.includes(skill)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Scale */}
          <div>
            <h3 className="text-sm font-medium mb-3">Overall Rating (0-10):</h3>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <button
                  key={num}
                  onMouseEnter={() => setHoverRating(num)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(num)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${num <= (hoverRating || rating)
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {rating > 0 && `Selected: ${rating}/10`}
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={submitRating}
            disabled={selectedSkills.length === 0 || rating === 0}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium disabled:bg-gray-700 disabled:text-gray-500 hover:bg-blue-500 transition-colors"
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
};

// Profile Card Component
const ProfileCard: React.FC<{
  profile: typeof mockProfiles[0];
  onRate: (profile: typeof mockProfiles[0]) => void;
}> = ({ profile, onRate }) => (
  <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 space-y-4 hover:border-gray-600 transition-all duration-300">
    {/* Profile Header */}
    <div className="flex items-start space-x-3">
      <img
        src={profile.avatar}
        alt={profile.name}
        className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate">{profile.name}</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span className="flex items-center">
            ⭐ {profile.rating}
          </span>
          <span>•</span>
          <span>{profile.reviews} reviews</span>
        </div>
      </div>
    </div>

    {/* Skills */}
    <div>
      <h4 className="text-sm font-medium text-gray-300 mb-2">Skills</h4>
      <div className="flex flex-wrap gap-1.5">
        {profile.skills.slice(0, 4).map(skill => (
          <span
            key={skill}
            className="px-2 py-1 text-xs bg-blue-600/20 text-blue-300 rounded-full border border-blue-600/30"
          >
            {skill}
          </span>
        ))}
        {profile.skills.length > 4 && (
          <span className="px-2 py-1 text-xs bg-gray-600/20 text-gray-400 rounded-full">
            +{profile.skills.length - 4} more
          </span>
        )}
      </div>
    </div>

    {/* Bio */}
    <div>
      <h4 className="text-sm font-medium text-gray-300 mb-2">Bio</h4>
      <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
        {profile.bio}
      </p>
    </div>

    {/* Rate Button */}
    <button
      onClick={() => onRate(profile)}
      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg"
    >
      Rate Profile
    </button>
  </div>
);

// Main Listings Component
export default function Listings() {
  const [selectedProfile, setSelectedProfile] = useState<typeof mockProfiles[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRate = (profile: typeof mockProfiles[0]) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Professionals</h1>
        <p className="text-gray-400 text-sm">Rate and review talented professionals</p>
      </div>

      {/* Profile Cards */}
      <div className="space-y-4">
        {mockProfiles.map(profile => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onRate={handleRate}
          />
        ))}
      </div>

      {/* Rating Modal */}
      {selectedProfile && (
        <RatingModal
          profile={selectedProfile}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
