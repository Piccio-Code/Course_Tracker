import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Terminal, ArrowLeft } from 'lucide-react';
import { Course, Module, Lesson } from '../types.ts';

interface SidebarProps {
  course: Course;
  activeLessonId: string;
  onSelectLesson: (lesson: Lesson, module: Module) => void;
  onClose: () => void;
  onBackToDashboard: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ course, activeLessonId, onSelectLesson, onClose, onBackToDashboard }) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-1': true, // Open first module by default
    'mod-2': false,
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  return (
    <div className="w-80 flex flex-col bg-[#0f1115] border-r border-gray-800 h-full overflow-hidden flex-shrink-0">
      
      {/* Back Button */}
      <div className="p-2 border-b border-gray-800 bg-[#0d1117]">
          <button 
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors w-full text-sm font-medium"
          >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
          </button>
      </div>

      {/* Sidebar Header */}
      <button 
        onClick={onClose}
        className="w-full p-5 border-b border-gray-800 flex items-center space-x-3 hover:bg-gray-800/50 transition-colors text-left group"
        title="Hide Sidebar"
      >
        <div className="text-white group-hover:text-purple-400 transition-colors">
          <Terminal size={24} className="text-gray-200 group-hover:text-purple-400 transition-colors" />
        </div>
        <h1 className="font-semibold text-gray-100 leading-tight group-hover:text-white transition-colors">
          {course.title}
        </h1>
      </button>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {course.modules.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
                No modules available yet.
            </div>
        )}
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
              <div className="bg-[#0f1115] pb-2 transition-all duration-300 ease-in-out">
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
                      {lesson.duration && (
                        <span className={`text-xs ml-2 tabular-nums flex-shrink-0 ${isActive ? 'text-purple-400 font-medium' : 'text-gray-600'}`}>
                          {lesson.duration}
                        </span>
                      )}
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