'use client';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Do login logic
    router.push('/signup'); // Example navigation
  };

  return (
    <div>
      <h1>Dashboard</h1>
     
    </div>
  );
}