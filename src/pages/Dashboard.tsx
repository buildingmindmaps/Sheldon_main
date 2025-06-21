import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Define the Dashboard component
const Dashboard: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const navigate = useNavigate();

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set user's display name
        if (user.displayName) {
          setDisplayName(user.displayName);
        } else if (user.email) {
          // Use email as fallback and extract first part before @
          const emailName = user.email.split('@')[0];
          setDisplayName(emailName);
        }

        // Set user's email
        if (user.email) {
          setUserEmail(user.email);
        }

        // Set user's join date
        if (user.metadata && user.metadata.creationTime) {
          const date = new Date(user.metadata.creationTime);
          setJoinDate(date.toLocaleDateString());
        }
      } else {
        // If no user is logged in, redirect to home page
        navigate('/');
      }
    });
    return unsubscribe;
  }, [navigate]);

  // Dummy data for solved modules
  const solvedModules = [
    { name: 'Module Name', time: '1 Hour Ago' },
    { name: 'Module Name', time: '1 Week Ago' },
    { name: 'Module Name', time: '2 Week Ago' },
    { name: 'Module Name', time: '2 Week Ago' },
  ];

  return (
    <>
      {/* Add the NavBar component at the top */}
      <NavBar />

      {/* Add padding to the top to ensure content is below the navbar */}
      <div className="min-h-screen bg-gray-100 font-sans flex flex-col items-center pt-24 px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-md space-y-6">
            {/* User Profile */}
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src="https://placehold.co/80x80/f0f0f0/333333?text=Profile"
                  alt="User Profile"
                  className="rounded-full object-cover border-2 border-gray-200"
                />
                <AvatarFallback className="w-20 h-20 text-2xl">{displayName ? displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
                <p className="text-gray-600">{displayName}</p>
                <p className="text-gray-500 text-sm">Joined: {joinDate || 'N/A'}</p>
              </div>
            </div>

            {/* Statistics Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
              <div className="space-y-4">
                {/* Global Rank */}
                <div className="flex items-center bg-gray-50 hover:bg-lime-100 hover:border hover:border-lime-300 p-4 rounded-lg shadow-sm transition-colors duration-200">
                  <span className="text-yellow-500 text-2xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8a1 1 0 00-2 0v2a1 1 0 002 0v-2zm4-2a1 1 0 00-2 0v4a1 1 0 002 0V8z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">100</p>
                    <p className="text-gray-600">Global Rank</p>
                  </div>
                </div>
                {/* Day Streak */}
                <div className="flex items-center bg-gray-50 hover:bg-lime-100 hover:border hover:border-lime-300 p-4 rounded-lg shadow-sm transition-colors duration-200">
                  <span className="text-orange-500 text-2xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.72 10.02a.75.75 0 00-1.22-.72 9.001 9.001 0 01-14.77 0 .75.75 0 10-1.22.72A10.502 10.502 0 0010 19.5c5.38 0 9.873-4.04 10.453-9.155a.75.75 0 00-.733-.325z" />
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v4a1 1 0 11-2 0V4a1 1 0 011-1zM5 10a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1zM15 10a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-gray-600">Day Streak</p>
                  </div>
                </div>
                {/* Total XP */}
                <div className="flex items-center bg-gray-50 hover:bg-lime-100 hover:border hover:border-lime-300 p-4 rounded-lg shadow-sm transition-colors duration-200">
                  <span className="text-purple-500 text-2xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">30</p>
                    <p className="text-gray-600">Total XP</p>
                  </div>
                </div>
                {/* Total Module */}
                <div className="flex items-center bg-gray-50 hover:bg-lime-100 hover:border hover:border-lime-300 p-4 rounded-lg shadow-sm transition-colors duration-200">
                  <span className="text-blue-500 text-2xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v6a2 2 0 002 2l2 2v-2h4a2 2 0 002-2V6a2 2 0 00-2-2H4z" />
                      <path d="M15.586 10.414A2 2 0 0117 12v2.586l2.293 2.293A1 1 0 0020 17v-3a2 2 0 00-2-2h-3.414z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-gray-600">Total Module</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="w-full lg:w-2/3 bg-white p-6 rounded-xl shadow-md">
            {/* Solved Modules Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Solved Modules</h3>
                <button className="text-blue-600 text-sm hover:underline">Get Detailed Report</button>
              </div>
              <div className="space-y-3">
                {solvedModules.map((module, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 hover:bg-lime-100 hover:border hover:border-lime-300 p-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    <span className="font-medium text-gray-700">{module.name}</span>
                    <span className="text-gray-500 text-sm">{module.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
