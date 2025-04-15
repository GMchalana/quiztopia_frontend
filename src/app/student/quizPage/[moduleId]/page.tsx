'use client';

import { useRouter } from 'next/navigation';
import QuizComponent from '../../../components/QuizComponent';

export default function QuizPage({ params }: { params: { moduleId: string } }) {
  const router = useRouter();

  const handleFinish = () => {
    router.push('/student/stDashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <QuizComponent moduleId={params.moduleId} onFinish={handleFinish} />
    </div>
  );
}