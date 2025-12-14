import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import VideoPlayer from './components/VideoPlayer';
import TopBar from './components/TopBar';
import AIAssistant from './components/AIAssistant';
import CourseDashboard from './components/CourseDashboard';
import { API_BASE_URL, MOCK_API_COURSE_RESPONSE, MOCK_API_LIST_RESPONSE } from './constants.ts';
import { mapCourseResponseToCourse, mapListResponseToCourseSummary } from './utils/mappers';
import { Course, Lesson, Module, API_CourseResponse, API_CoursesListResponse } from './types.ts';

type ViewMode = 'dashboard' | 'player';

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(
    MOCK_API_LIST_RESPONSE.map(mapListResponseToCourseSummary)
  );
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Load courses from backend; fallback to mock if empty or error.
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

  // Ensure first module/lesson selected when course changes.
  useEffect(() => {
    if (activeCourse && !activeModule && activeCourse.modules.length > 0) {
      const mod = activeCourse.modules[0];
      setActiveModule(mod);
      if (mod.lessons.length > 0) {
        setActiveLesson(mod.lessons[0]);
      }
    }
  }, [activeCourse, activeModule]);

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
    setViewMode('player');
  };

  const handleAddCourse = (newCourseData: Partial<Course>) => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: newCourseData.title || 'New Course',
      description: newCourseData.description || 'New course description',
      thumbnailGradient: newCourseData.thumbnailGradient || 'from-slate-700 to-slate-900',
      progress: 0,
      totalLessons: 0,
      modules: [],
    };
    setCourses([...courses, newCourse]);
  };

  const handleSelectLesson = (lesson: Lesson, module: Module) => {
    setActiveLesson(lesson);
    setActiveModule(module);
    setIsVideoPlaying(false);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="relative flex h-screen w-full bg-[#0d1117] overflow-hidden font-sans text-gray-200 selection:bg-purple-500/30">
      {viewMode === 'dashboard' ? (
        <CourseDashboard 
          courses={courses}
          onSelectCourse={handleSelectCourse}
          onAddCourse={handleAddCourse}
        />
      ) : (
        <div className="relative z-10 flex w-full h-full overflow-hidden">
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

          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

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
                      {activeLesson.duration && (
                        <div className="flex items-center space-x-6 text-2xl font-mono text-gray-400 font-light">
                          {activeLesson.duration}
                        </div>
                      )}
                    </div>
                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                      <p className="text-lg">
                        In this lesson, we will dive deep into the concepts of <strong>{activeLesson.title}</strong>. 
                      </p>
                    </div>
                  </div>
                </main>
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

