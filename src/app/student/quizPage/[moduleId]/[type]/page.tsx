'use client';

import { useRouter } from 'next/navigation';
import QuizComponent from '../../../../components/QuizComponent';

export default function QuizPage({ params }: any) {
  const router = useRouter();

  const handleFinish = () => {
    router.push('/student/stDashboard');
  };

  return (
    <div className="min-h-screen bg-[url('/src/assets/quizbg.jpg')]">
      <QuizComponent moduleId={params.moduleId} type={params.type} onFinish={handleFinish} />
    </div>
  );
}