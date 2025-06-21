import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/lib/AuthContext';

// Define the Dashboard component
const Dashboard: React.FC = () => {
  const { user, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  // Fetch fresh user data when component mounts
  useEffect(() => {
    if (user) {
      fetchUserProfile().catch(err => console.error("Failed to refresh user data:", err));
    }
  }, []);

  // If user isn't loaded, show loading state (this should be handled by ProtectedRoute)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Format user's join date
  const formattedJoinDate = user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : 'N/A';

  // Dummy data for solved modules (can be replaced with actual data from user.modulesCompleted)
  const solvedModules = user.modulesCompleted?.length > 0
    ? user.modulesCompleted.map(module => ({
        name: module.moduleId,
        time: new Date(module.completedAt).toLocaleDateString()
      }))
    : [
        { name: 'No modules completed yet', time: '' }
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
                <AvatarFallback className="w-20 h-20 text-2xl">{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
                <p className="text-gray-600">{user.username}</p>
                <p className="text-gray-500 text-sm">Joined: {formattedJoinDate}</p>
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
                    <p className="text-2xl font-bold text-gray-900">7</p>
                    <p className="text-gray-600">Day Streak</p>
                  </div>
                </div>
                {/* Experience Points */}
                <div className="flex items-center bg-gray-50 hover:bg-lime-100 hover:border hover:border-lime-300 p-4 rounded-lg shadow-sm transition-colors duration-200">
                  <span className="text-purple-500 text-2xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3.433 17.32l.707-.707-1.414-1.414-.707.707 1.414 1.414zm3.433-12.961l-.707.707 1.414 1.414.707-.707-1.414-1.414zm-7.416 5.178l10.416-10.416 7.778 7.778-10.417 10.416-7.777-7.778zm13.854-9.708l2.122 2.122-2.121 2.121-2.121-2.121 2.12-2.122zm-4.95-2.121l2.122 2.122-2.121 2.121-2.121-2.121 2.12-2.122zm2.828 15.85l2.122 2.121-2.121 2.121-2.121-2.121 2.12-2.121zm-8.484 2.121l2.121 2.121-2.12 2.121-2.122-2.121 2.121-2.121zM16.434 7.05L17.84 5.636l1.414 1.414-1.414 1.414-1.414-1.414z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{user.experiencePoints || 0}</p>
                    <p className="text-gray-600">Experience Points</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs text-center mt-2">Beginner</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs text-center mt-2">Intermediate</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs text-center mt-2">Advanced</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content Area */}
          <main className="w-full lg:w-2/3 space-y-6">
            {/* Recent Activities */}
            <section className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {solvedModules.map((module, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-lime-100 hover:border hover:border-lime-300 transition-colors duration-200">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{module.name}</p>
                        {module.time && <p className="text-sm text-gray-500">Completed on {module.time}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended Modules */}
            <section className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended For You</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/all-courses/case-interview" className="block group">
                  <div className="border border-gray-200 rounded-lg overflow-hidden group-hover:border-blue-500 transition-colors duration-200">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <img
                        src="https://placehold.co/800x450/e0e0e0/333333?text=Case+Interview"
                        alt="Case Interview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Case Interview Basics</h4>
                      <p className="text-sm text-gray-500 mt-1">Learn the fundamentals of case interviews</p>
                    </div>
                  </div>
                </Link>
                <Link to="/all-courses/business-frameworks/swot-analysis" className="block group">
                  <div className="border border-gray-200 rounded-lg overflow-hidden group-hover:border-blue-500 transition-colors duration-200">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <img
                        src="https://placehold.co/800x450/e0e0e0/333333?text=SWOT+Analysis"
                        alt="SWOT Analysis"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">SWOT Analysis</h4>
                      <p className="text-sm text-gray-500 mt-1">Master the SWOT framework for business analysis</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="text-blue-600" asChild>
                  <Link to="/all-courses">View All Courses</Link>
                </Button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
