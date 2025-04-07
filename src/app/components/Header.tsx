'use client';

export default function Header() {
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Welcome Back!</h2>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-200">
            🔔
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <span className="ml-2">User</span>
          </div>
        </div>
      </div>
    </header>
  );
}