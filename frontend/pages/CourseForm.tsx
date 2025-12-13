import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Link as LinkIcon } from 'lucide-react';
import { CourseService } from '../services/api.ts';

export const CourseForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await CourseService.create({ url: shareUrl });
      navigate('/');
    } catch (error) {
      console.error('Failed to create course', error);
      alert('Failed to create course. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Import Course</h2>
          <p className="mt-2 text-gray-400">Paste a OneDrive shared folder link to ingest course content.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#161616] p-8 rounded-2xl border border-gray-800 shadow-xl space-y-6">
          <div className="space-y-2">
            <label htmlFor="shareUrl" className="block text-sm font-medium text-gray-300">OneDrive shared folder link</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="url"
                name="shareUrl"
                id="shareUrl"
                required
                value={shareUrl}
                onChange={(e) => setShareUrl(e.target.value)}
                className="block w-full pl-10 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-600"
                placeholder="https://1drv.ms/f/s!..."
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Use the folder link containing your course videos and resources.</p>
          </div>

          <div className="pt-4 flex justify-end">
             <button
              type="button"
              onClick={() => navigate('/')}
              className="mr-4 px-6 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (
                <>
                  <Save className="w-4 h-4" />
                  Publish Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
