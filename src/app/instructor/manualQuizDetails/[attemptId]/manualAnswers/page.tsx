'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Question {
  questionId: number;
  questionIndex: number;
  question: string;
  sampleAnswer: string;
  studentAnswer: string;
  isGraded: boolean;
  isCorrect: boolean | number | null; // ✅ replaced `any` with specific types
  submittedAt: string;
}

interface AttemptDetails {
  attemptId: number;
  student: { id: number; name: string };
  module: { id: number; name: string };
  attemptNumber: number;
  attemptDate: string;
  scoreSummary: {
    totalQuestions: number;
    gradedQuestions: number;
    correctAnswers: number;
    percentage: number | null;
    gradingStatus: string;
  };
  questions: Question[];
}

export default function ReviewAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const [attemptDetails, setAttemptDetails] = useState<AttemptDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changesMade, setChangesMade] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchAttemptDetails = async () => {
      try {
        const res = await fetch(`${baseUrl}/review/get-manual-selected-attempt/${params.attemptId}`);
        if (!res.ok) throw new Error('Failed to fetch attempt details');
        const data = await res.json();
        setAttemptDetails(data);
      } catch (err) {
        setError((err as Error).message); // ✅ Cast `err` instead of using `any`
      } finally {
        setLoading(false);
      }
    };

    if (baseUrl) {
      fetchAttemptDetails();
    }
  }, [baseUrl, params.attemptId]); // ✅ Added `baseUrl` to dependency array

  const handleGradeChange = (questionId: number, isCorrect: boolean | number) => {
    if (!attemptDetails) return;

    setAttemptDetails(prev => {
      if (!prev) return null;

      const updatedQuestions = prev.questions.map(q =>
        q.questionId === questionId
          ? { ...q, isCorrect, isGraded: true }
          : q
      );

      const correctAnswers = updatedQuestions.filter(q => q.isCorrect === true || q.isCorrect === 1).length;
      const gradedQuestions = updatedQuestions.filter(q => q.isGraded).length;

      return {
        ...prev,
        questions: updatedQuestions,
        scoreSummary: {
          ...prev.scoreSummary,
          correctAnswers,
          gradedQuestions,
          percentage: gradedQuestions > 0
            ? Math.round((correctAnswers / prev.scoreSummary.totalQuestions) * 100)
            : null,
          gradingStatus: gradedQuestions === prev.scoreSummary.totalQuestions
            ? 'Graded'
            : 'Partially Graded'
        }
      };
    });

    setChangesMade(true);
  };

  const handleSaveGrading = async () => {
    if (!attemptDetails || !changesMade) return;

    try {
      const requestBody = {
        grades: attemptDetails.questions.map(q => ({
          questionId: q.questionId,
          isCorrect: q.isCorrect
        }))
      };

      console.log("Request payload:", requestBody);

      const res = await fetch(
        `${baseUrl}/review/update-iscorrect-manual/${params.attemptId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }
      );

      if (!res.ok) throw new Error('Failed to save grading');

      setChangesMade(false);
      router.refresh();

      Swal.fire({
        icon: 'success',
        title: 'Reviewed!',
        text: 'Grading saved successfully!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err) {
      console.error("Error details:", err);
      setError((err as Error).message); // ✅ cast instead of using `any`
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!attemptDetails) return <div>No attempt data found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/instructor/reviewManualQuiz/${params.moduleId}/stAttempts`}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="mr-1" size={20} />
          Back
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {attemptDetails.module.name} : {attemptDetails.student.name}
        </h1>
        <div className="mt-2 text-sm text-gray-500">
          Attempt #{attemptDetails.attemptNumber} • {new Date(attemptDetails.attemptDate).toLocaleString()}
        </div>
        <div className="mt-2 text-sm font-medium text-gray-800">
          Grading Status: <span className="text-blue-600">{attemptDetails.scoreSummary.gradingStatus}</span>
        </div>
      </div>

      <div className="space-y-8">
        {attemptDetails.questions.map((question) => (
          <div key={question.questionId} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                {question.questionIndex}. {question.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Student&apos;s Answer:</h3> {/* ✅ escaped apostrophe */}
                <div className="bg-gray-50 p-4 rounded border border-gray-200 text-gray-800">
                  {question.studentAnswer}
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleGradeChange(question.questionId, 1)}
                    className={`px-4 py-2 rounded ${
                      question.isCorrect === 1
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    Correct
                  </button>
                  <button
                    onClick={() => handleGradeChange(question.questionId, 0)}
                    className={`px-4 py-2 rounded ${
                      question.isCorrect === 0
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    Incorrect
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Expected Answer:</h3>
                <div className="bg-gray-50 p-4 rounded border border-gray-200 text-gray-800">
                  {question.sampleAnswer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {changesMade && <span className="text-yellow-600">You have unsaved changes</span>}
        </div>
        <button
          onClick={handleSaveGrading}
          disabled={!changesMade}
          className={`px-6 py-2 rounded text-white ${
            changesMade ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Save Grading
        </button>
      </div>
    </div>
  );
}
