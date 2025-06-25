import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
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
    Lock,
    Loader
} from 'lucide-react';

// Icon mapping for string-based rendering
const iconMap: Record<string, JSX.Element> = {
    Droplet: <Droplet className="w-6 h-6" />,
    DoorOpen: <DoorOpen className="w-6 h-6" />,
    Package: <Package className="w-6 h-6" />,
    RefreshCw: <RefreshCw className="w-6 h-6" />,
    Settings: <Settings className="w-6 h-6" />,
    TrendingUp: <TrendingUp className="w-6 h-6" />,
    Calculator: <Calculator className="w-6 h-6" />,
    LayoutGrid: <LayoutGrid className="w-6 h-6" />,
    Target: <Target className="w-6 h-6" />,
    Workflow: <Workflow className="w-6 h-6" />,
    DollarSign: <DollarSign className="w-6 h-6" />,
    BarChart2: <BarChart2 className="w-6 h-6" />,
};

export const getIcon = (name: string) => iconMap[name] || <Package className="w-6 h-6" />;

// Helper function to render stars
export const renderStars = (rating: number) => (
    Array(5).fill(0).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))
);

// Type definitions
interface Course {
    _id: string;
    title: string;
    description: string;
    slug: string;
    badge?: string;
    icon: string;
    features: string[];
    reviews: {
        name: string;
        avatar: string;
        rating: number;
        text: string;
    }[];
}

interface Module {
    _id: string;
    title: string;
    description: string;
    level: string;
    duration: number;
    badge?: string;
    icon: string;
    isLocked: boolean;
    courseId: string;
    order: number;
}

