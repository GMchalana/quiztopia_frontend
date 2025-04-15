'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import QuizCard from '../../components/QuizCardSt';

interface Module {
  id: number;
  moduleName: string;
  numOfQuestions: number;
  estimationTime: number;
  averageRating: number; // Assuming this is part of the module data
}

export default function StDashboard() {
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetch(`${baseUrl}/modules/get-all-modules`)
      .then(res => res.json())
      .then(data => {
        setModules(data);
        setFilteredModules(data); // Initialize filtered modules with all modules
      })
      .catch(err => console.error('Failed to fetch modules:', err));
  }, []);

  // Filter modules based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredModules(modules);
    } else {
      const filtered = modules.filter(module =>
        module.moduleName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredModules(filtered);
    }
  }, [searchTerm, modules]);

  const handleDelete = (moduleId: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the module!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${baseUrl}/modules/delete-module/${moduleId}`, {
            method: 'DELETE',
          });

          if (!response.ok) throw new Error('Delete failed');

          setModules(prev => prev.filter(module => module.id !== moduleId));
          setFilteredModules(prev => prev.filter(module => module.id !== moduleId));

          Swal.fire('Deleted!', 'Module has been deleted.', 'success');
        } catch (error) {
          console.error('Delete failed:', error);
          Swal.fire('Error!', 'Failed to delete the module.', 'error');
        }
      }
    });
  };

  return (
    <div className="p-6 ">
      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-xl rounded-4xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input
            type="text"
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-4xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {filteredModules.length > 0 ? (
          filteredModules.map((module) => (
            <QuizCard 
              key={module.id}
              moduleId={module.id}
              title={module.moduleName}
              questionCount={module.numOfQuestions}
              time={module.estimationTime}
              averageRating={module.averageRating} // Placeholder for average rating
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">
              {searchTerm.trim() === '' 
                ? 'No modules available' 
                : `No modules found matching "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}