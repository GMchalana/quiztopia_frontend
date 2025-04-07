'use client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Do login logic
    router.push('/signup'); // Example navigation
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Go to Signup</button>
    </div>
  );
}
