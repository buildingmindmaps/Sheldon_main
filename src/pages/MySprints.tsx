
import React, { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

export default function MySprints() {
  const [selectedCourse, setSelectedCourse] = useState(1);

  const courses = [
    {
      id: 1,
      title: "Financial Modeling Fundamentals",
      description: "Master the numbers behind every good deal.",
      level: "Beginner",
      hours: "5 hours",
      badge: "New",
      icon: "📊",
      isNew: true
    },
    {
      id: 2,
      title: "Think Like a McKinsey Partner",
      description: "Learn to break down market entry decisions.",
      level: "Beginner",
      hours: "5 hours",
      badge: "Popular",
      icon: "💡",
      isNew: false
    }
  ];

  const selectedCourseDetails = {
    title: "Think Like a McKinsey Partner",
    description: "Learn to break down market entry decisions.",
    detailedDescription: "Analyze opportunities, barriers, and go-to-market strategies across industries and geographies.",
    chapters: "5 Chapters",
    level: "Beginner to Advanced",
    cases: "20+ interactive cases",
    features: "Framework walkthroughs, real-time scoring, bonus sector deep-dives",
    icon: "💡"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-normal text-green-600 mb-3">
                Level Up Your Thinking, One Sprint at a Time.
              </h1>
              <p className="text-lg text-gray-600 font-normal">
                Daily case drills and expert playbooks to build elite consulting skills.
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <Button variant="outline" className="rounded-full border-2 border-green-500 text-black hover:bg-green-50 px-5 py-2 bg-white font-medium">
                <span className="mr-2 text-yellow-500 text-lg">⚡</span>
                1
              </Button>
              <Button className="rounded-lg bg-green-400 hover:bg-green-500 text-black font-medium px-8 py-2 border-2 border-green-400">
                Start Free Trial
              </Button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Sidebar - Course List */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <Button variant="outline" className="w-fit px-4 py-2 text-sm border-gray-300 bg-white">
                  All Courses
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {courses.map((course, index) => (
                  <Card 
                    key={course.id} 
                    className={`cursor-pointer transition-all hover:shadow-md relative bg-white border border-gray-200 ${
                      selectedCourse === course.id ? 'ring-2 ring-green-400' : ''
                    }`}
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <CardHeader className="pb-4 pt-6 px-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-3xl">{course.icon}</div>
                        <Badge 
                          variant={course.badge === 'Popular' ? 'secondary' : 'default'}
                          className={`text-xs font-medium px-3 py-1 ${
                            course.badge === 'Popular' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {course.badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-medium text-gray-800 leading-tight mb-3">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-base mb-4">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 px-6 pb-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{course.level}</span>
                        <span>•</span>
                        <span>{course.hours}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Content - Course Details */}
            <div className="lg:col-span-3">
              <Card className="h-fit bg-green-50 border-green-200 relative">
                <CardHeader className="text-center pb-6 pt-8 px-8">
                  <div className="flex justify-end mb-6">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1">
                      Popular
                    </Badge>
                  </div>
                  <div className="text-7xl mb-6">{selectedCourseDetails.icon}</div>
                  <CardTitle className="text-3xl font-medium text-gray-800 mb-4">
                    {selectedCourseDetails.title}
                  </CardTitle>
                  <CardDescription className="text-xl text-gray-700 mb-6 font-normal">
                    {selectedCourseDetails.description}
                  </CardDescription>
                  <p className="text-gray-600 mb-8 text-base leading-relaxed">
                    {selectedCourseDetails.detailedDescription}
                  </p>
                  
                  <div className="flex justify-between items-center mb-8">
                    <Button variant="outline" className="rounded-full border-2 border-green-500 bg-white hover:bg-green-50 p-3">
                      <ArrowLeft className="h-5 w-5 text-green-600" />
                    </Button>
                    <Button className="rounded-full bg-green-400 hover:bg-green-500 text-black font-medium p-3">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="text-center px-8 pb-8">
                  <div className="grid grid-cols-3 gap-8 text-base text-gray-700 mb-8">
                    <div>
                      <div className="font-medium text-gray-800">{selectedCourseDetails.chapters}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{selectedCourseDetails.level}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{selectedCourseDetails.cases}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-10 text-base leading-relaxed">
                    {selectedCourseDetails.features}
                  </p>
                  
                  <Button className="w-full bg-green-400 hover:bg-green-500 text-black font-medium py-4 rounded-lg text-lg">
                    Start Sprint
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
