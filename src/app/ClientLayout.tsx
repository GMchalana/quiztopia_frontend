'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SideNav from './components/SideNav';
import Header from './components/Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check for both static and dynamic routes under /student/quizPage
  const isAuthPage = pathname === '/signup' || pathname === '/' || pathname.startsWith('/student/quizPage/');

  const [role, setRole] = useState<'Student' | 'Instructor' | undefined>();

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as 'Student' | 'Instructor' | null;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  // If on auth page (login/signup/quizPage), just render the children without SideNav/Header
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Optional: add a loading state while the role is being set
  if (!role) {
    return <div className="flex h-screen items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <SideNav role={role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
