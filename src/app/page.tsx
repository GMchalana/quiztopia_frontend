'use client';
import { useRouter } from 'next/navigation';
import login from '../assets/signup.png';
import Image from 'next/image';
import logo from '../assets/logo.png';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Do login logic
    router.push('/signup'); // Example navigation
  };

  return (

<div className="h-screen flex flex-col bg-[#181820]">

  <div className="flex-1 flex flex-col md:flex-row relative">
  
    <div className="md:hidden w-full flex flex-col items-center p-6">
      
      <Image
          src={logo}
          alt="Logo" 
           className="w-32 h-auto mb-6"
        />
    </div>

   
    <div className="hidden md:block md:w-1/2 relative">
      


      <Image
          src={login}
          alt="Login background"
          layout="fill"
          className="absolute inset-0 w-full h-full object-cover"
        />
       
    </div>

    
    <div className="w-full md:w-1/2 flex flex-col items-center overflow-y-auto bg-[#181820] pt-20">
      <div className="bg-[#181820] w-full max-w-lg px-1 md:px-1 pt-10 md:py-28">
        

        <Image
          src={logo}
          alt="Logo" 
           className="hidden md:block absolute top-5 right-5 max-w-[150px] h-auto"
        />
        
        <h1 className="text-4xl font-semibold font-Inter mb-8 text-center">Ready, Set, Quiz!</h1>
        <p className="text-md font-Inter mb-8 text-center text-[#888990]">Log in to unlock a world of questions and challenges!</p>
        
        <div className="p-6 w-full">
         
          <div className="mb-8">
            <input 
              type="email" 
             
              id="email" 
              placeholder="Your Email" 
              className="w-full p-3 bg-[#292732] focus:outline-none focus:border-gray-600 transition-colors rounded-sm"
             
            />
          </div>

         
          <div className="mb-8 relative">
            <input 
              id="password" 
              placeholder="Your Password" 
              className="w-full p-3 bg-[#292732] focus:outline-none focus:border-gray-600 transition-colors rounded-sm"
              
            />
            <i 
             
             className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
             
            >
            </i>
          </div>

        
          <div className="text-center w-full mt-8">
            <button 
              className="w-full bg-[#F7CA21] py-3 px-4 rounded-sm text-black font-bold 
                     hover:bg-[#fce280] transition-colors duration-300 ease-in-out"
              type="button" 
            
            >
              Log in
            </button>
          </div>
        </div>
        <p className="text-md font-Inter mb-8 text-center text-[#888990]">
              Don’t have an account?{' '}
              <button
                onClick={handleLogin} // Trigger handleLogin on click
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
