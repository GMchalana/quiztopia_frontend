'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import QuizCard from '../../components/QuizCard';

interface Module {
  id: number;
  moduleName: string;
  numOfQuestions: number;
  estimationTime: number;
}

export default function DashboardPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetch(`${baseUrl}/modules/get-all-modules`)
      .then(res => res.json())
      .then(data => setModules(data))
      .catch(err => console.error('Failed to fetch modules:', err));
  }, []);

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

          Swal.fire('Deleted!', 'Module has been deleted.', 'success');
        } catch (error) {
          console.error('Delete failed:', error);
          Swal.fire('Error!', 'Failed to delete the module.', 'error');
        }
      }
    });
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <QuizCard 
            key={module.id}
            moduleId={module.id}
            title={module.moduleName}
            questionCount={module.numOfQuestions}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
