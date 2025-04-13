'use client';

import { useEffect, useState } from "react";
import Image from 'next/image';
import user from '../../assets/user.png';

export default function Header() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user data from localStorage when component mounts
    const userData = localStorage.getItem('userName');
    setUserName(userData || '');
    
  }, []);
  
  return (
    <header className="bg-white shadow-sm p-2 border-b">
    <div className="flex justify-between items-center">
    <div></div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-200">
          🔔
        </button>
        <div className="flex items-center">
         
           <Image
              src={user}
              alt="user"
              width={50}
              height={50}
              className="max-w-[50px] h-auto"
            />
          <span className="ml-2 text-black">{userName || 'User'}</span>
        </div>
      </div>
    </div>
  </header>
  );
}