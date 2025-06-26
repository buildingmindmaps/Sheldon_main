import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { NavBar } from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Star,
    ArrowLeft,
    Lock,
    Loader,
    Check
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext'; // Updated import path to use existing AuthContext
import { getModulesWithStatus, markModuleCompleted } from '@/services/courseProgressService'; // Import our service functions

// Import the icon mapping and helper functions from AllCourses
import { getIcon, renderStars } from './AllCourses';

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
    content?: string;
    resources?: string[];
    isCompleted?: boolean; // Flag for completed modules
    isUnlocked?: boolean; // Flag for unlocked modules
    experiencePoints?: number; // XP awarded for completion
}

export default function CourseDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const { user } = useAuth(); // Get the current user from auth context

    // Fix: Add null check before destructuring and implement fallback
    const courseFromState = location.state?.course;
    const [course, setCourse] = useState<Course | null>(courseFromState || null);

    const [modules, setModules] = useState<Module[]>([]);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [loadingModules, setLoadingModules] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [moduleContent, setModuleContent] = useState<string | null>(null);
    const [loadingContent, setLoadingContent] = useState<boolean>(false);
    const [userExperiencePoints, setUserExperiencePoints] = useState<number>(0);
    const [completingModule, setCompletingModule] = useState<boolean>(false);

    useEffect(() => {
        const fetchModules = async () => {
            if (!user || !course?._id) return;

            try {
                setLoadingModules(true);

                // Use our new service function to get modules with their status
                const response = await getModulesWithStatus(user._id, course._id);
                const fetchedModules = response.modules;
                setModules(fetchedModules);
                setUserExperiencePoints(response.userExperiencePoints);

                // Select the first unlocked module or the first module if all are locked
                const firstUnlockedModule = fetchedModules.find((module: Module) => module.isUnlocked);
                setSelectedModule(firstUnlockedModule || (fetchedModules.length > 0 ? fetchedModules[0] : null));
            } catch (err) {
                console.error('Error fetching modules:', err);
                setError('Failed to load modules. Please try again later.');
            } finally {
                setLoadingModules(false);
            }
        };

        if (course && course._id && user) {
            fetchModules();
        }
    }, [course, user]);

    // If course wasn't provided in state, fetch it based on URL params
    useEffect(() => {
        // Only fetch if we don't have the course data already
        if (!course && params.courseId) {
            const fetchCourse = async () => {
                try {
                    // You'll need to implement this API endpoint
                    const response = await fetch(`/api/courses/${params.courseId}`);
                    if (!response.ok) throw new Error('Failed to fetch course details');
                    const data = await response.json();
                    setCourse(data);
                } catch (err) {
                    console.error('Error fetching course:', err);
                    setError('Failed to load course details. Please try again later.');
                }
            };
            fetchCourse();
        }
    }, [course, params.courseId]);

    // Handle starting a module
    const handleStartModule = () => {
        if (selectedModule && !selectedModule.isLocked) {
            // Check if the module is SWOT Analysis
            if (selectedModule.title === "SWOT Analysis") {
                // Navigate to the SWOT Analysis page with proper course path
                navigate(`/all-courses/business-frameworks-fundamentals/swot-analysis`);
                return;
            }

            // Navigate to the module content page for other modules
            navigate(`/all-courses/${course.slug}/module/${selectedModule._id}`, {
                state: { module: selectedModule, course }
            });
        }
    };

    // Function to handle module selection from the list
    const handleModuleSelection = async (module: Module) => {
        if (!module.isLocked && module.isUnlocked) {
            setSelectedModule(module);

            try {
                setLoadingContent(true);
                // Fetch the module content from the database using the endpoint we added
                const response = await axios.get(`/api/modules/${module._id}`);
                const moduleData = response.data;

                // Update the module content
                setModuleContent(moduleData.content || "No content available for this module.");
            } catch (error) {
                console.error('Error fetching module content:', error);
                setModuleContent("Failed to load module content. Please try again.");
            } finally {
                setLoadingContent(false);
            }
        }
    };

    // Function to handle module completion
    const handleCompleteModule = async () => {
        if (!selectedModule || !user || !course) return;

        try {
            setCompletingModule(true);

            // Call the API to mark the module as completed
            const result = await markModuleCompleted(user._id, course._id, selectedModule._id);

            // Update the local state to reflect the completion
            setModules(modules.map(module => {
                if (module._id === selectedModule._id) {
                    return { ...module, isCompleted: true };
                }

                // If there's a next module that was just unlocked, update it
                if (result.nextModuleUnlocked && module._id === result.nextModuleUnlocked) {
                    return { ...module, isUnlocked: true };
                }

                return module;
            }));

            // Update user's experience points
            setUserExperiencePoints(result.totalExperiencePoints);

            // Show success message or notification
            alert(`Module completed! You earned ${result.experiencePointsGained} XP.`);

            // Refresh the modules to get the updated unlock status
            const response = await getModulesWithStatus(user._id, course._id);
            setModules(response.modules);

        } catch (error) {
            console.error('Error completing module:', error);
            alert('Failed to complete module. Please try again.');
        } finally {
            setCompletingModule(false);
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
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">{course?.title}</h1>
                        <div className="bg-lime-100 text-lime-800 px-3 py-1 rounded-full text-sm font-medium">
                            XP: {userExperiencePoints}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {selectedModule && (
                                <Card className="bg-white border mb-8">
                                    <CardHeader>
                                        <div className="flex items-start">
                                            <div className="p-4 bg-gray-100 rounded-lg mr-4">{getIcon(selectedModule.icon)}</div>
                                            <div>
                                                {selectedModule.badge && <Badge className="mb-2 bg-lime-100 text-lime-700 hover:bg-lime-100">{selectedModule.badge}</Badge>}
                                                <CardTitle className="text-2xl font-bold mb-2">{selectedModule.title}</CardTitle>
                                                <p className="text-base text-gray-700 mb-4">
                                                    {loadingContent ? 'Loading content...' : moduleContent || selectedModule.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-full">{selectedModule.level}</Badge>
                                                    <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                                        <Clock className="h-4 w-4"/>{selectedModule.duration} mins
                                                    </Badge>
                                                    {selectedModule.experiencePoints && (
                                                        <Badge variant="outline" className="bg-lime-50 text-lime-700 hover:bg-lime-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                                            <Star className="h-4 w-4"/>{selectedModule.experiencePoints} XP
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-center gap-4 my-4">
                                            <Button
                                                className={`font-medium py-3 px-8 rounded-lg ${
                                                    !selectedModule.isUnlocked
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-[#a3e635] hover:bg-[#84cc16] text-black'
                                                }`}
                                                onClick={handleStartModule}
                                                disabled={!selectedModule.isUnlocked}
                                            >
                                                {!selectedModule.isUnlocked ? 'Locked' : 'Start Module'}
                                            </Button>

                                            {selectedModule.isUnlocked && !selectedModule.isCompleted && (
                                                <Button
                                                    className="font-medium py-3 px-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                                                    onClick={handleCompleteModule}
                                                    disabled={completingModule}
                                                >
                                                    {completingModule ? 'Completing...' : 'Complete Module'}
                                                </Button>
                                            )}

                                            {selectedModule.isCompleted && (
                                                <Badge className="flex items-center gap-2 bg-green-100 text-green-700 py-2 px-4">
                                                    <Check className="h-4 w-4" /> Completed
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <h2 className="text-xl font-bold mb-4">{course?.title} Modules</h2>
                            {loadingModules ? (
                                <div className="flex justify-center items-center h-64">
                                    <Loader className="h-8 w-8 animate-spin text-gray-500" />
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                                    {error}
                                </div>
                            ) : modules.length === 0 ? (
                                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
                                    No modules found for this course.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {modules.map((module) => (
                                        <Card
                                            key={module._id}
                                            className={`bg-white transition-shadow relative ${
                                                !module.isUnlocked
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'hover:shadow-md cursor-pointer'
                                            } ${
                                                selectedModule && selectedModule._id === module._id ? 'ring-2 ring-offset-2 ring-lime-400' : 'border'
                                            } ${
                                                module.isCompleted ? 'bg-gray-50' : ''
                                            }`}
                                            onClick={() => handleModuleSelection(module)}
                                        >
                                            {!module.isUnlocked && (
                                                <div className="absolute top-2 right-2 z-10">
                                                    <div className="bg-gray-800 bg-opacity-75 rounded-full p-1">
                                                        <Lock className="h-4 w-4 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                            {module.isCompleted && (
                                                <div className="absolute top-2 right-2 z-10">
                                                    <div className="bg-green-500 bg-opacity-75 rounded-full p-1">
                                                        <Check className="h-4 w-4 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="p-3 bg-gray-100 rounded-lg">{getIcon(module.icon)}</div>
                                                    {module.badge && <Badge className={module.badge === 'Popular' ? 'bg-lime-100 text-lime-700' : 'bg-blue-100 text-blue-700'}>{module.badge}</Badge>}
                                                </div>
                                                <CardTitle className="text-base font-semibold">{module.title}</CardTitle>
                                            </CardHeader>
                                            <CardFooter className="pt-0 pb-3">
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Badge variant="outline" className="font-normal">{module.level}</Badge>
                                                    <Badge variant="outline" className="font-normal flex items-center gap-1"><Clock className="h-3 w-3" />{module.duration} mins</Badge>
                                                    {module.experiencePoints && (
                                                        <Badge variant="outline" className="font-normal flex items-center gap-1 bg-lime-50 text-lime-700 border-lime-200">
                                                            <Star className="h-3 w-3" />{module.experiencePoints} XP
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="bg-white border">
                                <CardHeader><CardTitle className="text-lg font-bold">User Reviews</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {course?.reviews && course.reviews.map((review, idx) => (
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
}
