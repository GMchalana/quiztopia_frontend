'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import logoH from '../../assets/logoH.png';
import dashic from '../../assets/dashic.png';
import qbic from '../../assets/qbic.png'; // Add your other icons
import logoutic from '../../assets/logoutic.png'; // Add your logout icon

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
    window.location.href = '/';
    // Typically you would:
    // 1. Clear authentication tokens
    // 2. Redirect to login page
  };

  const navItems = [
    { href: '/dashboard', icon: dashic, label: 'Dashboard' },
    { href: '/quizzes', icon: qbic, label: 'Quiz Builder' },
  ];

  return (
    <div className={`h-full bg-[#181820] text-white ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
      {/* Top section */}
      <div>
        <div className="p-4 flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center">
              <Image
                src={logoH}
                alt="Logo"
                width={50}
                height={50}
                className="max-w-[50px] h-auto"
              />
              <p className="text-xl font-bold text-[#F7CA21] font-Aclonica ml-2">QuizTopia</p>
            </div>
          )}
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
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                {isOpen && <span className="ml-3">{item.label}</span>}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom section - stays fixed at bottom */}
      <div className="mt-auto border-t border-[#292732]">
        <button 
          onClick={handleLogout}
          className={`flex items-center w-full p-4 hover:bg-[#292732] ${!isOpen ? 'justify-center' : ''}`}
        >
          <Image
            src={logoutic}
            alt="Logout"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
}