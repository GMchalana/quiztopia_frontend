import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface Attempt {
  attemptId: number;
  userId: number;
  studentName: string;
  attemptNumber: number;
  attemptDate: string;
  score: number;
  totalQuestions: number;
  percentage: number;
}

async function getModuleAttempts(moduleId: string) {
  const res = await fetch(`http://localhost:3333/api/review/get-all-attemps-for-ins/${moduleId}`, {
    next: { revalidate: 3600 } // Optional: revalidate data every hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch attempts');
  }
  return res.json();
}

export default async function ModuleAttemptsPage({
  params,
}: {
  params: { moduleId: string };
}) {
  try {
    const { moduleName, attempts } = await getModuleAttempts(params.moduleId);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/instructor/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-1" size={20} />
            Back
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">{moduleName}</h1>
        <h2 className="text-lg text-gray-600 mb-6">All Attempts ({attempts.length})</h2>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {attempts.map((attempt: Attempt) => (
              <div key={attempt.attemptId} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{attempt.studentName}</h3>
                    <p className="text-sm text-gray-500">
                      On {new Date(attempt.attemptDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {attempt.score}/{attempt.totalQuestions} were correct
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(attempt.attemptDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/modules" className="flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-1" size={20} />
            Back
          </Link>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading attempts: {(error as Error).message}
        </div>
      </div>
    );
  }
}