
import React, { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ArrowLeft, ArrowRight, Clock, X } from 'lucide-react';
import { InterviewScreen } from '@/components/InterviewScreen';

export default function MySprints() {
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'course-detail', 'interview'
  const [isTransitioning, setIsTransitioning] = useState(false);

  const courses = [
    {
      id: 0,
      title: "Case Sprint: Market Entry",
      description: "Learn to break down market entry decisions.",
      level: "Beginner",
      hours: "5 hours",
      badge: "Popular",
      icon: "📊",
      detailedDescription: "Analyze opportunities, barriers, and go-to-market strategies across industries and geographies.",
      chapters: "5 Chapters",
      levelDetail: "Beginner to Advanced",
      cases: "20+ interactive cases",
      features: "Framework walkthroughs, real-time scoring, bonus sector deep-dives",
      lessons: [
        {
          title: "Lesson 1: What You'll Learn",
          sections: [
            "Concept Introduction",
            "Real-World Example", 
            "Interactive Drill / Activity",
            "Mini-Case Sprint",
            "Reflection & Summary"
          ]
        },
        {
          title: "Lesson 2: Course Structure",
          sections: []
        },
        {
          title: "Lesson 3: Course Tools & Resources", 
          sections: []
        },
        {
          title: "Lesson 4: Sample Case Preview",
          sections: []
        },
        {
          title: "Lesson 5: Reviews & Success Stories",
          sections: []
        }
      ]
    },
    {
      id: 1,
      title: "Financial Modeling Fundamentals",
      description: "Master the numbers behind every good deal.",
      level: "Beginner",
      hours: "5 hours",
      badge: "New",
      icon: "💰",
      detailedDescription: "Build comprehensive financial models and understand valuation techniques used in consulting.",
      chapters: "6 Chapters",
      levelDetail: "Beginner to Intermediate",
      cases: "15+ modeling exercises",
      features: "Excel templates, video tutorials, peer collaboration",
      lessons: [
        {
          title: "Lesson 1: Financial Foundations",
          sections: [
            "Basic Concepts",
            "Excel Setup",
            "Practice Exercise"
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Think Like a McKinsey Partner",
      description: "Learn strategic thinking frameworks.",
      level: "Advanced",
      hours: "8 hours", 
      badge: "Popular",
      icon: "🧠",
      detailedDescription: "Master the thought processes and frameworks used by top-tier consulting partners.",
      chapters: "7 Chapters",
      levelDetail: "Advanced",
      cases: "10+ partner-level cases",
      features: "Partner interviews, case walkthroughs, strategy templates",
      lessons: [
        {
          title: "Lesson 1: Partner Mindset",
          sections: [
            "Strategic Thinking",
            "Client Management",
            "Team Leadership"
          ]
        }
      ]
    }
  ];

  const handlePrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedCourse((prev) => (prev > 0 ? prev - 1 : courses.length - 1));
      setIsTransitioning(false);
    }, 150);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedCourse((prev) => (prev < courses.length - 1 ? prev + 1 : 0));
      setIsTransitioning(false);
    }, 150);
  };

  const handleStartSprint = () => {
    if (currentPage === 'main') {
      setCurrentPage('course-detail');
    } else if (currentPage === 'course-detail') {
      setCurrentPage('interview');
    }
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
  };

  const selectedCourseData = courses[selectedCourse];

  if (currentPage === 'interview') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Sprint 1:</span>
            <span className="font-medium">System Thinking</span>
            <span className="text-gray-500 text-sm">Live 1-on-1 (AI Coach)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>20 min</span>
            </div>
            <Button 
              variant="outline" 
              className="border-gray-300"
              onClick={handleBackToMain}
            >
              Cancel Interview
            </Button>
          </div>
        </div>
        <InterviewScreen />
      </div>
    );
  }

  if (currentPage === 'course-detail') {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-12 flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-normal text-[#84cc16] mb-3">
                  Level Up Your Thinking, One Sprint at a Time.
                </h1>
                <p className="text-lg text-gray-600 font-normal">
                  Daily case drills and expert playbooks to build elite consulting skills.
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <Button variant="outline" className="rounded-full border-2 border-[#84cc16] text-black hover:bg-[#84cc16]/10 px-5 py-2 bg-white font-medium">
                  <span className="mr-2 text-yellow-500 text-lg">⚡</span>
                  1
                </Button>
                <Button className="rounded-lg bg-[#84cc16] hover:bg-[#65a30d] text-black font-medium px-8 py-2 border-2 border-[#84cc16]">
                  Start Free Trial
                </Button>
              </div>
            </div>

            {/* Course Detail Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Course Info */}
              <div>
                <Card className="border-2 border-[#84cc16] bg-white">
                  <CardHeader className="pb-4 pt-6 px-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{selectedCourseData.icon}</div>
                      <Badge className="bg-[#84cc16]/20 text-[#65a30d] hover:bg-[#84cc16]/30">
                        {selectedCourseData.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-medium text-gray-800 leading-tight mb-3">
                      {selectedCourseData.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base mb-4">
                      {selectedCourseData.description}
                    </CardDescription>
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                      {selectedCourseData.detailedDescription}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <span>{selectedCourseData.level}</span>
                      <span>•</span>
                      <span>{selectedCourseData.hours}</span>
                    </div>
                  </CardHeader>
                </Card>

                {/* Lessons Section */}
                <div className="mt-6 space-y-4">
                  {selectedCourseData.lessons.map((lesson, index) => (
                    <Card key={index} className="bg-white border border-gray-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-medium">{lesson.title}</CardTitle>
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>
                        {lesson.sections.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {lesson.sections.map((section, sectionIndex) => (
                              <p key={sectionIndex} className="text-gray-600 text-sm pl-4">
                                {section}
                              </p>
                            ))}
                          </div>
                        )}
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Right Side - Learning Path Visual */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-right mb-8">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Lesson 1:</h3>
                  <p className="text-gray-600">What You'll Learn</p>
                </div>

                {/* Visual Learning Steps */}
                <div className="relative flex flex-col items-center space-y-6 mb-8">
                  {/* Step indicators with green gradient platforms */}
                  <div className="relative">
                    <div className="w-16 h-8 bg-gradient-to-r from-[#84cc16] to-[#65a30d] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-16 h-8 bg-gradient-to-r from-[#84cc16] to-[#65a30d] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-20 h-12 bg-gradient-to-r from-[#84cc16] to-[#65a30d] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">3</span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-16 h-8 bg-gradient-to-r from-[#a3e635] to-[#84cc16] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">4</span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-12 h-6 bg-gradient-to-r from-[#a3e635] to-[#84cc16] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">5</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="icon"
                    className="rounded-full border-2 border-[#84cc16] bg-white hover:bg-[#84cc16]/10 p-3"
                  >
                    <ArrowLeft className="h-5 w-5 text-[#84cc16] rotate-90" />
                  </Button>
                </div>

                <Card className="bg-[#84cc16]/10 border-[#84cc16]/30 p-6 w-full max-w-sm text-center">
                  <h4 className="font-medium text-gray-800 mb-2">Interactive Drill / Activity</h4>
                  <p className="text-gray-600 text-sm mb-6">Reinforce learning through engagement</p>
                  <Button 
                    className="w-full bg-[#84cc16] hover:bg-[#65a30d] text-black font-medium py-3 rounded-lg"
                    onClick={handleStartSprint}
                  >
                    Start Sprint
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-normal text-[#84cc16] mb-3">
                Level Up Your Thinking, One Sprint at a Time.
              </h1>
              <p className="text-lg text-gray-600 font-normal">
                Daily case drills and expert playbooks to build elite consulting skills.
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <Button variant="outline" className="rounded-full border-2 border-[#84cc16] text-black hover:bg-[#84cc16]/10 px-5 py-2 bg-white font-medium">
                <span className="mr-2 text-yellow-500 text-lg">⚡</span>
                1
              </Button>
              <Button className="rounded-lg bg-[#84cc16] hover:bg-[#65a30d] text-black font-medium px-8 py-2 border-2 border-[#84cc16]">
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
                      selectedCourse === course.id ? 'ring-2 ring-[#84cc16]' : ''
                    }`}
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <CardHeader className="pb-4 pt-6 px-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-3xl">{course.icon}</div>
                        <Badge 
                          className={`text-xs font-medium px-3 py-1 ${
                            course.badge === 'Popular' 
                              ? 'bg-[#84cc16]/20 text-[#65a30d] hover:bg-[#84cc16]/30' 
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
              <Card className={`h-fit bg-[#84cc16]/10 border-[#84cc16]/30 relative transition-all duration-300 ${
                isTransitioning ? 'opacity-50 transform translate-x-2' : 'opacity-100 transform translate-x-0'
              }`}>
                <CardHeader className="text-center pb-6 pt-8 px-8">
                  <div className="flex justify-end mb-6">
                    <Badge 
                      className={`text-xs font-medium px-3 py-1 ${
                        selectedCourseData.badge === 'Popular' 
                          ? 'bg-[#84cc16]/20 text-[#65a30d]' 
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {selectedCourseData.badge}
                    </Badge>
                  </div>
                  <div className="text-7xl mb-6">{selectedCourseData.icon}</div>
                  <CardTitle className="text-3xl font-medium text-gray-800 mb-4">
                    {selectedCourseData.title}
                  </CardTitle>
                  <CardDescription className="text-xl text-gray-700 mb-6 font-normal">
                    {selectedCourseData.description}
                  </CardDescription>
                  <p className="text-gray-600 mb-8 text-base leading-relaxed">
                    {selectedCourseData.detailedDescription}
                  </p>
                  
                  <div className="flex justify-between items-center mb-8">
                    <Button 
                      variant="outline" 
                      className="rounded-full border-2 border-[#84cc16] bg-white hover:bg-[#84cc16]/10 p-3"
                      onClick={handlePrevious}
                    >
                      <ArrowLeft className="h-5 w-5 text-[#84cc16]" />
                    </Button>
                    <Button 
                      className="rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-black font-medium p-3"
                      onClick={handleNext}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="text-center px-8 pb-8">
                  <div className="grid grid-cols-3 gap-8 text-base text-gray-700 mb-8">
                    <div>
                      <div className="font-medium text-gray-800">{selectedCourseData.chapters}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{selectedCourseData.levelDetail}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{selectedCourseData.cases}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-10 text-base leading-relaxed">
                    {selectedCourseData.features}
                  </p>
                  
                  <Button 
                    className="w-full bg-[#84cc16] hover:bg-[#65a30d] text-black font-medium py-4 rounded-lg text-lg"
                    onClick={handleStartSprint}
                  >
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
