import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Star,
    ArrowLeft,
    BarChart2,
    DollarSign,
    Droplet,
    DoorOpen,
    Package,
    RefreshCw,
    Settings,
    TrendingUp,
    Calculator,
    LayoutGrid,
    Target,
    Workflow,
    Lock
} from 'lucide-react';

// Data for sprints and courses
const coursesData = [
    {
        id: 0,
        title: "Profitability: Case Practice",
        route: "/all-courses/case-practice",
        description: "Learn to break down business problems with a structured approach that balances opportunity and risk.",
        badge: "Popular",
        icon: <BarChart2 className="w-6 h-6" />,
        detailedDescription: "Master the frameworks needed to solve case studies effectively with a structured approach.",
        features: ["Water Purifier", "Market Entry", "XYZ"],
        reviews: [
            { name: "Michael P.", avatar: "https://i.pravatar.cc/150?u=michael", rating: 5, text: "This course completely changed how I approach market entry problems. The frameworks are easy to understand but powerful in practice." },
            { name: "Sarah J.", avatar: "https://i.pravatar.cc/150?u=sarah", rating: 4, text: "Great balance of theory and practice. I feel much more confident tackling these types of cases now." }
        ]
    },
    {
        id: 1,
        title: "100 Business Frameworks",
        route: "/all-courses/business-frameworks",
        description: "Master the Theory Knowledge for Business Case Studies.",
        badge: "New",
        icon: <DollarSign className="w-6 h-6" />,
        detailedDescription: "Build comprehensive business knowledge with our structured courses on various decision frameworks.",
        features: ["Platform Philosophy", "Operational Decision Frameworks", "Financial Decision Frameworks", "Organizational Decision Frameworks"],
        reviews: [
            { name: "Robert K.", avatar: "https://i.pravatar.cc/150?u=robert", rating: 5, text: "Excellent course for anyone looking to strengthen their business decision-making skills." }
        ]
    }
];

// Updated case studies data with proper locking logic
const getInitialCaseStudiesData = () => {
    const completedCases = JSON.parse(localStorage.getItem('completedCases') || '[]');
    return [
        { id: 3, title: "Water Purifier", description: "Analyze market opportunity and entry strategy for a new water purification technology", level: "Intermediate", hours: "10 minutes", badge: "", icon: <Droplet className="w-6 h-6" />, isLocked: false },
        { id: 4, title: "Market Entry", description: "Evaluate expansion opportunities for a tech company entering emerging markets", level: "Beginner", hours: "10 minutes", badge: "Popular", icon: <DoorOpen className="w-6 h-6" />, isLocked: !completedCases.includes(3) },
        { id: 5, title: "XYZ", description: "Solve complex business challenges with our comprehensive case methodology", level: "Advanced", hours: "10 minutes", badge: "New", icon: <Package className="w-6 h-6" />, isLocked: !completedCases.includes(4) }
    ];
};

const courseOptionsData = [
    { id: 6, title: "SWOT Analysis", description: "Map your strengths, weaknesses, opportunities, and threats in a simple 2x2 grid.", level: "Strategic Decision Frameworks", hours: "9 mins", badge: "Popular", icon: <RefreshCw className="w-6 h-6" /> },
    { id: 7, title: "Porter's Five Forces", description: "Check if your industry is a battlefield or a goldmine by analyzing five competitive pressures.", level: "Strategic Decision Frameworks", hours: "9 mins", badge: "", icon: <Settings className="w-6 h-6" /> },
    { id: 8, title: "BCG Matrix", description: " Categorize your products as Stars, Cash Cows, Question Marks, or Dogs to decide where to invest. ", level: "Strategic Decision Frameworks", hours: "9 mins", badge: "New", icon: <TrendingUp className="w-6 h-6" /> },
    { id: 9, title: "Ansoff Matrix", description: "Four growth paths - sell more to current customers, find new customers, create new products, or do something completely different.", level: "Strategic Decision Frameworks", hours: "9 mins", badge: "Popular", icon: <Calculator className="w-6 h-6" /> },
    { id: 10, title: "Lean Six Sigma", description: "Eliminate waste (Lean) and reduce variation (Six Sigma) to improve processes.", level: "Operational Decision Frameworks", hours: "9 mins", badge: "Popular", icon: <LayoutGrid className="w-6 h-6" /> },
    { id: 11, title: "Theory of Constraints", description: " Find the bottleneck that limits your entire system's performance", level: "Operational Decision Frameworks", hours: "9 mins", badge: "Popular", icon: <Target className="w-6 h-6" /> },
    { id: 12, title: "5S Methodology", description: " Sort, Set in order, Shine, Standardize, Sustain for organized, efficient workspaces.", level: "Operational Decision Frameworks", hours: "9 mins", badge: "Popular", icon: <Settings className="w-6 h-6" /> },
    { id: 13, title: "Kaizen", description: " Continuous small improvements add up to dramatic results over time.", level: "Operational Decision Frameworks", hours: "9 mins", badge: "Popular", icon: <Workflow className="w-6 h-6" /> },
];

