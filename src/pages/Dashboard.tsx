import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/lib/AuthContext';
// Font Awesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faFire,
  faStar,
  faCheck,
  faTrophy,
  faGraduationCap,
  faBookOpen,
  faUserCircle,
  faCalendarAlt,
  faChartLine,
  faMedal,
  faAward
} from '@fortawesome/free-solid-svg-icons';

// Add icons to the library
library.add(
  faCircleInfo,
  faFire,
  faStar,
  faCheck,
  faTrophy,
  faGraduationCap,
  faBookOpen,
  faUserCircle,
  faCalendarAlt,
  faChartLine,
  faMedal,
  faAward
);

// Define the Dashboard component
const Dashboard: React.FC = () => {
  const { user, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  // Debug log to check user and avatar data
  useEffect(() => {
    if (user) {
      console.log("Dashboard - Current user:", user);
      console.log("Dashboard - Avatar URL:", user.avatar);
    }
  }, [user]);

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
              <Avatar className="w-24 h-24">
                {user.avatar ? (
                  <AvatarImage
                    src={user.avatar.replace('=s96-c', '=s400-c')}
                    referrerPolicy="no-referrer"
                    alt={user.username || "User Profile"}
                    className="rounded-full h-24 w-24 object-cover border-2 border-gray-200"
                    onError={(e) => {
                      console.log("Dashboard avatar image failed to load:", e.currentTarget.src);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <AvatarFallback className="w-24 h-24 text-3xl">{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
                <p className="text-gray-600">{user.username}</p>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <FontAwesomeIcon icon="calendar-alt" className="mr-2" />
                  Joined: {formattedJoinDate}
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
              <div className="space-y-4">
                {/* Global Rank */}
                <div className="flex items-center bg-gray-50 hover:bg-lime-100 hover:border hover:border-lime-300 p-4 rounded-lg shadow-sm transition-colors duration-200 cursor-pointer transform hover:scale-102 hover:-translate-y-1">
                  <span className="text-yellow-500 text-2xl mr-3">
                    <FontAwesomeIcon icon="medal" className="h-8 w-8" />
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">100</p>
                    <p className="text-gray-600">Global Rank</p>
                  </div>
                </div>

                {/* Day Streak */}
                <div className="flex items-center bg-gray-50 hover:bg-lime-100 hover:border hover:border-lime-300 p-4 rounded-lg shadow-sm transition-colors duration-200 cursor-pointer transform hover:scale-102 hover:-translate-y-1">
                  <span className="text-orange-500 text-2xl mr-3">
                    <FontAwesomeIcon icon="fire" className="h-8 w-8" />
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">7</p>
                    <p className="text-gray-600">Day Streak</p>
                  </div>
                </div>

                {/* Experience Points */}
                <div className="flex items-center bg-gray-50 hover:bg-lime-100 hover:border hover:border-lime-300 p-4 rounded-lg shadow-sm transition-colors duration-200 cursor-pointer transform hover:scale-102 hover:-translate-y-1">
                  <span className="text-purple-500 text-2xl mr-3">
                    <FontAwesomeIcon icon="star" className="h-8 w-8" />
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
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <FontAwesomeIcon icon="award" className="h-8 w-8 text-yellow-500" />
                  </div>
                  <p className="text-xs text-center mt-2">Beginner</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <FontAwesomeIcon icon="award" className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-xs text-center mt-2">Intermediate</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <FontAwesomeIcon icon="award" className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-xs text-center mt-2">Advanced</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content Area */}
          <main className="w-full lg:w-2/3 space-y-6">
            {/* Recent Activities */}
            <section className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FontAwesomeIcon icon="check" className="mr-2 text-green-600" />
                Recent Activities
              </h3>
              <div className="space-y-4">
                {solvedModules.map((module, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-lime-100 hover:border hover:border-lime-300 transition-all duration-200 cursor-pointer transform hover:scale-102"
                  >
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FontAwesomeIcon icon="check" className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{module.name}</p>
                        {module.time && (
                          <p className="text-sm text-gray-500 flex items-center">
                            <FontAwesomeIcon icon="calendar-alt" className="mr-1 text-xs" />
                            Completed on {module.time}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended Modules */}
            <section className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FontAwesomeIcon icon="graduation-cap" className="mr-2 text-blue-600" />
                Recommended For You
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/all-courses/case-interview" className="block group">
                  <div className="border border-gray-200 rounded-lg overflow-hidden group-hover:border-blue-500 transition-all duration-200 transform group-hover:scale-103 group-hover:-translate-y-1 shadow-sm group-hover:shadow-md">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                      <img
                        src="https://placehold.co/800x450/e0e0e0/333333?text=Case+Interview"
                        alt="Case Interview"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded-full flex items-center">
                        <FontAwesomeIcon icon="star" className="mr-1" />
                        Recommended
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Case Interview Basics</h4>
                      <p className="text-sm text-gray-500 mt-1">Learn the fundamentals of case interviews</p>
                      <div className="mt-2 flex items-center text-sm text-blue-500">
                        <span>Start learning</span>
                        <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to="/all-courses/business-frameworks/swot-analysis" className="block group">
                  <div className="border border-gray-200 rounded-lg overflow-hidden group-hover:border-blue-500 transition-all duration-200 transform group-hover:scale-103 group-hover:-translate-y-1 shadow-sm group-hover:shadow-md">
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
                      <div className="mt-2 flex items-center text-sm text-blue-500">
                        <span>Start learning</span>
                        <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="text-blue-600 hover:bg-blue-50 transition-all transform hover:scale-105" asChild>
                  <Link to="/all-courses" className="flex items-center">
                    <FontAwesomeIcon icon="book-open" className="mr-2" />
                    View All Courses
                  </Link>
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
