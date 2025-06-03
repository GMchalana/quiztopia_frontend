'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Attempt {
  attemptId: number;
  userId: number;
  studentName: string;
  attemptNumber: number;
  attemptDate: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  gradingStatus: string;
}

export default function ModuleAttemptsPage() {
  const params = useParams();
  const moduleId = params.moduleId as string;
   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  const [data, setData] = useState<{
    moduleName: string;
    attempts: Attempt[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/review/get-all-attemps-for-ins-manual/${moduleId}`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch attempts');
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchData();
    }
  }, [moduleId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/instructor/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-1" size={20} />
            Back
          </Link>
        </div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/instructor/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-1" size={20} />
            Back
          </Link>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/instructor/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
          <ChevronLeft className="mr-1" size={20} />
          Back
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">{data.moduleName}</h1>
      <h2 className="text-lg text-gray-600 mb-6">All Attempts ({data.attempts.length})</h2>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {data.attempts.map((attempt) => (
            <div key={attempt.attemptId} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{attempt.studentName}</h3>
                  <p className="text-sm text-gray-500">
                    On {new Date(attempt.attemptDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-black">
                      {attempt.gradingStatus === 'Fully graded' ? 
                        `${attempt.score}/${attempt.totalQuestions} were correct` : 
                        'Not Reviewed yet'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(attempt.attemptDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Link
                    href={`/instructor/manualQuizDetails/${attempt.attemptId}/manualAnswers`}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      attempt.gradingStatus === 'Fully graded' 
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } transition-colors`}
                  >
                    {attempt.gradingStatus === 'Fully graded' ? 'Review' : 'Review'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}