
import React from 'react';
import { NavBar } from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star } from 'lucide-react';

export default function MySprints() {
  const courses = [
    {
      id: 1,
      title: "Product Management Sprint",
      description: "Learn the fundamentals of product management through hands-on exercises and real-world case studies.",
      duration: "4 weeks",
      participants: 156,
      rating: 4.8,
      level: "Beginner",
      image: "/lovable-uploads/365f4f40-afd0-40d0-8588-0b97fe4b4699.png",
      status: "Available"
    },
    {
      id: 2,
      title: "UX Design Fundamentals",
      description: "Master user experience design principles with practical projects and expert feedback.",
      duration: "6 weeks",
      participants: 203,
      rating: 4.9,
      level: "Intermediate",
      image: "/lovable-uploads/365f4f40-afd0-40d0-8588-0b97fe4b4699.png",
      status: "Available"
    },
    {
      id: 3,
      title: "Data Analytics Bootcamp",
      description: "Transform raw data into actionable insights using modern analytics tools and techniques.",
      duration: "8 weeks",
      participants: 89,
      rating: 4.7,
      level: "Advanced",
      image: "/lovable-uploads/365f4f40-afd0-40d0-8588-0b97fe4b4699.png",
      status: "Starting Soon"
    }
  ];

  const featuredCourse = {
    title: "Strategic Thinking Masterclass",
    description: "Develop strategic thinking skills used by top executives at Fortune 500 companies. Learn frameworks for decision-making, problem-solving, and long-term planning.",
    duration: "12 weeks",
    participants: 324,
    rating: 4.9,
    level: "Expert",
    image: "/lovable-uploads/365f4f40-afd0-40d0-8588-0b97fe4b4699.png",
    features: ["Live mentorship sessions", "Case study analysis", "Peer collaboration", "Certificate upon completion"]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Sprints</h1>
            <p className="text-lg text-gray-600">Accelerate your learning with intensive, focused learning experiences</p>
          </div>

          {/* Featured Course */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Sprint</h2>
            <Card className="overflow-hidden border-2 border-brand-green/20 bg-gradient-to-r from-white to-brand-green/5">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-brand-green/10 text-brand-green border-brand-green/20">
                        {featuredCourse.level}
                      </Badge>
                      <Badge variant="outline">Featured</Badge>
                    </div>
                    <CardTitle className="text-2xl mb-2">{featuredCourse.title}</CardTitle>
                    <CardDescription className="text-base">{featuredCourse.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-0 mb-6">
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredCourse.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {featuredCourse.participants} enrolled
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {featuredCourse.rating}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">What you'll get:</h4>
                      <ul className="grid grid-cols-2 gap-1">
                        {featuredCourse.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-brand-green rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-0">
                    <Button className="bg-brand-green hover:bg-brand-green/90 text-white px-8">
                      Enroll Now
                    </Button>
                  </CardFooter>
                </div>
                
                <div className="relative bg-gray-100">
                  <img 
                    src={featuredCourse.image} 
                    alt={featuredCourse.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Card>
          </section>

          {/* Course Grid */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Sprints</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={course.level === 'Beginner' ? 'secondary' : course.level === 'Intermediate' ? 'default' : 'destructive'}>
                        {course.level}
                      </Badge>
                      <Badge 
                        variant={course.status === 'Available' ? 'default' : 'secondary'}
                        className={course.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.participants}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      variant={course.status === 'Available' ? 'default' : 'secondary'}
                      className="w-full"
                      disabled={course.status !== 'Available'}
                    >
                      {course.status === 'Available' ? 'Start Sprint' : 'Coming Soon'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
