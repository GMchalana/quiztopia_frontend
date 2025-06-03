'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface ManualQuestion {
  id: number;
  questionIndex: number;
  question: string;
  type: 'manual-graded';
  sampleAnswer: string;
  options: null;
  correctAnswer: null;
  studentAnswer: string;
  graded: boolean;
  isCorrect: boolean | null;
}

interface ReviewData {
  success: boolean;
  attemptId: string;
  userId: number;
  moduleId: number;
  userAttemptNumber: number;
  questions: ManualQuestion[];
  moduleName?: string;
}

export default function QuizReviewPage({
  params,
}: {
  params: Promise<{ userId: string; moduleId: string; attemptId: string }>;
}) {
  const { attemptId } = use(params);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    setIsMounted(true);
    const fetchReviewData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${baseUrl}/answers/review-manual/${attemptId}`
        );
        const data = await res.json();
        setReviewData(data);
      } catch (error) {
        console.error('Failed to fetch review data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewData();
  }, [attemptId, baseUrl]);

  // Calculate marks for manual questions (if graded)
  const correctCount = reviewData?.questions?.filter(q => q.isCorrect === true).length || 0;
  const totalQuestions = reviewData?.questions?.length || 0;
  const allGraded = reviewData?.questions?.every(q => q.graded) || false;

  if (!isMounted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="h-6 w-64 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>Failed to load review data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/student/quizHistory"
        className="flex items-center text-blue-600 mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {reviewData.moduleName || `Module ${reviewData.moduleId}`}
        </h1>
        {allGraded ? (
          <h2 className="text-lg text-gray-600">
            Marks: {correctCount}/{totalQuestions}
          </h2>
        ) : (
          <h2 className="text-lg text-gray-600">
            Your answers are being reviewed by the instructor
          </h2>
        )}
      </div>

      <div className="space-y-6">
        {reviewData.questions?.map((question) => (
          <div
            key={question.id}
            className={`p-4 rounded-lg border ${
              question.graded
                ? question.isCorrect
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-800">
                {question.questionIndex + 1}. {question.question}
              </h3>
              {question.graded ? (
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    question.isCorrect
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {question.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              ) : (
                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending Review
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Your Answer
                </h4>
                <p
                  className={`p-3 rounded ${
                    question.graded
                      ? question.isCorrect
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {question.studentAnswer}
                </p>
              </div>

              {question.graded && !question.isCorrect && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Sample Answer
                  </h4>
                  <p className="p-3 rounded bg-blue-100 text-blue-800">
                    {question.sampleAnswer}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t text-sm text-gray-500">
        Attempt #{reviewData.userAttemptNumber}
      </div>
    </div>
  );
}