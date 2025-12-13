import React from 'react';
import { ChevronRight, LayoutPanelLeft } from 'lucide-react';

interface TopBarProps {
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  onToggleSidebar?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ courseTitle, moduleTitle, lessonTitle, onToggleSidebar }) => {
  return (
    <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0f1115] sticky top-0 z-20">
      <div className="flex items-center text-sm text-gray-400 overflow-hidden whitespace-nowrap">
        <button onClick={onToggleSidebar} className="mr-4 lg:hidden text-gray-300">
            <LayoutPanelLeft size={20} />
        </button>
        
        <div className="flex items-center space-x-2">
            <span className="hidden md:block hover:text-gray-200 cursor-pointer transition-colors truncate max-w-[200px]">{courseTitle}</span>
            <ChevronRight size={14} className="hidden md:block text-gray-600 flex-shrink-0" />
            <span className="hover:text-gray-200 cursor-pointer transition-colors truncate max-w-[150px]">{moduleTitle}</span>
            <ChevronRight size={14} className="text-gray-600 flex-shrink-0" />
            <span className="text-gray-100 font-medium truncate">{lessonTitle}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
        <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Log in
        </button>
        <button className="bg-gradient-to-r from-purple-300 to-purple-400 text-gray-900 text-sm font-semibold px-4 py-2 rounded shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 transition-all transform hover:-translate-y-0.5">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default TopBar;