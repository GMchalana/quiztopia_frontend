'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import signup from '../../assets/login.webp';
import logo from '../../assets/logo.png';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Import eye icons from react-icons

export default function SignupPage() {
  const router = useRouter();
  const [userType, setUserType] = useState('Student');
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    role: 'Student' // Default role
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

  const handleUserTypeChange = (type : any) => {
    setUserType(type);
    setFormData(prev => ({
      ...prev,
      role: type
    }));
  };

  const handleSignup = async (e : any) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${baseUrl}/auth/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Signup successful
      router.push('/'); // Redirect to login page
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#181820]">
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Left side - Image (hidden on mobile) */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src={signup}
            alt="Signup background"
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
            
            <h1 className="text-4xl font-semibold font-Inter mb-8 text-center">Join the Quiz Revolution!</h1>
            <p className="text-md font-Inter mb-8 text-center text-[#888990]">Whether you're here to learn or to teach, your journey starts now!</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="p-6 w-full">
              <div className="flex justify-center space-x-4 mb-6">
                {['Instructor', 'Student'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`px-4 py-2 w-full rounded-md font-medium ${userType === type 
                      ? 'bg-[#181820] text-[#F7CA21] border border-[#F7CA21]' 
                      : 'bg-[#181820] text-[#78797D] border border-[#78797D] hover:bg-[#292732]'}`}
                    onClick={() => handleUserTypeChange(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              <div className="mb-8">
                <input 
                  type="text" 
                  id="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="Your User Name" 
                  className="w-full p-3 bg-[#292732] focus:outline-none focus:border-gray-600 transition-colors rounded-sm"
                  required
                />
              </div>
             
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

              {/* <div className="mb-8">
                <input 
                  type="password" 
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Your Password" 
                  className="w-full p-3 bg-[#292732] focus:outline-none focus:border-gray-600 transition-colors rounded-sm"
                  required
                  minLength={6}
                />
              </div> */}

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
                  {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </div>
            </form>

            <p className="text-md font-Inter mb-8 text-center text-[#888990]">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/')}
                className="text-[#F7CA21] hover:text-[#fce280] cursor-pointer"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}