// Helper function to render stars
const renderStars = (rating: number) => (
    Array(5).fill(0).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))
);

// Main "/all-courses" page
export default function AllCourses() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main className="pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">All Courses</h1>
                        <p className="text-gray-600">Develop business acumen with bite-size lessons & hands-on exercises that make skills stick for everyone.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {coursesData.map((course) => (
                            <Card
                                key={course.id}
                                className="bg-white border hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigate(course.route)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="p-3 bg-gray-100 rounded-lg">{course.icon}</div>
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

// Case Practice Page - MODIFIED with improved locking system
export const CasePracticePage = () => {
    const navigate = useNavigate();
    const sprintData = coursesData[0]; 
    
    // State management for case studies with locking that checks localStorage
    const [caseStudiesData, setCaseStudiesData] = useState(getInitialCaseStudiesData());
    const [selectedCase, setSelectedCase] = useState(caseStudiesData.find(c => !c.isLocked) || caseStudiesData[0]);

    // Function to handle case completion and unlock next case
    const handleCaseCompletion = (completedCaseId: number) => {
        // Mark this case as completed in localStorage
        const completedCases = JSON.parse(localStorage.getItem('completedCases') || '[]');
        if (!completedCases.includes(completedCaseId)) {
            completedCases.push(completedCaseId);
            localStorage.setItem('completedCases', JSON.stringify(completedCases));
        }

        // Update the case studies data to unlock the next case
        const currentIndex = caseStudiesData.findIndex(c => c.id === completedCaseId);
        if (currentIndex !== -1 && currentIndex < caseStudiesData.length - 1) {
            setCaseStudiesData(prev => prev.map((caseStudy, index) => 
                index === currentIndex + 1 ? { ...caseStudy, isLocked: false } : caseStudy
            ));
        }
        
        // Navigate to the case interview
        navigate('/all-courses/case-interview');
    };

    // Function to handle case selection (only for unlocked cases)
    const handleCaseSelection = (caseStudy: typeof selectedCase) => {
        if (!caseStudy.isLocked) {
            setSelectedCase(caseStudy);
        }
    };

    // Check if user returns from completing a case and refresh the data
    React.useEffect(() => {
        const refreshedData = getInitialCaseStudiesData();
        setCaseStudiesData(refreshedData);
        // Update selected case if it becomes unlocked
        const currentSelected = refreshedData.find(c => c.id === selectedCase.id);
        if (currentSelected) {
            setSelectedCase(currentSelected);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main className="pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Button variant="outline" onClick={() => navigate('/all-courses')} className="mb-2 p-1">
                        <div className="rounded">
                            <ArrowLeft className="h-4 w-4" />
                        </div>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Case Practice</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card className="bg-white border mb-8">
                                <CardHeader>
                                    <div className="flex items-start">
                                        <div className="p-4 bg-gray-100 rounded-lg mr-4">{selectedCase.icon}</div>
                                        <div>
                                            {selectedCase.badge && <Badge className="mb-2 bg-lime-100 text-lime-700 hover:bg-lime-100">{selectedCase.badge}</Badge>}
                                            <CardTitle className="text-2xl font-bold mb-2">{selectedCase.title}</CardTitle>
                                            <CardDescription className="text-base text-gray-700 mb-4">{selectedCase.description}</CardDescription>
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-full">{selectedCase.level}</Badge>
                                                <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-full flex items-center gap-1.5"><Clock className="h-4 w-4"/>{selectedCase.hours}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-center my-4">
                                        <Button 
                                            className={`font-medium py-3 px-8 rounded-lg ${
                                                selectedCase.isLocked 
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                    : 'bg-[#a3e635] hover:bg-[#84cc16] text-black'
                                            }`}
                                            onClick={() => !selectedCase.isLocked && handleCaseCompletion(selectedCase.id)}
                                            disabled={selectedCase.isLocked}
                                        >
                                            {selectedCase.isLocked ? 'Locked' : 'Start Sprint'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <h2 className="text-xl font-bold mb-4">Profitability: Case Practice</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {caseStudiesData.map((item) => (
                                    <Card 
                                      key={item.id} 
                                      className={`bg-white transition-shadow relative ${
                                          item.isLocked 
                                              ? 'opacity-50 cursor-not-allowed' 
                                              : 'hover:shadow-md cursor-pointer'
                                      } ${
                                          selectedCase.id === item.id ? 'ring-2 ring-offset-2 ring-lime-400' : 'border'
                                      }`}
                                      onClick={() => handleCaseSelection(item)}
                                    >
                                        {item.isLocked && (
                                            <div className="absolute top-2 right-2 z-10">
                                                <div className="bg-gray-800 bg-opacity-75 rounded-full p-1">
                                                    <Lock className="h-4 w-4 text-white" />
                                                </div>
                                            </div>
                                        )}
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="p-3 bg-gray-100 rounded-lg">{item.icon}</div>
                                                {item.badge && <Badge className={item.badge === 'Popular' ? 'bg-lime-100 text-lime-700' : 'bg-blue-100 text-blue-700'}>{item.badge}</Badge>}
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
                                    {sprintData.reviews.map((review, idx) => (
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

// 100BusinessFrameworksPage - UNMODIFIED
export const BusinessFrameworksPage = () => {
    const navigate = useNavigate();
    const sprintData = coursesData[1]; // General data for the "Courses" sprint (for reviews)
    const [selectedCourse, setSelectedCourse] = useState(courseOptionsData[0]); // State for selected course

    const handleStartSprint = () => {
        // Navigate to the SWOT app only if that course is selected
        if (selectedCourse.title === 'SWOT Analysis') {
            navigate('/all-courses/business-frameworks/swot-analysis');
        } else {
            alert(`Navigation for "${selectedCourse.title}" is not implemented yet.`);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main className="pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Button variant="outline" onClick={() => navigate('/all-courses')} className="mb-2 p-1">
                        <div className="rounded">
                            <ArrowLeft className="h-4 w-4" />
                        </div>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">100 Business Frameworks</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {/* Main card, now displays the content of the selectedCourse */}
                            <Card className="bg-white border mb-8">
                                <CardHeader>
                                    <div className="flex items-start">
                                        <div className="p-4 bg-gray-100 rounded-lg mr-4">{selectedCourse.icon}</div>
                                        <div>
                                            {selectedCourse.badge && <Badge className="mb-2 bg-lime-100 text-lime-700 hover:bg-lime-100">{selectedCourse.badge}</Badge>}
                                            <CardTitle className="text-2xl font-bold mb-2">{selectedCourse.title}</CardTitle>
                                            <CardDescription className="text-base text-gray-700 mb-4">{selectedCourse.description}</CardDescription>
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-full">{selectedCourse.level}</Badge>
                                                <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-full flex items-center gap-1.5"><Clock className="h-4 w-4"/>{selectedCourse.hours}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-center my-4">
                                         <Button className="bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium py-3 px-8 rounded-lg" onClick={handleStartSprint}>
                                            Start Sprint
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <h2 className="text-xl font-bold mb-4">Modules</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {courseOptionsData.map((item) => (
                                    <Card 
                                      key={item.id} 
                                      className={`bg-white hover:shadow-md transition-shadow cursor-pointer ${selectedCourse.id === item.id ? 'ring-2 ring-offset-2 ring-lime-400' : 'border'}`}
                                      onClick={() => setSelectedCourse(item)}
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="p-3 bg-gray-100 rounded-lg">{item.icon}</div>
                                                {item.badge && <Badge className={item.badge === 'Popular' ? 'bg-lime-100 text-lime-700' : 'bg-blue-100 text-blue-700'}>{item.badge}</Badge>}
                                            </div>
                                            <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                                        </CardHeader>
                                        <CardFooter className="pt-0 pb-3">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <ul>
                                                <li><Badge variant="outline" className="font-normal flex items-center gap-1 whitespace-nowrap">{item.level}</Badge></li>
                                                <li><Badge variant="outline" className="font-normal flex items-center gap-1 whitespace-nowrap"><Clock className="h-3 w-3" />{item.hours}</Badge></li>
                                                </ul>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        {/* User reviews for the overall  "Business Frameworks" sprint */}
                        <div className="lg:col-span-1">
                            <Card className="bg-white border">
                                <CardHeader><CardTitle className="text-lg font-bold">User Reviews</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {sprintData.reviews.map((review, idx) => (
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
