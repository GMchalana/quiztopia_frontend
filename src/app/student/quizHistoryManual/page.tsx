'use client';

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { RotateCcw } from "lucide-react";
import { useRouter } from 'next/navigation';

interface QuizAttempt {
  moduleId: number;
  moduleName: string;
  correct: number;
  total: number;
  attemptDate: string;
  attemptId: number
}

export default function QuizAttemptsPageManual() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setIsLoading(true);
        const userData = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
        const uid = userData ? parseInt(userData, 10) || null : null;
    
        if (uid && baseUrl) {
          setUserId(uid);
          const res = await fetch(`${baseUrl}/answers/quiz-attempts-manual/${uid}`);
          const data = await res.json();
          setAttempts(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch attempts:", error);
        setAttempts([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAttempts();
  }, [baseUrl]);


  const handleAttemptClick = (moduleId: number, attemptId: number) => {
    router.push(`/student/quizReviewManual/${userId}/${moduleId}/${attemptId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">All (00)</h2>
          <div className="bg-white border rounded px-3 py-1 text-sm text-gray-800">Auto-Graded Answers</div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm px-4 py-3 h-20 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">All ({(attempts?.length || 0).toString().padStart(2, '0')})</h2>
        <div className="bg-white border rounded px-3 py-1 text-sm text-gray-800">Manual-Graded Answers</div>
      </div>

      <div className="space-y-3">
        {attempts?.length > 0 ? (
          attempts.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm px-4 py-3 flex justify-between items-center"
              onClick={() => handleAttemptClick(item.moduleId, item.attemptId)}
            >
              <div>
                <div className="font-medium text-gray-800">{item.moduleName}</div>
                <div className="text-sm text-gray-500">
                  <span className="text-yellow-600 font-semibold">
                    {item.correct.toString().padStart(2, '0')}/{item.total.toString().padStart(2, '0')}
                  </span>{" "}
                  were correct
                </div>
                <div className="text-xs text-gray-400">
                  On {format(new Date(item.attemptDate), "yyyy/MM/dd hh:mma")}
                </div>
              </div>
              <button className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded">
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm px-4 py-6 text-center text-gray-500">
            No quiz attempts found
          </div>
        )}
      </div>
    </div>
  );
}