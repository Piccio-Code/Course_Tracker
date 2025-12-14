import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VideoPlayer from './components/VideoPlayer';
import TopBar from './components/TopBar';
import AIAssistant from './components/AIAssistant';
import CourseDashboard from './components/CourseDashboard';
import { API_BASE_URL, MOCK_API_LIST_RESPONSE, MOCK_API_COURSE_RESPONSE } from './constants.ts';
import { mapCourseResponseToCourse, mapListResponseToCourseSummary } from './utils/mappers';
import { Lesson, Module, Course, API_CourseResponse, API_CoursesListResponse } from './types.ts';
import { PlayCircle } from 'lucide-react';

type ViewMode = 'dashboard' | 'player';

const App: React.FC = () => {
  // Convert API List Response to UI Course Summaries
  const [courses, setCourses] = useState<Course[]>(
      MOCK_API_LIST_RESPONSE.map(mapListResponseToCourseSummary)
  );

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  
  // State for Course Player
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Fetch courses from backend (fallback to mocks if none or error)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/courses`);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data: unknown = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCourses((data as API_CoursesListResponse[]).map(mapListResponseToCourseSummary));
        }
      } catch (err) {
        console.error("Falling back to mock courses:", err);
      }
    };
    load();
  }, []);

  // Initialize player with first course/lesson if entered directly
  useEffect(() => {
    if (activeCourse && !activeModule && activeCourse.modules.length > 0) {
        setActiveModule(activeCourse.modules[0]);
        if(activeCourse.modules[0].lessons.length > 0) {
            setActiveLesson(activeCourse.modules[0].lessons[0]);
        }
    }
  }, [activeCourse]);

  const handleSelectCourse = async (summaryCourse: Course) => {
    let fullCourse = mapCourseResponseToCourse(MOCK_API_COURSE_RESPONSE);

    try {
      const res = await fetch(`${API_BASE_URL}/courses/${summaryCourse.id}`);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data: API_CourseResponse = await res.json();
      fullCourse = mapCourseResponseToCourse(data);
    } catch (err) {
      console.error("Falling back to mock course detail:", err);
      fullCourse.title = summaryCourse.title;
      fullCourse.id = summaryCourse.id;
    }

    setActiveCourse(fullCourse);
    
    if (fullCourse.modules.length > 0) {
        setActiveModule(fullCourse.modules[0]);
        if (fullCourse.modules[0].lessons.length > 0) {
            setActiveLesson(fullCourse.modules[0].lessons[0]);
        }
    }
    setViewMode('player');
  };

  const handleAddCourse = (newCourseData: Partial<Course>) => {
    // Optimistic UI update
    const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: newCourseData.title!,
        description: newCourseData.description!,
        thumbnailGradient: newCourseData.thumbnailGradient!,
        progress: 0,
        totalLessons: 0,
        modules: [],
        ...newCourseData
    } as Course;
    setCourses([...courses, newCourse]);
  };

  const handleSelectLesson = (lesson: Lesson, module: Module) => {
    setActiveLesson(lesson);
    setActiveModule(module);
    setIsVideoPlaying(false);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        } else {
            setSidebarOpen(true);
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Background Layout Wrapper
  return (
    <div className="relative flex h-screen w-full bg-[#0d1117] overflow-hidden font-sans text-gray-200 selection:bg-purple-500/30">
      
      {/* Global Background Animations */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] animate-float mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] animate-float-delayed mix-blend-screen"></div>
      </div>

      {viewMode === 'dashboard' ? (
        <CourseDashboard 
            courses={courses} 
            onSelectCourse={handleSelectCourse} 
            onAddCourse={handleAddCourse}
        />
      ) : (
        /* Player View */
        <div className="relative z-10 flex w-full h-full overflow-hidden animate-fade-in-up">
            {/* Sidebar */}
            <div 
                className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } ${!sidebarOpen && 'lg:hidden'}`}
            >
                {activeCourse && activeLesson && (
                    <Sidebar 
                        course={activeCourse} 
                        activeLessonId={activeLesson.id}
                        onSelectLesson={handleSelectLesson}
                        onClose={() => setSidebarOpen(false)}
                        onBackToDashboard={() => setViewMode('dashboard')}
                    />
                )}
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Content */}
            <div className="flex-1 flex flex-col h-full min-w-0 bg-[#0d1117]/50 backdrop-blur-sm">
                {activeCourse && activeModule && activeLesson && (
                    <>
                        <TopBar 
                            courseTitle={activeCourse.title} 
                            moduleTitle={activeModule.title} 
                            lessonTitle={activeLesson.title}
                            onToggleSidebar={handleToggleSidebar}
                        />

                        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
                            <div className="max-w-5xl mx-auto space-y-8">
                                <div className="space-y-6">
                                    <VideoPlayer 
                                        title={activeLesson.title}
                                        isPlaying={isVideoPlaying}
                                        onTogglePlay={() => setIsVideoPlaying(!isVideoPlaying)}
                                        videoUrl={activeLesson.videoUrl}
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-gray-800 pb-8">
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium text-purple-400 tracking-wider uppercase">
                                            {activeModule.title}
                                        </span>
                                        <h2 className="text-3xl font-bold text-white tracking-tight">
                                            {activeLesson.title}
                                        </h2>
                                    </div>
                                    <div className="flex items-center space-x-6 text-2xl font-mono text-gray-400 font-light">
                                    {activeLesson.duration}
                                    </div>
                                </div>

                                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                                    <p className="text-lg">
                                        In this lesson, we will dive deep into the concepts of <strong>{activeLesson.title}</strong>. 
                                        Make sure you have your Go environment ready as we will be writing code together.
                                    </p>
                                    
                                    <div className="bg-[#161b22] border border-gray-800 rounded-lg p-6 my-6 hover:border-purple-500/30 transition-colors">
                                        <h4 className="text-white font-semibold mb-4 flex items-center">
                                            <PlayCircle className="mr-2 text-purple-400" size={20} />
                                            Key Takeaways
                                        </h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-start">
                                                <span className="mr-3 text-purple-500">•</span>
                                                Understanding the core syntax and structure.
                                            </li>
                                            <li className="flex items-start">
                                                <span className="mr-3 text-purple-500">•</span>
                                                Implementing best practices for clean code.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </main>
                        
                        {/* Gemini Assistant (Scoped to Player View) */}
                        <AIAssistant 
                            lessonTitle={activeLesson.title}
                            lessonContext={activeLesson.transcript || `Lesson: ${activeLesson.title}`}
                        />
                    </>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default App;