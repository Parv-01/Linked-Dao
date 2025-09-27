"use client";

import {
  BriefcaseIcon,
  DocumentTextIcon,
  HomeIcon,
  StarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  BriefcaseIcon as BriefcaseIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  HomeIcon as HomeIconSolid,
  StarIcon as StarIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: HomeIcon,
    iconActive: HomeIconSolid,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserIcon,
    iconActive: UserIconSolid,
  },
  {
    href: "/listings",
    label: "Listings",
    icon: BriefcaseIcon,
    iconActive: BriefcaseIconSolid,
  },
  {
    href: "/jobs",
    label: "Jobs",
    icon: DocumentTextIcon,
    iconActive: DocumentTextIconSolid,
  },
  {
    href: "/reviews",
    label: "Reviews",
    icon: StarIcon,
    iconActive: StarIconSolid,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-t border-white/10">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.iconActive : item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${isActive
                  ? 'text-blue-400 bg-blue-400/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className={`text-xs font-medium ${isActive ? 'text-blue-400' : 'text-gray-400'
                }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS devices */}
      <div className="h-safe-area-inset-bottom bg-black/80" />
    </div>
  );
}