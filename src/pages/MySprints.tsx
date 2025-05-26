
import React, { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ArrowLeft, ArrowRight, Clock, X, ChevronUp, Mic, Video, Camera } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function MySprints() {
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'course-detail', 'interview'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [openLessons, setOpenLessons] = useState<{ [key: number]: boolean }>({ 0: true });

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

  const toggleLesson = (lessonIndex: number) => {
    setOpenLessons(prev => ({
      ...prev,
      [lessonIndex]: !prev[lessonIndex]
    }));
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
        
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left side - Video/Interview area */}
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
              {/* Video area */}
              <div className="flex-1 bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
                <img 
                  src="/lovable-uploads/f99d3dc7-4f29-4b86-a075-8c115e0529b3.png" 
                  alt="AI Consultant" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <Mic className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between p-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    <span className="text-sm">Microphone Selector</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <span className="text-sm">Speaker Selector</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    <span className="text-sm">Camera Selector</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              {/* About section */}
              <div className="p-4 border-t">
                <h3 className="font-medium mb-2">About this interview</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex justify-between items-center p-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold">300</div>
                  <div className="text-sm text-gray-600">Sessions Completed</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[1,2,3,4].map((star) => (
                      <span key={star} className="text-yellow-400 text-lg">★</span>
                    ))}
                    <span className="text-gray-300 text-lg">★</span>
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">Consultant Sprint AI</div>
                  <div className="text-sm text-gray-600">Hosted by</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Ready to join */}
          <div className="w-80 p-6">
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
              <h2 className="text-xl font-semibold mb-6">Ready to join?</h2>
              
              <div className="w-16 h-12 bg-gray-200 rounded mb-4"></div>
              
              <p className="text-sm text-gray-600 mb-6">Waiting for Consultant AI...</p>
              
              <Button className="w-full bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium py-3 rounded-lg mb-4">
                Start Interview
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                Consultant Sprint uses generative AI to simulate realistic case interviews
              </p>
            </div>
          </div>
        </div>
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
                <h1 className="text-4xl font-normal text-[#a3e635] mb-3">
                  Level Up Your Thinking, One Sprint at a Time.
                </h1>
                <p className="text-lg text-gray-600 font-normal">
                  Daily case drills and expert playbooks to build elite consulting skills.
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

            {/* Course Detail Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Course Info */}
              <div>
                <Card className="border-2 border-[#a3e635] bg-white mb-6">
                  <CardHeader className="pb-4 pt-6 px-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{selectedCourseData.icon}</div>
                      <Badge className="bg-[#a3e635]/20 text-[#65a30d] hover:bg-[#a3e635]/30">
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
                <div className="space-y-2">
                  {selectedCourseData.lessons.map((lesson, index) => (
                    <Collapsible 
                      key={index} 
                      open={openLessons[index]} 
                      onOpenChange={() => toggleLesson(index)}
                    >
                      <Card className="bg-white border border-gray-200">
                        <CollapsibleTrigger asChild>
                          <CardHeader className="pb-4 cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg font-medium">{lesson.title}</CardTitle>
                              {openLessons[index] ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          {lesson.sections.length > 0 && (
                            <div className="px-6 pb-4 space-y-2">
                              {lesson.sections.map((section, sectionIndex) => (
                                <p key={sectionIndex} className="text-gray-600 text-sm pl-4">
                                  {section}
                                </p>
                              ))}
                            </div>
                          )}
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
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
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="w-16 h-8 bg-gradient-to-r from-[#a3e635] to-[#84cc16] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 w-12 h-6 bg-[#a3e635] rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="relative">
                    <div className="w-16 h-8 bg-gradient-to-r from-[#a3e635] to-[#84cc16] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 w-10 h-5 bg-[#a3e635] rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xs">✓</span>
                    </div>
                  </div>

                  {/* Step 3 - Current */}
                  <div className="relative">
                    <div className="w-20 h-12 bg-gradient-to-r from-[#a3e635] to-[#84cc16] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <span className="text-black font-bold text-2xl">3</span>
                    </div>
                    <div className="absolute -right-24 top-1/2 transform -translate-y-1/2 w-16 h-8 bg-gradient-to-r from-[#a3e635] to-[#84cc16] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-black font-bold">3</span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className="w-16 h-8 bg-gradient-to-r from-[#a3e635] to-[#84cc16] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-black font-bold text-xl">4</span>
                    </div>
                    <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 w-10 h-5 bg-[#a3e635] rounded-full flex items-center justify-center shadow-md">
                      <span className="text-black font-bold text-xs">4</span>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="relative">
                    <div className="w-12 h-6 bg-gradient-to-r from-[#a3e635] to-[#84cc16] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-black font-bold text-sm">5</span>
                    </div>
                  </div>

                  {/* Arrow down */}
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="rounded-full border-2 border-[#a3e635] bg-white hover:bg-[#a3e635]/10 p-3"
                  >
                    <ArrowLeft className="h-5 w-5 text-[#a3e635] rotate-90" />
                  </Button>
                </div>

                <Card className="bg-[#a3e635]/10 border-[#a3e635]/30 p-6 w-full max-w-sm text-center">
                  <h4 className="font-medium text-gray-800 mb-2">Interactive Drill / Activity</h4>
                  <p className="text-gray-600 text-sm mb-6">Reinforce learning through engagement</p>
                  <Button 
                    className="w-full bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium py-3 rounded-lg"
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
              <h1 className="text-4xl font-normal text-[#a3e635] mb-3">
                Level Up Your Thinking, One Sprint at a Time.
              </h1>
              <p className="text-lg text-gray-600 font-normal">
                Daily case drills and expert playbooks to build elite consulting skills.
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
                      selectedCourse === course.id ? 'ring-2 ring-[#a3e635]' : ''
                    }`}
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <CardHeader className="pb-4 pt-6 px-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-3xl">{course.icon}</div>
                        <Badge 
                          className={`text-xs font-medium px-3 py-1 ${
                            course.badge === 'Popular' 
                              ? 'bg-[#a3e635]/20 text-[#65a30d] hover:bg-[#a3e635]/30' 
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
              <Card className={`h-fit bg-[#a3e635]/10 border-[#a3e635]/30 relative transition-all duration-300 ${
                isTransitioning ? 'opacity-50 transform translate-x-2' : 'opacity-100 transform translate-x-0'
              }`}>
                <CardHeader className="text-center pb-6 pt-8 px-8">
                  <div className="flex justify-end mb-6">
                    <Badge 
                      className={`text-xs font-medium px-3 py-1 ${
                        selectedCourseData.badge === 'Popular' 
                          ? 'bg-[#a3e635]/20 text-[#65a30d]' 
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
                      className="rounded-full border-2 border-[#a3e635] bg-white hover:bg-[#a3e635]/10 p-3"
                      onClick={handlePrevious}
                    >
                      <ArrowLeft className="h-5 w-5 text-[#a3e635]" />
                    </Button>
                    <Button 
                      className="rounded-full bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium p-3"
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
                    className="w-full bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium py-4 rounded-lg text-lg"
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
