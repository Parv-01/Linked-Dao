"use client";

import { BuildingOfficeIcon, ClockIcon, CurrencyDollarIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const mockJobs = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "Remote",
        type: "Full-time",
        salary: "$80,000 - $120,000",
        description: "We are looking for a passionate Senior Frontend Developer to join our growing team. You will be responsible for building scalable web applications using modern JavaScript frameworks.",
        fullDescription: `We are seeking a talented Senior Frontend Developer to join our innovative team at TechCorp Inc. In this role, you will be responsible for creating exceptional user experiences and building scalable web applications.

Key Responsibilities:
• Develop and maintain complex frontend applications using React, TypeScript, and Next.js
• Collaborate with designers and backend developers to implement pixel-perfect designs
• Optimize applications for maximum speed and scalability
• Write clean, maintainable, and well-documented code
• Participate in code reviews and mentor junior developers
• Stay up-to-date with the latest frontend technologies and best practices

Requirements:
• 5+ years of experience in frontend development
• Strong proficiency in React, TypeScript, and modern JavaScript (ES6+)
• Experience with state management libraries (Redux, Zustand, etc.)
• Knowledge of CSS preprocessors and styling frameworks
• Familiarity with testing frameworks (Jest, React Testing Library)
• Understanding of web performance optimization techniques
• Experience with version control systems (Git)

Nice to Have:
• Experience with Next.js and server-side rendering
• Knowledge of GraphQL and REST APIs
• Familiarity with CI/CD pipelines
• Experience with mobile-responsive design
• Understanding of web accessibility standards

Benefits:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements and remote-first culture
• Professional development budget
• Unlimited PTO policy
• Modern equipment and home office stipend`,
        skills: ["React", "TypeScript", "Next.js", "JavaScript", "CSS"],
        postedDate: "2 days ago",
        applicants: 15
    },
    {
        id: 2,
        title: "Blockchain Developer",
        company: "CryptoTech Solutions",
        location: "San Francisco, CA",
        type: "Contract",
        salary: "$100 - $150/hour",
        description: "Join our blockchain team to develop cutting-edge DeFi applications and smart contracts on Ethereum and other EVM-compatible chains.",
        fullDescription: `CryptoTech Solutions is at the forefront of blockchain innovation, and we're looking for a skilled Blockchain Developer to help us build the future of decentralized finance.

Key Responsibilities:
• Design and implement smart contracts using Solidity
• Develop and deploy DeFi protocols and applications
• Integrate blockchain functionality with frontend applications
• Conduct smart contract audits and security reviews
• Collaborate with cross-functional teams to deliver blockchain solutions
• Research and implement new blockchain technologies and protocols

Requirements:
• 3+ years of experience in blockchain development
• Strong proficiency in Solidity and smart contract development
• Experience with Ethereum, Web3.js, and Ethers.js
• Knowledge of DeFi protocols (Uniswap, Compound, Aave, etc.)
• Understanding of blockchain security best practices
• Experience with development tools (Hardhat, Truffle, Remix)
• Familiarity with IPFS and decentralized storage solutions

Technical Skills:
• Smart contract development and deployment
• Gas optimization techniques
• Token standards (ERC-20, ERC-721, ERC-1155)
• Layer 2 solutions (Polygon, Arbitrum, Optimism)
• Testing frameworks for smart contracts
• Integration with oracles (Chainlink, etc.)

Benefits:
• Highly competitive hourly rates
• Flexible contract terms
• Work with cutting-edge blockchain technology
• Opportunity to shape the future of DeFi
• Remote-friendly environment
• Token allocation for successful projects`,
        skills: ["Solidity", "Web3", "Ethereum", "DeFi", "Smart Contracts"],
        postedDate: "1 day ago",
        applicants: 8
    },
    {
        id: 3,
        title: "UI/UX Designer",
        company: "Design Studio Pro",
        location: "New York, NY",
        type: "Part-time",
        salary: "$60,000 - $80,000",
        description: "Create beautiful and intuitive user interfaces for web and mobile applications. Work closely with product teams to deliver exceptional user experiences.",
        fullDescription: `Design Studio Pro is seeking a creative and detail-oriented UI/UX Designer to join our dynamic team. You'll be responsible for creating user-centered designs that delight our clients and their customers.

Key Responsibilities:
• Design user interfaces for web and mobile applications
• Create wireframes, prototypes, and high-fidelity mockups
• Conduct user research and usability testing
• Collaborate with developers to ensure design implementation
• Maintain and evolve design systems and style guides
• Present design concepts to stakeholders and clients

Requirements:
• 2+ years of experience in UI/UX design
• Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)
• Strong understanding of user-centered design principles
• Experience with prototyping tools and techniques
• Knowledge of responsive design and mobile-first approach
• Portfolio showcasing diverse design projects
• Excellent communication and presentation skills

Design Skills:
• Information architecture and user flow design
• Visual design and typography
• Color theory and design systems
• Accessibility and inclusive design practices
• Design for multiple platforms and devices
• Animation and micro-interactions

Tools & Technologies:
• Figma (primary design tool)
• Adobe Creative Suite (Photoshop, Illustrator, XD)
• Sketch and InVision
• Principle or After Effects for animations
• HTML/CSS knowledge (preferred)
• Version control for design files

Benefits:
• Flexible part-time schedule
• Creative and collaborative work environment
• Professional development opportunities
• Access to premium design tools and resources
• Health insurance and benefits package
• Opportunity to work with diverse clients and industries`,
        skills: ["Figma", "UI/UX Design", "Prototyping", "User Research", "Adobe Creative Suite"],
        postedDate: "5 days ago",
        applicants: 23
    },
    {
        id: 4,
        title: "Full Stack Developer",
        company: "StartupXYZ",
        location: "Austin, TX",
        type: "Full-time",
        salary: "$70,000 - $100,000",
        description: "Build end-to-end web applications using modern technologies. Join a fast-paced startup environment where you can make a real impact.",
        fullDescription: `StartupXYZ is a rapidly growing tech startup, and we're looking for a versatile Full Stack Developer to help us scale our platform and build innovative features.

Key Responsibilities:
• Develop both frontend and backend components of web applications
• Design and implement RESTful APIs and database schemas
• Work with modern JavaScript frameworks and libraries
• Collaborate with product managers and designers on feature development
• Optimize application performance and scalability
• Participate in the full software development lifecycle
• Debug and troubleshoot issues across the stack

Frontend Technologies:
• React, Vue.js, or Angular
• TypeScript and modern JavaScript (ES6+)
• State management (Redux, Vuex, etc.)
• CSS frameworks and preprocessors
• Responsive design and mobile optimization

Backend Technologies:
• Node.js, Python, or Java
• Express.js, FastAPI, or Spring Boot
• Database design and optimization (PostgreSQL, MongoDB)
• Authentication and authorization systems
• API development and documentation
• Cloud services (AWS, GCP, or Azure)

Requirements:
• 3+ years of full stack development experience
• Strong problem-solving and analytical skills
• Experience with version control (Git) and CI/CD
• Knowledge of testing frameworks and methodologies
• Understanding of web security best practices
• Excellent communication and teamwork skills
• Bachelor's degree in Computer Science or equivalent experience

Startup Environment:
• Fast-paced, dynamic work environment
• Opportunity to wear multiple hats and learn new technologies
• Direct impact on product development and company growth
• Collaborative team culture with flat organizational structure
• Flexible work arrangements and professional development support

Benefits:
• Competitive salary with equity options
• Health, dental, and vision insurance
• Flexible PTO and work-from-home options
• Professional development budget
• Modern office space with free snacks and drinks
• Team building events and company retreats`,
        skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "AWS"],
        postedDate: "3 days ago",
        applicants: 31
    }
];

