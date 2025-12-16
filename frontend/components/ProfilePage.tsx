import React, { useState, useEffect } from 'react';
import { User, Mail, Save, X, Camera, Loader2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types.ts';
import { api } from '../services/api.ts';

interface ProfilePageProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep form data in sync with user prop when not editing
  useEffect(() => {
    if (!isEditing && user) {
      setFormData(user);
    }
  }, [user, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
        const updated = await api.updateUser(formData);
        onUpdateUser(updated);
        setIsEditing(false);
    } catch (e: any) {
        console.error("Failed to update profile", e);
        setError(e.message || "Failed to update profile details. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  // Safe fallback for initials
  const getInitials = (name?: string) => {
      return name ? name.substring(0, 2).toUpperCase() : '??';
  };

  if (!user) {
      return (
          <div className="h-full flex items-center justify-center text-gray-400">
              <Loader2 className="animate-spin mr-2" /> Loading profile...
          </div>
      );
  }

  return (
    <div className="h-full bg-transparent flex flex-col font-sans text-gray-200 overflow-y-auto custom-scrollbar">
        <div className="flex-1 p-6 md:p-12 flex justify-center">
            <div className="w-full max-w-2xl animate-fade-in-up">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                    <p className="text-gray-400">Manage your account information and preferences.</p>
                </div>

                <div className="bg-[#161b22]/80 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-900/20 border border-red-900/50 text-red-200 px-4 py-3 rounded-lg text-sm flex items-start">
                                <AlertCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center space-x-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 p-1">
                                        <div className="w-full h-full rounded-full bg-[#161b22] flex items-center justify-center border-4 border-[#161b22] overflow-hidden">
                                            <span className="text-3xl font-bold text-white uppercase">{getInitials(formData.username)}</span>
                                        </div>
                                    </div>
                                    <button className="absolute bottom-0 right-0 bg-gray-700 hover:bg-gray-600 p-2 rounded-full border-4 border-[#161b22] transition-colors cursor-not-allowed" title="Upload photo (coming soon)">
                                        <Camera size={16} className="text-white" />
                                    </button>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{user.username || 'Guest User'}</h2>
                                    <p className="text-gray-500 text-sm">Student Account</p>
                                </div>
                            </div>
                            
                            {!isEditing && (
                                <button
                                    onClick={() => {
                                        setError(null);
                                        setFormData(user); 
                                        setIsEditing(true);
                                    }}
                                    className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-gray-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Username</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User size={16} className="text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.username || ''}
                                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                                            className="w-full bg-[#0d1117] border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-gray-600"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail size={16} className="text-gray-500" />
                                        </div>
                                        <input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-[#0d1117] border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-gray-600"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 pt-4 border-t border-gray-800">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex items-center px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-900/20 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 size={18} className="animate-spin mr-2"/> : <Save size={18} className="mr-2"/>}
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setError(null);
                                            setFormData(user);
                                        }}
                                        disabled={isLoading}
                                        className="flex items-center px-6 py-2.5 bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-lg font-medium transition-colors"
                                    >
                                        <X size={18} className="mr-2"/>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl bg-[#0d1117]/50 border border-gray-800">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Username</span>
                                        <div className="flex items-center text-gray-200">
                                            <User size={16} className="mr-2 text-purple-400" />
                                            {user.username || 'Not set'}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-[#0d1117]/50 border border-gray-800">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Email Address</span>
                                        <div className="flex items-center text-gray-200">
                                            <Mail size={16} className="mr-2 text-purple-400" />
                                            {user.email || 'Not set'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;