// Main "/all-courses" page
export default function AllCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/courses');
                setCourses(response.data);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Handle course navigation
    const handleCourseClick = (course: Course) => {
        navigate(`/all-courses/${course.slug}`, { state: { course } });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main className="pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">All Courses</h1>
                        <p className="text-gray-600">Develop business acumen with bite-size lessons & hands-on exercises that make skills stick for everyone.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                            {error}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {courses.map((course) => (
                                <Card
                                    key={course._id}
                                    className="bg-white border hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handleCourseClick(course)}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="p-3 bg-gray-100 rounded-lg">{getIcon(course.icon)}</div>
                                            {course.badge && <Badge className={course.badge === 'Popular' ? 'bg-[#a3e635]/20 text-[#65a30d]' : 'bg-blue-100 text-blue-700'}>{course.badge}</Badge>}
                                        </div>
                                        <CardTitle className="text-base font-semibold">{course.title}</CardTitle>
                                        <CardDescription className="text-sm line-clamp-2">{course.description}</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="pt-3 pb-3">
                                        <div className="flex flex-wrap gap-2">
                                            {course.features && course.features.map((feature, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs bg-gray-50 text-gray-700 hover:bg-gray-50">{feature}</Badge>
                                            ))}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Case Practice Page - CORRECTED to prevent render crash
export const CasePracticePage = () => {
    const navigate = useNavigate();
    const sprintData = coursesData[0];

    // FIX: First, prepare the initial data from a single source.
    const getInitialData = () => {
        try {
            const storedCases = localStorage.getItem('caseStudiesData');
            if (storedCases) {
                return JSON.parse(storedCases);
            }
        } catch (error) {
            console.error("Error parsing case studies from localStorage. Resetting.", error);
        }
        // If try block fails or there are no stored cases, initialize storage and return default data.
        localStorage.setItem('caseStudiesData', JSON.stringify(initialCaseStudiesData));
        return initialCaseStudiesData;
    };

    // Call the function once to get the data for this render.
    const initialData = getInitialData();

    // Now, use this single, reliable data source to initialize your states.
    const [caseStudiesData, setCaseStudiesData] = useState(initialData);
    const [selectedCase, setSelectedCase] = useState(
        // Find the selected case from the 'initialData' variable, not from another state.
        () => initialData.find((c: any) => !c.isLocked) || initialData[0]
    );

    // Handle starting a sprint
    const handleStartSprint = () => {
        if (!selectedCase.isLocked) {
            navigate('/all-courses/case-interview', { state: { caseData: selectedCase } });
        }
    };

    // Function to handle case selection from the list
    const handleCaseSelection = (caseStudy: typeof selectedCase) => {
        if (!caseStudy.isLocked) {
            setSelectedCase(caseStudy);
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Case Practice</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card className="bg-white border mb-8">
                                <CardHeader>
                                    <div className="flex items-start">
                                        <div className="p-4 bg-gray-100 rounded-lg mr-4">{getIcon(selectedCase.icon)}</div>
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
                                            onClick={handleStartSprint}
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
                                                <div className="p-3 bg-gray-100 rounded-lg">{getIcon(item.icon)}</div>
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

// BusinessFrameworksPage - MODIFIED to fix loading state issue
export const BusinessFrameworksPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Initialize with hardcoded data to avoid null states
    const coursesData = [
        // First course data (index 0)
        {
            title: "Case Practice",
            description: "Practice case interviews with realistic scenarios",
            reviews: [
                {
                    name: "Alex Johnson",
                    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                    rating: 5,
                    text: "The case interview practice was extremely helpful for my consulting interviews."
                },
                {
                    name: "Sarah Chen",
                    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                    rating: 4,
                    text: "Great practice scenarios that mirror real consulting interviews."
                }
            ]
        },
        // Second course data (index 1)
        {
            title: "Business Frameworks",
            description: "Learn essential business frameworks for strategic analysis",
            reviews: [
                {
                    name: "Michael Rodriguez",
                    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
                    rating: 5,
                    text: "The frameworks covered were extremely relevant and well-explained."
                },
                {
                    name: "Emma Wilson",
                    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
                    rating: 5,
                    text: "I use these frameworks regularly in my work now. Highly recommend!"
                },
                {
                    name: "David Thompson",
                    avatar: "https://randomuser.me/api/portraits/men/53.jpg",
                    rating: 4,
                    text: "Clear explanations and practical examples of how to apply each framework."
                }
            ]
        }
    ];

    const courseOptionsData = [
        {
            id: "swot",
            title: "SWOT Analysis",
            description: "Strategic planning tool for evaluating Strengths, Weaknesses, Opportunities, and Threats",
            icon: "BarChart2",
            level: "Beginner",
            hours: "1.5 hours",
            badge: "Popular"
        },
        {
            id: "porter",
            title: "Porter's Five Forces",
            description: "Framework for analyzing competitive intensity and business strategy development",
            icon: "TrendingUp",
            level: "Intermediate",
            hours: "2 hours"
        },
        {
            id: "bcg",
            title: "BCG Matrix",
            description: "Framework to evaluate different business units or products based on growth and market share",
            icon: "LayoutGrid",
            level: "Intermediate",
            hours: "1.5 hours"
        }
    ];

    // Initialize with default data immediately to avoid loading screen
    const [sprintData, setSprintData] = useState(coursesData[1]);
    const [selectedCourse, setSelectedCourse] = useState(courseOptionsData[0]);

    useEffect(() => {
        // We still try to fetch data, but we already have defaults loaded
        const fetchCourseData = async () => {
            // Only show loading if we don't have initial data
            if (!sprintData) setIsLoading(true);

            try {
                // Attempt API request but with a timeout to prevent infinite loading
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                const courseSlug = 'business-frameworks-fundamentals';
                const response = await fetch(`/api/courses/${courseSlug}`, {
                    signal: controller.signal
                }).catch(err => {
                    // Handle network errors
                    console.log("Network error:", err);
                    return null;
                });

                clearTimeout(timeoutId);

                if (response && response.ok) {
                    const data = await response.json();
                    // Only update if we got valid data
                    if (data && data.reviews) {
                        setSprintData(data);
                    }
                } else {
                    console.log("API request failed or timed out, using default data");
                }
            } catch (error) {
                console.error("Error in data fetching:", error);
                // We already have default data, so just log the error
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseData();
    }, []);

    const handleStartSprint = () => {
        if (selectedCourse?.title === 'SWOT Analysis') {
            navigate('/all-courses/business-frameworks-fundamentals/swot-analysis');
        } else {
            alert(`Navigation for "${selectedCourse?.title}" is not implemented yet.`);
        }
    };

    // If we're still showing loading and have no data
    if (isLoading && !sprintData) {
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Loading Business Frameworks...</h1>
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Always render content now that we have default data
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
                            <Card className="bg-white border mb-8">
                                <CardHeader>
                                    <div className="flex items-start">
                                        <div className="p-4 bg-gray-100 rounded-lg mr-4">{getIcon(selectedCourse.icon)}</div>
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
                                     <Button className="bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium py-3 px-8 rounded-lg" onClick={handleStartSprint}>
                                        Start Sprint
                                    </Button>
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
                                                <div className="p-3 bg-gray-100 rounded-lg">{getIcon(item.icon)}</div>
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
                        <div className="lg:col-span-1">
                            <Card className="bg-white border">
                                <CardHeader><CardTitle className="text-lg font-bold">User Reviews</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {sprintData.reviews && sprintData.reviews.length > 0 ? (
                                        sprintData.reviews.map((review, idx) => (
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
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            No reviews available for this course yet.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
