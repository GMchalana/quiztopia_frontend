'use client'; // This is needed because we'll use client-side functionality

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/quizzes', icon: '📝', label: 'Quizzes' },
    { href: '/analytics', icon: '📊', label: 'Analytics' },
    { href: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className={`h-full bg-[#181820] text-white ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h1 className="text-xl font-bold">QuizTopia</h1>}
        <button 
          onClick={toggleSidebar}
          className="text-white p-2 rounded hover:bg-[#292732]"
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>
      
      <nav className="mt-6">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <div className={`flex items-center p-4 ${pathname === item.href ? 'bg-[#292732]' : 'hover:bg-[#292732]'}`}>
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span className="ml-3">{item.label}</span>}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}