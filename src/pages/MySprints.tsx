
import React, { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from 'lucide-react';
import { CaseInterview } from '@/components/CaseInterview';

export default function MySprints() {
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'case-interview'

  const courses = [
    {
      id: 0,
      title: "Case Sprint: Market Entry",
      description: "Learn to break down market entry decisions.",
      icon: "🚀",
      detailedDescription: "Analyze opportunities, barriers, and go-to-market strategies across industries and geographies.",
      chapters: "5 Chapters",
      levelDetail: "Beginner to Advanced", 
      cases: "20+ interactive cases",
      scoring: "Real-time scoring",
      bonus: "Bonus sector deep-dives"
    },
    {
      id: 1,
      title: "Case Sprint: Market Entry",
      description: "Learn to break down market entry decisions.",
      icon: "🚀",
      detailedDescription: "Analyze opportunities, barriers, and go-to-market strategies across industries and geographies.",
      chapters: "5 Chapters",
      levelDetail: "Beginner to Advanced",
      cases: "20+ interactive cases", 
      scoring: "Real-time scoring",
      bonus: "Bonus sector deep-dives"
    },
    {
      id: 2,
      title: "Case Sprint: Market Entry", 
      description: "Learn to break down market entry decisions.",
      icon: "🚀",
      detailedDescription: "Analyze opportunities, barriers, and go-to-market strategies across industries and geographies.",
      chapters: "5 Chapters",
      levelDetail: "Beginner to Advanced",
      cases: "20+ interactive cases",
      scoring: "Real-time scoring", 
      bonus: "Bonus sector deep-dives"
    }
  ];

  const reviews = [
    {
      name: "Jane Cooper",
      avatar: "JC",
      rating: 5,
      review: "Analyze opportunities, barriers, and go-to-market strategies across industries and geographies."
    },
    {
      name: "Jane Cooper",
      avatar: "JC", 
      rating: 5,
      review: "Analyze opportunities, barriers, and go-to-market strategies across industries and geographies."
    },
    {
      name: "Jane Cooper",
      avatar: "JC",
      rating: 5, 
      review: "Analyze opportunities, barriers, and go-to-market strategies across industries and geographies."
    }
  ];

  const handleStartSprint = () => {
    setCurrentPage('case-interview');
  };

  const selectedCourseData = courses[selectedCourse];

  if (currentPage === 'case-interview') {
    return <CaseInterview onBack={() => setCurrentPage('main')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-normal text-[#a3e635] mb-3">
                Level Up Your Thinking, One Sprint at a Time.
              </h1>
              <p className="text-lg text-gray-600 font-normal">
                Daily case drills and expert playbooks to build business problem solving.
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <Button variant="outline" className="rounded-full border-2 border-[#a3e635] text-black hover:bg-[#a3e635]/10 px-5 py-2 bg-white font-medium">
                <span className="mr-2 text-yellow-500 text-lg">⚡</span>
                1
              </Button>
              <Button className="rounded-lg bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium px-8 py-2 border-2 border-[#a3e635]">
                Start Free Trial
              </Button>
            </div>
          </div>

          {/* Dynamic Case Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left: Case Details */}
            <div className="space-y-6">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl text-3xl mb-6">
                {selectedCourseData.icon}
              </div>
              
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                  {selectedCourseData.title}
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  {selectedCourseData.description}
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {selectedCourseData.detailedDescription}
                </p>
              </div>

              <Button 
                className="bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium py-4 px-8 rounded-lg text-lg"
                onClick={handleStartSprint}
              >
                Start Sprint
              </Button>

              {/* Features */}
              <div className="flex flex-wrap gap-4 pt-4">
                <span className="text-gray-700 font-medium">{selectedCourseData.chapters}</span>
                <span className="text-gray-700 font-medium">{selectedCourseData.levelDetail}</span>
                <span className="text-gray-700 font-medium">{selectedCourseData.cases}</span>
                <span className="text-gray-700 font-medium">{selectedCourseData.scoring}</span>
                <span className="text-gray-700 font-medium">{selectedCourseData.bonus}</span>
              </div>
            </div>

            {/* Right: Reviews */}
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <Card key={index} className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{review.name}</span>
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {review.review}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Similar Courses Section */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Similar Courses</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Generate 9 similar course cards */}
              {Array.from({ length: 9 }, (_, index) => (
                <Card 
                  key={index} 
                  className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCourse(index % courses.length)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl">
                        🚀
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Popular
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Case Sprint: Market Entry
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Learn to break down market entry decisions.
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Beginner</span>
                      <span>•</span>
                      <span>5 hours</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
