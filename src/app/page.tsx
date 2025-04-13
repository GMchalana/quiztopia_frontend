'use client';
import { useRouter } from 'next/navigation';
import login from '../assets/signup.png';
import Image from 'next/image';
import logo from '../assets/logo.png';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Import eye icons from react-icons

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


  const handleInputChange = (e : any) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e : any) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Login successful - store token and redirect
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      router.push('/instructor/dashboard'); // Redirect to dashboard or home page
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    router.push('/signup');
  };

  return (
    <div className="h-screen flex flex-col bg-[#181820]">
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Left side - Image (hidden on mobile) */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src={login}
            alt="Login background"
            layout="fill"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center overflow-y-auto bg-[#181820] pt-20">
          <div className="bg-[#181820] w-full max-w-lg px-1 md:px-1 pt-10 md:py-28">
            <Image
              src={logo}
              alt="Logo" 
              className="hidden md:block absolute top-5 right-5 max-w-[150px] h-auto"
            />
            
            <h1 className="text-4xl font-semibold font-Inter mb-8 text-center">Ready, Set, Quiz!</h1>
            <p className="text-md font-Inter mb-8 text-center text-[#888990]">Log in to unlock a world of questions and challenges!</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="p-6 w-full">
              <div className="mb-8">
                <input 
                  type="email" 
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email" 
                  className="w-full p-3 bg-[#292732] focus:outline-none focus:border-gray-600 transition-colors rounded-sm"
                  required
                />
              </div>

              <div className="mb-8 relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Your Password" 
                  className="w-full p-3 bg-[#292732] focus:outline-none focus:border-gray-600 transition-colors rounded-sm pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#888990] hover:text-[#F7CA21] focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              <div className="text-center w-full mt-8">
                <button 
                  className="w-full bg-[#F7CA21] py-3 px-4 rounded-sm text-black font-bold 
                         hover:bg-[#fce280] transition-colors duration-300 ease-in-out"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                </button>
              </div>
            </form>

            <p className="text-md font-Inter mb-8 text-center text-[#888990]">
              Don't have an account?{' '}
              <button
                onClick={handleSignupRedirect}
                className="text-[#F7CA21] hover:text-[#fce280] cursor-pointer"
              >
                Signup here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}