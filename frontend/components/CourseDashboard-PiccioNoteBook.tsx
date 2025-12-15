import React, { useState } from 'react';
import { Course } from '../types.ts';
import { Plus, Play, MoreVertical, BookOpen, Clock, BarChart } from 'lucide-react';

interface CourseDashboardProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onAddCourse: (name: string, url: string) => Promise<boolean>;
}

const CourseDashboard: React.FC<CourseDashboardProps> = ({ courses, onSelectCourse, onAddCourse }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseUrl, setNewCourseUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName || !newCourseUrl) return;

    setIsSubmitting(true);
    setError(null);

    const success = await onAddCourse(newCourseName, newCourseUrl);
    
    setIsSubmitting(false);

    if (success) {
      setNewCourseName('');
      setNewCourseUrl('');
      setIsModalOpen(false);
    } else {
      // On error, keep the name but clear the URL so user can fix it
      setNewCourseUrl('');
      setError('Failed to create course. Please check the URL and try again.');
    }
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar p-8 lg:p-12 relative z-10">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-12 animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">My Learning</h1>
          <p className="text-gray-400">Manage your progress and explore new technologies.</p>
        </div>
        <div className="flex space-x-4">
             {/* Stats could go here */}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
        
        {/* Existing Courses */}
        {courses.map((course) => (
          <div 
            key={course.id}
            onClick={() => onSelectCourse(course)}
            className="group relative bg-[#161b22] border border-gray-800 hover:border-gray-600 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/10"
          >
            {/* Thumbnail */}
            <div className={`h-40 w-full bg-gradient-to-br ${course.thumbnailGradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                {/* Abstract decorative circles */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-black/20 rounded-full blur-xl"></div>
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="bg-black/30 backdrop-blur-md text-xs font-medium px-2 py-1 rounded text-white border border-white/10">
                        {course.totalLessons > 0 ? `${course.totalLessons} Lessons` : 'Draft'}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                        <Play size={18} className="text-black ml-1" fill="currentColor" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-100 mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2 h-10">{course.description}</p>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                            style={{ width: `${course.progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
          </div>
        ))}

        {/* Add New Course Card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group flex flex-col items-center justify-center h-[340px] border-2 border-dashed border-gray-800 hover:border-purple-500/50 hover:bg-gray-800/30 rounded-xl transition-all duration-300 gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-purple-500/20 flex items-center justify-center transition-colors">
            <Plus size={32} className="text-gray-500 group-hover:text-purple-400" />
          </div>
          <span className="text-gray-400 group-hover:text-white font-medium">Add New Course</span>
        </button>
      </div>

      {/* Add Course Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#161b22] border border-gray-700 w-full max-w-md rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold text-white mb-4">Create New Course</h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Course Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                            placeholder="e.g. Advanced Golang Patterns"
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">URL Link</label>
                        <input 
                            type="url"
                            className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                            placeholder="https://onedrive.com/..."
                            value={newCourseUrl}
                            onChange={(e) => setNewCourseUrl(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button 
                            type="button"
                            onClick={() => { setIsModalOpen(false); setError(null); }}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={!newCourseName || !newCourseUrl || isSubmitting}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default CourseDashboard;