interface JobModalProps {
    job: typeof mockJobs[0] | null;
    isOpen: boolean;
    onClose: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ job, isOpen, onClose }) => {
    const [isApplying, setIsApplying] = useState(false);

    if (!isOpen || !job) return null;

    const handleApply = () => {
        setIsApplying(true);
        setTimeout(() => {
            alert('Application submitted successfully!');
            setIsApplying(false);
            onClose();
        }, 1500);
    };

    return (
        <div className='fixed inset-0 flex justify-center z-100 '>
            <div className="bg-gray-900 max-w-md overflow-y-auto max-h-screen pb-24">
                <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 z-10">
                    <div className="flex items-center justify-between p-4">
                        <h1 className="text-lg font-semibold">Job Details</h1>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="p-4 pb-12 space-y-6">
                   
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{job.title}</h2>
                            <div className="flex items-center space-x-2 text-gray-400 mb-3">
                                <BuildingOfficeIcon className="h-4 w-4" />
                                <span className="font-medium">{job.company}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-300">
                                <MapPinIcon className="h-4 w-4 text-gray-400" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-300">
                                <ClockIcon className="h-4 w-4 text-gray-400" />
                                <span>{job.type}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-300 col-span-2">
                                <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                                <span>{job.salary}</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Required Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map(skill => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 text-xs bg-blue-600/20 text-blue-300 rounded-full border border-blue-600/30"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                        <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                            {job.fullDescription}
                        </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Posted {job.postedDate}</span>
                            <span className="text-gray-400">{job.applicants} applicants</span>
                        </div>
                    </div>
                </div>

                <div className=" p-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
                    <button
                        onClick={handleApply}
                        disabled={isApplying}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isApplying ? 'Applying...' : 'Apply Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const JobCard: React.FC<{
    job: typeof mockJobs[0];
    onClick: (job: typeof mockJobs[0]) => void;
}> = ({ job, onClick }) => (
    <div
        onClick={() => onClick(job)}
        className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 space-y-4 hover:border-gray-600 hover:bg-gray-800/90 transition-all duration-300 cursor-pointer"
    >
        <div>
            <h3 className="font-semibold text-lg text-white mb-1">{job.title}</h3>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <BuildingOfficeIcon className="h-4 w-4" />
                <span>{job.company}</span>
            </div>
        </div>
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-300">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span>{job.type}</span>
                </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-400">
                <CurrencyDollarIcon className="h-4 w-4" />
                <span>{job.salary}</span>
            </div>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
            {job.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
            {job.skills.slice(0, 3).map(skill => (
                <span
                    key={skill}
                    className="px-2 py-1 text-xs bg-blue-600/20 text-blue-300 rounded-full border border-blue-600/30"
                >
                    {skill}
                </span>
            ))}
            {job.skills.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-600/20 text-gray-400 rounded-full">
                    +{job.skills.length - 3} more
                </span>
            )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-700">
            <span>Posted {job.postedDate}</span>
            <span>{job.applicants} applicants</span>
        </div>
    </div>
);

export default function JobsPage() {
    const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleJobClick = (job: typeof mockJobs[0]) => {
        setSelectedJob(job);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
        document.body.style.overflow = 'unset'
    };

    return (
        <div className="w-full space-y-6 max-w-md mx-auto p-4 pt-6">
            <div className="text-left">
                <h1 className="text-2xl font-bold mb-2">Job Opportunities</h1>
                <p className="text-gray-400 text-sm">Find your next career opportunity</p>
            </div>

            <div className="space-y-4">
                {mockJobs.map(job => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onClick={handleJobClick}
                    />
                ))}
            </div>

            <JobModal
                job={selectedJob}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}
