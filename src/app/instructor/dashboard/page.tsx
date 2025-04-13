'use client';
import { useEffect, useState } from 'react';
import QuizCard from '../../components/QuizCard';


interface Module {
  id: number;
  moduleName: string;
  numOfQuestions: number;
  estimationTime: number;
}


const quizData = [
  { title: "Basic Fundamentals of Geography", questionCount: 10 },
  { title: "Graphic Design Fundamentals", questionCount: 10 },
  { title: "Business Marketing Stage : 01", questionCount: 30 },
  { title: "Python for Beginners", questionCount: 20 },
  { title: "UML Diagrams for IT", questionCount: 20 },
  { title: "Accounting & IT", questionCount: 10 },
  { title: "Basic Data Structures", questionCount: 35 },
  { title: "Business Intelligence Basics", questionCount: 10 },
  { title: "Linux Fundamentals", questionCount: 20 },
];

export default function DashboardPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;



  useEffect(() => {
    fetch(`${baseUrl}/modules/get-all-modules`) // Change this to match your actual endpoint
      .then(res => res.json())
      .then(data => setModules(data))
      .catch(err => console.error('Failed to fetch modules:', err));
  }, []);



  
  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Quizzes</h1> */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <QuizCard 
            key={module.id}
            title={module.moduleName}
            questionCount={module.numOfQuestions}
          />
        ))}
      </div>
    </div>
  );
}