'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faQuestionCircle, 
  faPlus, 
  faLayerGroup, 
  faBook, 
  faSignOutAlt,
  faTrash // Added for your dashboard icon example
} from '@fortawesome/free-solid-svg-icons';

type NavItem = {
  href: string;
  icon: any;
  label: string;
  children?: NavItem[];
};

type SideNavProps = {
  role?: 'Student' | 'Instructor';
};

export default function SideNav({ role }: SideNavProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    // Collapse all items when sidebar collapses
    if (isOpen) {
      setExpandedItems({});
    }
  };

  const toggleItem = (href: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [href]: !prev[href]
    }));
  };

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const instructorNavItems: NavItem[] = [
    { 
      href: '/instructor/dashboard', 
      icon: faTachometerAlt, 
      label: 'Dashboard' 
    },
    { 
      href: '/instructor/quizes/auto-graded-quize',
      icon: faQuestionCircle, 
      label: 'Quiz Builder',
      children: [
        { href: '/instructor/quizes/auto-graded-quize', icon: faPlus, label: 'Auto Graded Quiz' },
        { href: '/instructor/quizes/manual-graded-quize', icon: faLayerGroup, label: 'Manual Graded Quiz' }
      ]
    },
  ];
  
  const studentNavItems: NavItem[] = [
    { 
      href: '/student/stDashboard', 
      icon: faTachometerAlt, 
      label: 'Dashboard' 
    },
    { 
      href: '/student/quizHistory',
      icon: faBook, 
      label: 'My Quizzes'
    },
    // Add more student-specific items as needed
  ];
  
  // Get the appropriate nav items based on role
  const navItems = role === 'Instructor' ? instructorNavItems : studentNavItems;

  const isActive = (href: string) => pathname === href || 
    (pathname?.startsWith(href) && href !== '/');

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.href];
    const active = isActive(item.href);

    return (
      <div key={item.href} className={`${level > 0 ? 'ml-6' : ''}`}>
        <div className={`flex items-center justify-between p-3 ${active ? 'bg-[#292732]' : 'hover:bg-[#292732]'}`}>
          <Link href={item.href} className="flex items-center flex-grow">
            <FontAwesomeIcon 
              icon={item.icon} 
              className="w-5 h-5 min-w-[20px] text-gray-300" 
              fixedWidth
            />
            {isOpen && <span className="ml-3">{item.label}</span>}
          </Link>
          
          {isOpen && hasChildren && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                toggleItem(item.href);
              }}
              className="p-1 ml-2 rounded hover:bg-[#3a3847]"
            >
              {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
            </button>
          )}
        </div>

        {isOpen && hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`h-full bg-[#181820] text-white ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
      {/* Top section */}
      <div>
        <div className="p-4 flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center">
              <FontAwesomeIcon 
                icon={faQuestionCircle} 
                className="text-[#F7CA21] text-2xl" 
              />
              <p className="text-xl font-bold text-[#F7CA21] font-Aclonica ml-2">QuizTopia</p>
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className="text-white p-2 rounded hover:bg-[#292732]"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="mt-4">
          {navItems.map(item => renderNavItem(item))}
        </nav>
      </div>

      {/* Bottom section - stays fixed at bottom */}
      <div className="mt-auto border-t border-[#292732]">
        <button 
          onClick={handleLogout}
          className={`flex items-center w-full p-4 hover:bg-[#292732] ${!isOpen ? 'justify-center' : ''}`}
        >
          <FontAwesomeIcon 
            icon={faSignOutAlt} 
            className="w-5 h-5 text-gray-300" 
            fixedWidth
          />
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
}