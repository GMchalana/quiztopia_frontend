'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface Question {
  questionId: number;
  questionIndex: number;
  questionText: string;
  answers: {
    answerId: number;
    answerText: string;
    isCorrect: boolean;
  }[];
  userResponse?: {
    studentAnswerId: number;
    selectedAnswerIndex: number;
    selectedAnswerText: any;
    submittedAt: string;
  };
  isCorrect: boolean;
}

interface ReviewData {
  moduleId: string;
  attemptId: string;
  moduleName?: string;
  questions: Question[];
}

export default function QuizReviewPage({
  params,
}: {
  params: Promise<{ userId: string; moduleId: string; attemptId: string }>;
}) {
  const { userId, moduleId, attemptId } = use(params);
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
          `${baseUrl}/answers/module-review/${userId}/${moduleId}/${attemptId}`
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
  }, [userId, moduleId, attemptId, baseUrl]);

  // Calculate marks from questions
  const correctCount = reviewData?.questions?.filter(q => q.isCorrect).length || 0;
  const totalQuestions = reviewData?.questions?.length || 0;
  const attemptDate = reviewData?.questions?.[0]?.userResponse?.submittedAt;

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

  const getCorrectAnswer = (question: Question) => {
    return question.answers.find((answer) => answer.isCorrect)?.answerText || '';
  };

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
        <h2 className="text-lg text-gray-600">
          Marks: {correctCount}/{totalQuestions}
        </h2>
      </div>

      <div className="space-y-6">
        {reviewData.questions?.map((question) => (
          <div
            key={question.questionId}
            className={`p-4 rounded-lg border ${
              question.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-800">
                {question.questionIndex + 1}. {question.questionText}
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  question.isCorrect
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {question.isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Your Answer
                </h4>
                <p
                  className={`p-3 rounded ${
                    question.isCorrect
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {question.userResponse?.selectedAnswerText}
                </p>
              </div>

              {!question.isCorrect && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Correct Answer
                  </h4>
                  <p className="p-3 rounded bg-green-100 text-green-800">
                    {getCorrectAnswer(question)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isMounted && attemptDate && (
        <div className="mt-8 pt-4 border-t text-sm text-gray-500">
          You Attempted On {format(new Date(attemptDate), 'yyyy/MM/dd hh:mma')}
        </div>
      )}
    </div>
  );
}