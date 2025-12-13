import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VideoPlayer from './components/VideoPlayer';
import TopBar from './components/TopBar';
import AIAssistant from './components/AIAssistant';
import { Course, Lesson, Module } from './types.ts';
import { CourseService } from './services/api.ts';
import { PlayCircle } from 'lucide-react';

const App: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initializeCourseState = (courseData: Course) => {
    setCourse(courseData);
    const firstModule = courseData.modules[0];
    const firstLesson = firstModule?.lessons[0];
    setActiveModule(firstModule || null);
    setActiveLesson(firstLesson || null);
  };

  useEffect(() => {
    const loadDefaultCourse = async () => {
      try {
        const fetchedCourse = await CourseService.getById('1');
        initializeCourseState(fetchedCourse);
      } catch (error) {
        console.error("Failed to fetch course 1.", error);
        setErrorMessage("Could not load course data. Make sure the backend at http://localhost:8080 is running and reachable.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDefaultCourse();
  }, []);

  const handleSelectLesson = (lesson: Lesson, module: Module) => {
    setActiveLesson(lesson);
    setActiveModule(module);
    setIsVideoPlaying(false); // Reset play state on new lesson
    // On mobile, close sidebar after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        } else {
            setSidebarOpen(true);
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading || !course || !activeModule || !activeLesson) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0d1117] text-gray-200">
        {isLoading ? 'Loading course...' : (errorMessage || 'No course data available.')}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0d1117] overflow-hidden font-sans text-gray-200">
      
      {/* Sidebar - conditionally visible on mobile, always on desktop if open */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${!sidebarOpen && 'lg:hidden'}`}
      >
        <Sidebar 
            course={course} 
            activeLessonId={activeLesson.id}
            onSelectLesson={handleSelectLesson}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <TopBar 
            courseTitle={course.title} 
            moduleTitle={activeModule.title} 
            lessonTitle={activeLesson.title}
            onToggleSidebar={handleToggleSidebar}
        />

        {errorMessage && (
          <div className="bg-yellow-900/40 text-yellow-200 border border-yellow-700 px-4 py-3 text-sm">
            {errorMessage}
          </div>
        )}

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Video Section */}
                <div className="space-y-6">
                    <VideoPlayer 
                        title={activeLesson.title}
                        videoUrl={activeLesson.videoUrl}
                        isPlaying={isVideoPlaying}
                        onTogglePlay={() => setIsVideoPlaying(!isVideoPlaying)}
                    />
                </div>

                {/* Lesson Info Header */}
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

                {/* Lesson Description / Content Placeholder */}
                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                    <p className="text-lg">
                        In this lesson, we will dive deep into the concepts of <strong>{activeLesson.title}</strong>. 
                        Make sure you have your Go environment ready as we will be writing code together.
                    </p>
                    
                    <div className="bg-[#161b22] border border-gray-800 rounded-lg p-6 my-6">
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
                            <li className="flex items-start">
                                <span className="mr-3 text-purple-500">•</span>
                                Debugging common issues in command line tools.
                            </li>
                        </ul>
                    </div>

                    <p>
                        We'll examine several examples to illustrate how Go handles these operations efficiently. 
                        By the end of this video, you should feel comfortable applying these techniques in your own projects.
                    </p>
                </div>
            </div>
        </main>
      </div>

      {/* Gemini AI Assistant */}
      <AIAssistant 
        lessonTitle={activeLesson.title}
        lessonContext={activeLesson.transcript || `This is a video lesson titled "${activeLesson.title}" in the module "${activeModule.title}" of the "Command Line Applications in Go" course.`}
      />
    </div>
  );
};

export default App;