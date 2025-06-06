import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, ArrowLeft } from 'lucide-react';

// Data for sprints and courses
const coursesData = [
    {
        id: 0,
        title: "Case Studies",
        route: "/my-sprints/case-studies",
        description: "Learn to break down business problems with a structured approach that balances opportunity and risk.",
        badge: "Popular",
        icon: "📊",
        detailedDescription: "Master the frameworks needed to solve case studies effectively with a structured approach.",
        features: ["Water Purifier", "Market Entry", "XYZ"],
        reviews: [
            { name: "Michael P.", avatar: "/lovable-uploads/76f4be6a-81e8-4fbe-8887-b2ad23db2ef7.png", rating: 5, text: "This course completely changed how I approach market entry problems. The frameworks are easy to understand but powerful in practice." },
            { name: "Sarah J.", avatar: "/lovable-uploads/9a188d87-3e53-4529-ae53-669f373bf9b3.png", rating: 4, text: "Great balance of theory and practice. I feel much more confident tackling these types of cases now." }
        ]
    },
    {
        id: 1,
        title: "Courses",
        route: "/my-sprints/courses",
        description: "Master the Theory Knowledge for Business Case Studies.",
        badge: "New",
        icon: "💰",
        detailedDescription: "Build comprehensive business knowledge with our structured courses on various decision frameworks.",
        features: ["Platform Philosophy", "Operational Decision Frameworks", "Financial Decision Frameworks", "Organizational Decision Frameworks"],
        reviews: [
            { name: "Robert K.", avatar: "/lovable-uploads/2335f5ff-a207-43ef-ade7-cc465d82004b.png", rating: 5, text: "Excellent course for anyone looking to strengthen their business decision-making skills." }
        ]
    }
];

const caseStudiesData = [
    { id: 3, title: "Water Purifier", description: "Analyze market opportunity and entry strategy for a new water purification technology", level: "Intermediate", hours: "6 hours", badge: "", icon: "💧" },
    { id: 4, title: "Market Entry", description: "Evaluate expansion opportunities for a tech company entering emerging markets", level: "Beginner", hours: "4 hours", badge: "Popular", icon: "🚪" },
    { id: 5, title: "XYZ", description: "Solve complex business challenges with our comprehensive case methodology", level: "Advanced", hours: "7 hours", badge: "New", icon: "🧩" }
];

const courseOptionsData = [
    { id: 6, title: "Platform Philosophy", description: "Understand how platform business models create and capture value", level: "Intermediate", hours: "5 hours", badge: "Popular", icon: "🔄" },
    { id: 7, title: "Operational Frameworks", description: "Learn key frameworks for optimizing business operations", level: "Beginner", hours: "4 hours", badge: "", icon: "⚙️" },
    { id: 8, title: "Financial Frameworks", description: "Master financial decision-making models for business strategy", level: "Advanced", hours: "8 hours", badge: "New", icon: "💹" },
    { id: 9, title: "Organizational Frameworks", description: "Develop strategies for effective organizational design and management", level: "Intermediate", hours: "6 hours", badge: "", icon: "🏢" }
];

// Helper function to render stars
const renderStars = (rating: number) => (
    Array(5).fill(0).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))
);

