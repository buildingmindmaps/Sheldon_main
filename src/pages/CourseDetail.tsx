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
    Lock,
    Loader
} from 'lucide-react';

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
}

export default function CourseDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { course } = location.state as { course: Course };

    const [modules, setModules] = useState<Module[]>([]);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [loadingModules, setLoadingModules] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoadingModules(true);
                const response = await axios.get(`/api/modules/by-course/${course._id}`);
                const fetchedModules = response.data;
                setModules(fetchedModules);

                // Select the first unlocked module or the first module if all are locked
                const firstUnlockedModule = fetchedModules.find((module: Module) => !module.isLocked);
                setSelectedModule(firstUnlockedModule || (fetchedModules.length > 0 ? fetchedModules[0] : null));
            } catch (err) {
                console.error('Error fetching modules:', err);
                setError('Failed to load modules. Please try again later.');
            } finally {
                setLoadingModules(false);
            }
        };

        if (course && course._id) {
            fetchModules();
        }
    }, [course]);

    // Handle starting a module
    const handleStartModule = () => {
        if (selectedModule && !selectedModule.isLocked) {
            // Navigate to the module content page (you'll need to implement this)
            navigate(`/all-courses/${course.slug}/module/${selectedModule._id}`, {
                state: { module: selectedModule, course }
            });
        }
    };

    // Function to handle module selection from the list
    const handleModuleSelection = (module: Module) => {
        if (!module.isLocked) {
            setSelectedModule(module);
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">{course.title}</h1>
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
                                                <CardDescription className="text-base text-gray-700 mb-4">{selectedModule.description}</CardDescription>
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-full">{selectedModule.level}</Badge>
                                                    <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                                        <Clock className="h-4 w-4"/>{selectedModule.duration} mins
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-center my-4">
                                            <Button
                                                className={`font-medium py-3 px-8 rounded-lg ${
                                                    selectedModule.isLocked
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-[#a3e635] hover:bg-[#84cc16] text-black'
                                                }`}
                                                onClick={handleStartModule}
                                                disabled={selectedModule.isLocked}
                                            >
                                                {selectedModule.isLocked ? 'Locked' : 'Start Module'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <h2 className="text-xl font-bold mb-4">{course.title} Modules</h2>
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
                                                module.isLocked
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'hover:shadow-md cursor-pointer'
                                            } ${
                                                selectedModule && selectedModule._id === module._id ? 'ring-2 ring-offset-2 ring-lime-400' : 'border'
                                            }`}
                                            onClick={() => handleModuleSelection(module)}
                                        >
                                            {module.isLocked && (
                                                <div className="absolute top-2 right-2 z-10">
                                                    <div className="bg-gray-800 bg-opacity-75 rounded-full p-1">
                                                        <Lock className="h-4 w-4 text-white" />
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
                                    {course.reviews && course.reviews.map((review, idx) => (
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
