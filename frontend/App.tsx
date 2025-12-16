import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import VideoPlayer from './components/VideoPlayer';
import AIAssistant from './components/AIAssistant';
import CourseDashboard from './components/CourseDashboard';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProfilePage from './components/ProfilePage';
import FloatingLines from './components/FloatingLines';
import CardNav, { CardNavItem } from './components/CardNav';
import { mapCourseResponseToCourse, mapListResponseToCourseSummary } from './utils/mappers';
import { Lesson, Module, Course, UserProfile } from './types.ts';
import { api } from './services/api';
import { PlayCircle, Loader2, PanelLeft, X } from 'lucide-react';

type ViewMode = 'dashboard' | 'player' | 'login' | 'signup' | 'profile';

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('login'); 
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // State for Course Player
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // --- API Integrations ---

  const fetchCourses = async () => {
    try {
      const list = await api.getCourses();
      setCourses(list.map(mapListResponseToCourseSummary));
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  };

  const checkAuth = async () => {
    try {
      const userData = await api.getUser();
      
      // Strict validation: Ensure userData is an object and has required fields.
      // If the API returns HTML (string) or empty object for unauth users, this catches it.
      if (!userData || typeof userData !== 'object' || !('username' in userData) || !('email' in userData)) {
         throw new Error("Invalid user session data");
      }

      setUser(userData);
      await fetchCourses(); // Fetch courses if auth is good
      setViewMode('dashboard');
    } catch (error) {
      // If error (401/400/Invalid Data), user is not logged in
      console.log("Not authenticated or invalid session:", error);
      setUser(null);
      setViewMode('login');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
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
    try {
        const fullCourseData = await api.getCourseDetails(summaryCourse.id);
        const fullCourse = mapCourseResponseToCourse(fullCourseData);
        
        setActiveCourse(fullCourse);
        
        if (fullCourse.modules.length > 0) {
            setActiveModule(fullCourse.modules[0]);
            if (fullCourse.modules[0].lessons.length > 0) {
                setActiveLesson(fullCourse.modules[0].lessons[0]);
            }
        }
        setViewMode('player');
    } catch (e) {
        console.error("Failed to load course details", e);
        alert("Failed to load course content.");
    }
  };

  const handleAddCourse = async (courseData: Partial<Course> & { url?: string }) => {
    if (!courseData.url) return;
    try {
        const newCourseData = await api.createCourse({ 
            url: courseData.url, 
            name: courseData.title 
        });
        // Refresh list
        await fetchCourses();
    } catch (e) {
        console.error("Failed to create course", e);
        alert("Failed to create course. Please check the URL.");
    }
  };

  const handleSelectLesson = (lesson: Lesson, module: Module) => {
    setActiveLesson(lesson);
    setActiveModule(module);
    setIsVideoPlaying(false);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      // Always clear local state even if server logout fails
      setUser(null);
      setCourses([]);
      setViewMode('login');
    }
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

  // Navigation Items for CardNav
  const navItems: CardNavItem[] = useMemo(() => [
    {
      label: "Catalog",
      bgColor: "#0f172a", 
      textColor: "#fff",
      links: [
        { label: "Browse Catalog", href: "#", ariaLabel: "Browse Courses", onClick: () => { fetchCourses(); setViewMode('dashboard'); } }
      ]
    },
    {
      label: "Settings", 
      bgColor: "#581c87", 
      textColor: "#fff",
      links: [
        { label: "Profile", href: "#", ariaLabel: "Profile Settings", onClick: () => setViewMode('profile') }
      ]
    },
    {
      label: "Logout",
      bgColor: "#171717", 
      textColor: "#fff",
      links: [
        { label: "Sign Out", href: "#", ariaLabel: "Log Out", onClick: handleLogout }
      ]
    }
  ], []);

  // Use a boolean to check if we need navigation to show
  // This allows us to keep CardNav mounted between Dashboard/Profile switches
  const showNavigation = user && (viewMode === 'dashboard' || viewMode === 'profile');

  // --- Render Logic ---

  const renderContent = () => {
    if (isLoadingAuth) {
      return (
          <div className="flex h-full w-full items-center justify-center relative z-20">
              <Loader2 className="animate-spin text-purple-500" size={48} />
          </div>
      );
    }

    switch (viewMode) {
      case 'dashboard':
        return (
          <div className="pt-24 h-full flex flex-col relative z-10">
              <CourseDashboard 
                  courses={courses} 
                  onSelectCourse={handleSelectCourse} 
                  onAddCourse={handleAddCourse}
                  onNavigateToProfile={() => setViewMode('profile')}
              />
          </div>
        );
      case 'profile':
        return (
           <div className="pt-24 h-full flex flex-col relative z-10">
               <ProfilePage 
                  user={user || { username: 'Guest', email: 'guest@example.com' }}
                  onUpdateUser={(updatedUser) => setUser(updatedUser)}
                  onBack={() => setViewMode('dashboard')}
               />
           </div>
        );
      case 'player':
        return (
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

                {/* Sidebar Toggle Button (Visible when sidebar is closed) */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className={`fixed top-8 left-8 z-40 p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg transition-all duration-300 border border-white/10 ${sidebarOpen ? 'opacity-0 pointer-events-none -translate-x-4' : 'opacity-100 translate-x-0'}`}
                    title="Open Sidebar"
                >
                    <PanelLeft size={24} />
                </button>

                {/* Content */}
                <div className="relative flex-1 flex flex-col h-full min-w-0 bg-[#161b22]/80 backdrop-blur-md">
                    {/* Close Button */}
                    <button
                        onClick={() => setViewMode('dashboard')}
                        className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-black/80 text-gray-400 hover:text-white rounded-lg transition-all duration-300 border border-white/10 group"
                        title="Close Player"
                    >
                         <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                    
                    {activeCourse && activeModule && activeLesson && (
                        <>
                            <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
                                <div className="max-w-5xl mx-auto space-y-8">
                                    <div className="space-y-6">
                                        <VideoPlayer 
                                            title={activeLesson.title}
                                            isPlaying={isVideoPlaying}
                                            onTogglePlay={() => setIsVideoPlaying(!isVideoPlaying)}
                                            duration={activeLesson.duration}
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
                                            This is a resource from your OneDrive course.
                                        </p>
                                        
                                        <div className="bg-[#161b22] border border-gray-800 rounded-lg p-6 my-6 hover:border-purple-500/30 transition-colors">
                                            <h4 className="text-white font-semibold mb-4 flex items-center">
                                                <PlayCircle className="mr-2 text-purple-400" size={20} />
                                                Source
                                            </h4>
                                            <p className="text-sm text-gray-400">
                                                {activeLesson.videoUrl ? (
                                                    <a href={activeLesson.videoUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                                                        Open file directly
                                                    </a>
                                                ) : "No URL available"}
                                            </p>
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
        );
      case 'login':
        return (
          <div className="w-full h-full flex items-center justify-center px-4 relative z-10">
            <LoginPage 
                onLoginSuccess={(userData) => {
                    setUser(userData);
                    fetchCourses();
                    setViewMode('dashboard');
                }}
                onNavigateToSignup={() => setViewMode('signup')}
            />
          </div>
        );
      case 'signup':
        return (
          <div className="w-full h-full flex items-center justify-center px-4 relative z-10">
            <SignupPage
                onSignupSuccess={(userData) => {
                    checkAuth();
                }}
                onNavigateToLogin={() => setViewMode('login')}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden font-sans text-gray-200 selection:bg-purple-500/30">
      
      {/* Universal Background */}
      <div className="fixed inset-0 z-0">
        <FloatingLines 
            linesGradient={['#8b5cf6', '#3b82f6', '#000000']}
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={[10, 15, 20]}
            lineDistance={[8, 6, 4]}
            bendRadius={200}
            bendStrength={0.5}
            interactive={true}
            parallax={true}
        />
      </div>

      {/* Persistent Navigation for Dashboard/Profile */}
      {showNavigation && (
          <div className="absolute top-0 left-0 w-full z-50">
             <CardNav
                items={navItems}
                logoText="Course view"
                baseColor="#000000"
                menuColor="#ffffff"
                buttonBgColor="#7c3aed"
                buttonTextColor="#fff"
                ctaLabel="Premium"
                className="font-sans"
            />
          </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full">
         {renderContent()}
      </div>
    </div>
  );
};

export default App;