// Main "/my-sprints" page
export default function MySprints() {
    const navigate = useNavigate();
    const [featuredSprint, setFeaturedSprint] = useState(0);
    const featuredSprintData = coursesData[featuredSprint];

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main className="pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Case Sprints</h1>
                        <p className="text-gray-600">Master consulting frameworks with interactive case challenges</p>
                    </div>
                    <Card className="bg-white border shadow-sm mb-10 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="md:col-span-2 p-6 md:p-8">
                                <div className="flex items-start mb-4">
                                    <div className="p-4 bg-gray-100 rounded-lg mr-4"><div className="text-4xl">{featuredSprintData.icon}</div></div>
                                    <div>
                                        <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100">{featuredSprintData.badge}</Badge>
                                        <h2 className="text-2xl font-bold mb-2">{featuredSprintData.title}</h2>
                                        <p className="text-gray-700 mb-4">{featuredSprintData.detailedDescription}</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {featuredSprintData.features.map((feature, idx) => <Badge key={idx} variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-full">{feature}</Badge>)}
                                        </div>
                                        <div className="mt-6">
                                            <Button className="bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium py-2 px-6 rounded-lg" onClick={() => navigate(featuredSprintData.route)}>
                                                Start Sprint
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 md:p-8 border-t md:border-t-0 md:border-l">
                                <h3 className="font-bold text-gray-800 mb-4">User Reviews</h3>
                                <div className="space-y-4">
                                    {featuredSprintData.reviews.slice(0, 2).map((review, idx) => (
                                        <div key={idx} className="border-b pb-4 last:border-0">
                                            <div className="flex items-center mb-2">
                                                <img src={review.avatar} alt={review.name} className="h-8 w-8 rounded-full object-cover mr-2" />
                                                <div>
                                                    <div className="font-semibold text-sm">{review.name}</div>
                                                    <div className="flex">{renderStars(review.rating)}</div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-600 line-clamp-3">{review.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                    <h2 className="text-xl font-bold mb-4">All Case Sprints</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {coursesData.map((course) => (
                            <Card
                                key={course.id}
                                className="bg-white border hover:shadow-md transition-shadow cursor-pointer"
                                onMouseEnter={() => setFeaturedSprint(course.id)}
                                onClick={() => navigate(course.route)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="p-3 bg-gray-100 rounded-lg"><span className="text-2xl">{course.icon}</span></div>
                                        {course.badge && <Badge className={course.badge === 'Popular' ? 'bg-[#a3e635]/20 text-[#65a30d]' : 'bg-blue-100 text-blue-700'}>{course.badge}</Badge>}
                                    </div>
                                    <CardTitle className="text-base font-semibold">{course.title}</CardTitle>
                                    <CardDescription className="text-sm line-clamp-2">{course.description}</CardDescription>
                                </CardHeader>
                                <CardFooter className="pt-3 pb-3">
                                    <div className="flex flex-wrap gap-2">
                                        {course.features.map((feature, idx) => <Badge key={idx} variant="outline" className="text-xs bg-gray-50 text-gray-700 hover:bg-gray-50">{feature}</Badge>)}
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

// Case Studies Page
export const CaseStudiesPage = () => {
    const navigate = useNavigate();
    const courseData = coursesData[0];

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main className="pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Button variant="outline" onClick={() => navigate('/my-sprints')} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Sprints
                    </Button>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card className="bg-white border mb-8">
                                <CardHeader>
                                    <div className="flex items-start">
                                        <div className="p-4 bg-gray-100 rounded-lg mr-4"><div className="text-4xl">{courseData.icon}</div></div>
                                        <div>
                                            <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100">{courseData.badge}</Badge>
                                            <CardTitle className="text-2xl font-bold mb-2">{courseData.title}</CardTitle>
                                            <CardDescription className="text-base text-gray-700 mb-4">{courseData.detailedDescription}</CardDescription>
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {courseData.features.map((feature, idx) => <Badge key={idx} variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-full">{feature}</Badge>)}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-center my-4">
                                        <Button className="bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium py-3 px-8 rounded-lg" onClick={() => navigate('/my-sprints/case-interview')}>
                                            Start Sprint
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            <h2 className="text-xl font-bold mb-4">Case Studies</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {caseStudiesData.map((item) => (
                                    <Card key={item.id} className="bg-white border hover:shadow-md transition-shadow cursor-pointer">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="p-3 bg-gray-100 rounded-lg"><span className="text-2xl">{item.icon}</span></div>
                                                {item.badge && <Badge className={'bg-[#a3e635]/20 text-[#65a30d]'}>{item.badge}</Badge>}
                                            </div>
                                            <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                                        </CardHeader>
                                        <CardFooter className="pt-0 pb-3">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Badge variant="outline" className="font-normal">{item.level}</Badge>
                                                <Badge variant="outline" className="font-normal flex items-center gap-1"><Clock className="h-3 w-3" />{item.hours}</Badge>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="bg-white border">
                                <CardHeader><CardTitle className="text-lg font-bold">User Reviews</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {courseData.reviews.map((review, idx) => (
                                        <div key={idx} className="border-b pb-4 last:border-0">
                                            <div className="flex items-center mb-2">
                                                <img src={review.avatar} alt={review.name} className="h-10 w-10 rounded-full object-cover mr-3" />
                                                <div>
                                                    <div className="font-semibold">{review.name}</div>
                                                    <div className="flex">{renderStars(review.rating)}</div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{review.text}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Courses Page
export const CoursesPage = () => {
    const navigate = useNavigate();
    const courseData = coursesData[1];

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main className="pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Button variant="outline" onClick={() => navigate('/my-sprints')} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Sprints
                    </Button>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card className="bg-white border mb-8">
                                <CardHeader>
                                    <div className="flex items-start">
                                        <div className="p-4 bg-gray-100 rounded-lg mr-4"><div className="text-4xl">{courseData.icon}</div></div>
                                        <div>
                                            <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100">{courseData.badge}</Badge>
                                            <CardTitle className="text-2xl font-bold mb-2">{courseData.title}</CardTitle>
                                            <CardDescription className="text-base text-gray-700 mb-4">{courseData.detailedDescription}</CardDescription>
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {courseData.features.map((feature, idx) => <Badge key={idx} variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-full">{feature}</Badge>)}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-center my-4">
                                         <Button className="bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium py-3 px-8 rounded-lg" onClick={() => navigate('/my-sprints/case-interview')}>
                                            Start Sprint
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            <h2 className="text-xl font-bold mb-4">Business Courses</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {courseOptionsData.map((item) => (
                                    <Card key={item.id} className="bg-white border hover:shadow-md transition-shadow cursor-pointer">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="p-3 bg-gray-100 rounded-lg"><span className="text-2xl">{item.icon}</span></div>
                                                {item.badge && <Badge className={item.badge === 'Popular' ? 'bg-[#a3e635]/20 text-[#65a30d]' : 'bg-blue-100 text-blue-700'}>{item.badge}</Badge>}
                                            </div>
                                            <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                                        </CardHeader>
                                        <CardFooter className="pt-0 pb-3">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Badge variant="outline" className="font-normal">{item.level}</Badge>
                                                <Badge variant="outline" className="font-normal flex items-center gap-1"><Clock className="h-3 w-3" />{item.hours}</Badge>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="bg-white border">
                                <CardHeader><CardTitle className="text-lg font-bold">User Reviews</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {courseData.reviews.map((review, idx) => (
                                        <div key={idx} className="border-b pb-4 last:border-0">
                                            <div className="flex items-center mbn-2">
                                                <img src={review.avatar} alt={review.name} className="h-10 w-10 rounded-full object-cover mr-3" />
                                                <div>
                                                    <div className="font-semibold">{review.name}</div>
                                                    <div className="flex">{renderStars(review.rating)}</div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{review.text}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
