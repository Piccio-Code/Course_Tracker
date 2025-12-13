import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { Course, Module, Lesson } from '../types.ts';

interface SidebarProps {
  course: Course;
  activeLessonId: string;
  onSelectLesson: (lesson: Lesson, module: Module) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ course, activeLessonId, onSelectLesson }) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!course.modules.length) return;

    setExpandedModules((prev) => {
      const next: Record<string, boolean> = {};
      course.modules.forEach((module, index) => {
        next[module.id] = prev[module.id] ?? index === 0;
      });
      return next;
    });
  }, [course.modules]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  return (
    <div className="w-80 flex flex-col bg-[#0f1115] border-r border-gray-800 h-full overflow-hidden flex-shrink-0">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-gray-800 flex items-center space-x-3">
        <div className="text-white">
          <Terminal size={24} className="text-gray-200" />
        </div>
        <h1 className="font-semibold text-gray-100 leading-tight">
          {course.title}
        </h1>
      </div>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {course.modules.map((module) => (
          <div key={module.id} className="border-b border-gray-800/50">
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-800/30 transition-colors group"
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                  {module.title}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {module.lessons.length} lessons
                </span>
              </div>
              {expandedModules[module.id] ? (
                <ChevronUp size={16} className="text-gray-500" />
              ) : (
                <ChevronDown size={16} className="text-gray-500" />
              )}
            </button>

            {expandedModules[module.id] && (
              <div className="bg-[#0f1115] pb-2">
                {module.lessons.map((lesson) => {
                  const isActive = lesson.id === activeLessonId;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson, module)}
                      className={`w-full flex items-center justify-between py-3 px-4 pl-6 text-left transition-all border-l-2 ${
                        isActive
                          ? 'bg-gray-800/50 border-purple-500'
                          : 'hover:bg-gray-800/30 border-transparent'
                      }`}
                    >
                      <div className="flex flex-col w-full">
                        <span className={`text-sm ${isActive ? 'text-white font-medium' : 'text-gray-400'}`}>
                          {lesson.title}
                        </span>
                      </div>
                      <span className={`text-xs ml-2 tabular-nums flex-shrink-0 ${isActive ? 'text-purple-400 font-medium' : 'text-gray-600'}`}>
                        {lesson.duration}
                      </span>
                      {/* Status indicator dot */}
                       <div className={`w-1.5 h-1.5 rounded-full ml-3 flex-shrink-0 ${isActive ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-gray-800'}`}></div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
        v2.4.0 &copy; 2024
      </div>
    </div>
  );
};

export default Sidebar;