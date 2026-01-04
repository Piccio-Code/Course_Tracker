"use client";

import PageBackground from "@/components/PageBackground";
import {
  getCourse,
  formatDuration,
  getCourseProgress,
  saveCourseProgress,
  deleteCourseProgress,
  API_BASE_URL,
  CourseResponse,
  CoursePart,
  CourseFile,
  ResourceProgress,
} from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback, useRef, startTransition, memo } from "react";
import Link from "next/link";

// Flatten course parts into a navigable list
interface FlattenedPart {
  id: string;
  name: string;
  fullPath: string;
  level: number;
  duration: number;
  files: CourseFile[] | null;
  part: CoursePart;
  parentId: string | null;
}

// Natural sort function to sort parts numerically (1, 2, 3, ... 10, 11)
function naturalSort(a: CoursePart, b: CoursePart): number {
  const regex = /(\d+)|(\D+)/g;
  const aParts = a.name.match(regex) || [];
  const bParts = b.name.match(regex) || [];

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || "";
    const bPart = bParts[i] || "";

    // If both parts are numeric, compare as numbers
    if (/^\d+$/.test(aPart) && /^\d+$/.test(bPart)) {
      const diff = parseInt(aPart, 10) - parseInt(bPart, 10);
      if (diff !== 0) return diff;
    } else {
      // Otherwise compare as strings
      const diff = aPart.localeCompare(bPart);
      if (diff !== 0) return diff;
    }
  }

  return 0;
}

// Natural sort function for files
function naturalSortFiles(a: CourseFile, b: CourseFile): number {
  const regex = /(\d+)|(\D+)/g;
  const aParts = a.name.match(regex) || [];
  const bParts = b.name.match(regex) || [];

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || "";
    const bPart = bParts[i] || "";

    // If both parts are numeric, compare as numbers
    if (/^\d+$/.test(aPart) && /^\d+$/.test(bPart)) {
      const diff = parseInt(aPart, 10) - parseInt(bPart, 10);
      if (diff !== 0) return diff;
    } else {
      // Otherwise compare as strings
      const diff = aPart.localeCompare(bPart);
      if (diff !== 0) return diff;
    }
  }

  return 0;
}

function flattenParts(
  parts: CoursePart[] | null,
  level: number = 0,
  parentPath: string = "",
  parentId: string | null = null
): FlattenedPart[] {
  if (!parts) return [];

  // Sort parts naturally before processing
  const sortedParts = [...parts].sort(naturalSort);

  const result: FlattenedPart[] = [];

  sortedParts.forEach((part, index) => {
    const currentPath = parentPath ? `${parentPath} > ${part.name}` : part.name;
    const id = `${level}-${index}-${part.name}`;

    // Sort files naturally if they exist
    const sortedFiles = part.files ? [...part.files].sort(naturalSortFiles) : null;

    result.push({
      id,
      name: part.name,
      fullPath: currentPath,
      level,
      duration: part.duration,
      files: sortedFiles,
      part,
      parentId,
    });

    // Recursively add sub-parts
    if (part["sub-parts"] && part["sub-parts"].length > 0) {
      result.push(...flattenParts(part["sub-parts"], level + 1, currentPath, id));
    }
  });

  return result;
}

// Get section parts (level 0 parts that act as sections)
function getSections(flattenedParts: FlattenedPart[]): FlattenedPart[] {
  return flattenedParts.filter((p) => p.level === 0);
}

// Get ALL files for a section (including from sub-parts)
function getAllFilesForSection(
  flattenedParts: FlattenedPart[],
  sectionId: string
): CourseFile[] {
  const sectionIndex = flattenedParts.findIndex((p) => p.id === sectionId);
  if (sectionIndex === -1) return [];

  const allFiles: CourseFile[] = [];
  
  // Add files from the section itself
  const section = flattenedParts[sectionIndex];
  if (section.files) {
    allFiles.push(...section.files);
  }

  // Add files from all sub-parts until the next section
  for (let i = sectionIndex + 1; i < flattenedParts.length; i++) {
    const part = flattenedParts[i];
    if (part.level === 0) break; // Next section
    if (part.files) {
      allFiles.push(...part.files);
    }
  }

  return allFiles;
}

// Count total video files in the course
function countTotalFiles(flattenedParts: FlattenedPart[]): number {
  let count = 0;
  flattenedParts.forEach((part) => {
    if (part.files) {
      count += part.files.length;
    }
  });
  return count;
}

// Video Player Component - Memoized for performance
interface VideoPlayerProps {
  file: CourseFile;
  sectionName: string;
  videoKey: number;
  onUnauthorized: () => void;
  onVideoComplete: (url: string, watchedTime: number) => void;
  onVideoProgress: (url: string, currentTime: number) => void;
  onToggleComplete: (url: string, currentIsCompleted: boolean) => void;
  initialTime?: number;
  isCompleted?: boolean;
}

const VideoPlayer = memo(function VideoPlayer({ file, sectionName, videoKey, onUnauthorized, onVideoComplete, onVideoProgress, onToggleComplete, initialTime = 0, isCompleted = false }: VideoPlayerProps) {
  const isVideo = ["mp4", "mkv", "avi", "webm", "mov"].includes(
    file.format.toLowerCase()
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set initial time when video is loaded
  useEffect(() => {
    if (videoRef.current && initialTime > 0) {
      videoRef.current.currentTime = initialTime / 1000; // Convert ms to seconds
    }
  }, [initialTime, videoKey]);

  // Handle video pause - save progress when user pauses
  const handleVideoPause = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const currentTime = video.currentTime * 1000; // Convert to milliseconds
    console.log('[VideoPlayer] Video paused, saving progress:', currentTime);
    onVideoProgress(file.url, currentTime);
  }, [file.url, onVideoProgress]);

  // Handle video seeking - save progress when user changes video position
  const handleVideoSeeking = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const currentTime = video.currentTime * 1000; // Convert to milliseconds
    console.log('[VideoPlayer] Video seeking, saving progress:', currentTime);
    onVideoProgress(file.url, currentTime);
  }, [file.url, onVideoProgress]);

  // Handle video ended
  const handleVideoEnded = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const duration = video.duration * 1000; // Convert to milliseconds
      onVideoComplete(file.url, duration);
    }
  }, [file.url, onVideoComplete]);

  return (
    <div className="flex flex-col py-4 sm:py-6">
      {/* Video Player - SOPRA */}
      <div className="mb-4 sm:mb-6">
        {isVideo ? (
          <div className="w-full">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl shadow-violet-500/10">
              <video
                ref={videoRef}
                key={videoKey}
                controls
                controlsList="nodownload"
                className="w-full aspect-video bg-black"
                src={file.url}
                preload="metadata"
                onPause={handleVideoPause}
                onSeeking={handleVideoSeeking}
                onEnded={handleVideoEnded}
              >
                <source src={file.url} type={`video/${file.format.toLowerCase()}`} />
                Il tuo browser non supporta la riproduzione video.
              </video>
            </div>
          </div>
        ) : (
          // Non-video file
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-white/50 text-lg mb-4">File non video</p>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-shadow duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Apri File
            </a>
          </div>
        )}
      </div>

      {/* Video Info Header - SOTTO */}
      <div className="flex-shrink-0">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-white/50 mb-1">{sectionName}</p>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight flex-1 min-w-0 truncate">
                {file.name}
              </h2>
              {/* Pulsante Toggle Completamento */}
              <button
                onClick={() => onToggleComplete(file.url, isCompleted)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                  isCompleted
                    ? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400 active:scale-95"
                    : "bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 hover:text-white active:scale-95"
                }`}
                title={isCompleted ? "Clicca per rimuovere completamento" : "Marca come già visto"}
              >
                {isCompleted ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Completato</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="hidden sm:inline">Già Visto</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="flex items-center gap-1.5 text-xs sm:text-sm text-violet-400">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatDuration(file.duration)}
              </span>
              <span className="text-xs px-2 py-0.5 sm:py-1 rounded bg-white/10 text-white/60 uppercase">
                {file.format}
              </span>
              {isVideo && (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-white/40 hover:text-violet-400 transition-colors duration-150"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span className="hidden sm:inline">Apri in nuova finestra</span>
                  <span className="sm:hidden">Apri</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Empty state when no file is selected - Memoized
const EmptyVideoState = memo(function EmptyVideoState() {
  return (
    <div className="h-full min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
          Seleziona un video
        </h3>
        <p className="text-sm sm:text-base text-white/50 text-center max-w-sm mx-auto px-4">
          Scegli un video dalla lista per iniziare a guardare
        </p>
      </div>
    </div>
  );
});

// Collapsible Section Component - Memoized for performance
interface SectionItemProps {
  section: FlattenedPart;
  files: CourseFile[];
  isExpanded: boolean;
  onToggle: () => void;
  selectedFileUrl: string | null;
  onFileSelect: (file: CourseFile, sectionName: string) => void | Promise<void>;
  debouncedSearchQuery: string;
  videoProgress: Map<string, ResourceProgress>;
}

const SectionItem = memo(function SectionItem({
  section,
  files,
  isExpanded,
  onToggle,
  selectedFileUrl,
  onFileSelect,
  debouncedSearchQuery,
  videoProgress,
}: SectionItemProps) {
  // Filter files by search query - using debounced value
  const filteredFiles = useMemo(() => {
    if (!debouncedSearchQuery) return files;
    const query = debouncedSearchQuery.toLowerCase();
    return files.filter((f) => f.name.toLowerCase().includes(query));
  }, [files, debouncedSearchQuery]);

  // If searching and no files match, hide section
  if (debouncedSearchQuery && filteredFiles.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-white/5 last:border-b-0">
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-100 text-left"
      >
        {/* Expand/Collapse Arrow */}
        <svg
          className={`w-4 h-4 text-white/40 transition-transform duration-150 flex-shrink-0 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>

        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate text-sm">
            {section.name}
          </p>
          <p className="text-white/40 text-xs mt-0.5">
            {files.length} {files.length === 1 ? "video" : "video"}
            {section.duration > 0 && ` • ${formatDuration(section.duration)}`}
          </p>
        </div>
      </button>

      {/* Files List */}
      {isExpanded && (
        <div className="bg-black/20">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file, idx) => {
              const isSelected = selectedFileUrl === file.url;
              const isVideo = ["mp4", "mkv", "avi", "webm", "mov"].includes(
                file.format.toLowerCase()
              );
              const progress = videoProgress.get(file.url);
              const isCompleted = progress?.completed || false;
              const hasProgress = progress && progress.time_watched && progress.time_watched > 0 && !isCompleted;

              return (
                <button
                  key={idx}
                  onClick={() => onFileSelect(file, section.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 pl-11 text-left transition-colors duration-100 ${
                    isSelected
                      ? "bg-violet-500/20 border-l-2 border-violet-500"
                      : "hover:bg-white/5 border-l-2 border-transparent"
                  }`}
                >
                  {/* Completion/Progress Icon */}
                  {isCompleted ? (
                    // Video completato - icona verde
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : hasProgress ? (
                    // Video parzialmente guardato - icona giallo/arancione
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : isVideo ? (
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${
                        isSelected ? "text-violet-400" : "text-white/40"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${
                        isSelected ? "text-violet-400" : "text-white/40"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  )}

                  <span
                    className={`flex-1 truncate text-sm ${
                      isCompleted 
                        ? "text-green-400/80 line-through" 
                        : hasProgress
                        ? "text-amber-400/90"
                        : isSelected 
                        ? "text-white font-medium" 
                        : "text-white/70"
                    }`}
                  >
                    {file.name}
                  </span>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {file.duration > 0 && (
                      <span className={`text-xs ${
                        isCompleted ? "text-green-400/60" :
                        hasProgress ? "text-amber-400/60" :
                        "text-white/40"
                      }`}>
                        {formatDuration(file.duration)}
                      </span>
                    )}
                    {hasProgress && !isCompleted && progress && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">
                        {Math.round((progress.time_watched! / file.duration) * 100)}%
                      </span>
                    )}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        isCompleted
                          ? "bg-green-500/20 text-green-400"
                          : hasProgress
                          ? "bg-amber-500/20 text-amber-400"
                          : isSelected
                          ? "bg-violet-500/30 text-violet-300"
                          : "bg-white/10 text-white/50"
                      } uppercase`}
                    >
                      {file.format}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-3 pl-11 text-white/40 text-sm">
              Nessun video disponibile
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// Custom hook for debounced value
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function CourseViewerPage() {
  const params = useParams();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    file: CourseFile;
    sectionName: string;
  } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string> | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 200); // Debounce search for 200ms
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [videoKey, setVideoKey] = useState(0);
  const [videoProgress, setVideoProgress] = useState<Map<string, ResourceProgress>>(new Map());
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const hasNavigatedToFirstIncomplete = useRef(false);
  const [authCountdown, setAuthCountdown] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCourseAndProgress() {
      if (!courseId || isNaN(courseId)) {
        setError("ID corso non valido");
        setIsLoading(false);
        return;
      }

      try {
        console.log(`[CourseViewer] Fetching course ${courseId}...`);
        
        // Fetch course and progress in parallel
        const [courseData, progressData] = await Promise.all([
          getCourse(courseId),
          getCourseProgress(courseId),
        ]);

        if (!courseData) {
          setError("Corso non trovato");
        } else {
          setCourse(courseData);
          
          // Build progress map
          const progressMap = new Map<string, ResourceProgress>();
          const completed = new Set<string>();
          
          progressData.forEach(p => {
            if (p.url) {
              progressMap.set(p.url, p);
              if (p.completed) {
                completed.add(p.url);
              }
            }
          });
          
          setVideoProgress(progressMap);
          setCompletedVideos(completed);
          
          console.log(`[CourseViewer] Progress loaded:`, {
            totalProgress: progressData.length,
            completedCount: completed.size,
          });
        }
      } catch (err) {
        console.error("[CourseViewer] Error:", err);
        setError("Errore nel caricamento del corso");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourseAndProgress();
  }, [courseId]);

  // Flatten parts for navigation
  const flattenedParts = useMemo(() => {
    if (!course) return [];
    return flattenParts(course.courseResources.parts);
  }, [course]);

  // Get sections (level 0 parts)
  const sections = useMemo(() => getSections(flattenedParts), [flattenedParts]);

  // Pre-compute sections with their files to avoid repeated calculations in render
  const sectionsWithFiles = useMemo(() => {
    return sections.map((section) => ({
      section,
      files: getAllFilesForSection(flattenedParts, section.id),
    }));
  }, [sections, flattenedParts]);

  // Total files count
  const totalFiles = useMemo(
    () => countTotalFiles(flattenedParts),
    [flattenedParts]
  );

  // Initialize expanded sections when course loads - expand first section by default
  useEffect(() => {
    if (course && expandedSections === null) {
      const parts = flattenParts(course.courseResources.parts);
      const firstSection = parts.find((p) => p.level === 0);
      if (firstSection) {
        setExpandedSections(new Set([firstSection.id]));
      } else {
        setExpandedSections(new Set());
      }
    }
  }, [course, expandedSections]);

  // Toggle section expansion - using startTransition for non-urgent updates
  const toggleSection = useCallback((sectionId: string) => {
    startTransition(() => {
      setExpandedSections((prev) => {
        const newSet = new Set(prev || []);
        if (newSet.has(sectionId)) {
          newSet.delete(sectionId);
        } else {
          newSet.add(sectionId);
        }
        return newSet;
      });
    });
  }, []);

  // Helper function to save current video progress
  const saveCurrentVideoProgress = useCallback(async () => {
    if (!selectedFile) return;
    
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (!videoElement) return;
    
    const currentTime = videoElement.currentTime * 1000; // Convert to milliseconds
    const isCompleted = completedVideos.has(selectedFile.file.url);
    
    // Don't save if video is already completed
    if (isCompleted) return;
    
    // Only save if there's meaningful progress (more than 1 second)
    if (currentTime < 1000) return;
    
    console.log(`[CourseViewer] Saving progress on video change/exit:`, selectedFile.file.name, currentTime);
    
    // Check if progress already exists
    const existingProgress = videoProgress.get(selectedFile.file.url);
    const isExisting = existingProgress !== undefined;
    
    // Update local state
    setVideoProgress(prev => new Map(prev).set(selectedFile.file.url, { 
      ...prev.get(selectedFile.file.url),
      time_watched: currentTime,
      url: selectedFile.file.url
    }));
    
    // Save to backend
    const result = await saveCourseProgress(courseId, selectedFile.file.url, Math.round(currentTime), false, isExisting);
    if (!result.success) {
      console.error(`[CourseViewer] Error saving progress:`, result.error);
    }
  }, [selectedFile, completedVideos, videoProgress, courseId]);

  // Select a file to play
  const selectFile = useCallback(
    async (file: CourseFile, sectionName: string) => {
      // Save progress of current video before changing
      await saveCurrentVideoProgress();
      
      setSelectedFile({ file, sectionName });
      // Close sidebar on mobile when file is selected
      setIsSidebarOpen(false);
      // Reset unauthorized state when selecting a new file
      setIsUnauthorized(false);
    },
    [saveCurrentVideoProgress]
  );

  // Get all files as a flat list for navigation
  const allFiles = useMemo(() => {
    const filesList: Array<{ file: CourseFile; sectionName: string }> = [];
    sections.forEach((section) => {
      const files = getAllFilesForSection(flattenedParts, section.id);
      files.forEach((file) => {
        filesList.push({ file, sectionName: section.name });
      });
    });
    return filesList;
  }, [sections, flattenedParts]);

  // Current file index for prev/next navigation
  const currentFileIndex = useMemo(() => {
    if (!selectedFile) return -1;
    return allFiles.findIndex((f) => f.file.url === selectedFile.file.url);
  }, [allFiles, selectedFile]);

  // Navigate to prev/next file
  const goToPrevFile = useCallback(async () => {
    if (currentFileIndex > 0) {
      // Save progress before changing video
      await saveCurrentVideoProgress();
      const prev = allFiles[currentFileIndex - 1];
      setSelectedFile(prev);
    }
  }, [currentFileIndex, allFiles, saveCurrentVideoProgress]);

  const goToNextFile = useCallback(async () => {
    if (currentFileIndex < allFiles.length - 1) {
      // Save progress before changing video
      await saveCurrentVideoProgress();
      const next = allFiles[currentFileIndex + 1];
      setSelectedFile(next);
    }
  }, [currentFileIndex, allFiles, saveCurrentVideoProgress]);

  // Auto-navigate to first incomplete video
  useEffect(() => {
    if (course && allFiles.length > 0 && !hasNavigatedToFirstIncomplete.current && !selectedFile) {
      // Find first incomplete video
      const firstIncomplete = allFiles.find(({ file }) => !completedVideos.has(file.url));
      
      if (firstIncomplete) {
        console.log(`[CourseViewer] Auto-navigating to first incomplete video:`, firstIncomplete.file.name);
        setSelectedFile(firstIncomplete);
        
        // Expand the section containing this video
        const sectionToExpand = sections.find(s => s.name === firstIncomplete.sectionName);
        if (sectionToExpand) {
          setExpandedSections(prev => new Set([...(prev || []), sectionToExpand.id]));
        }
      } else if (allFiles.length > 0) {
        // All videos completed, go to first video
        console.log(`[CourseViewer] All videos completed, going to first video`);
        setSelectedFile(allFiles[0]);
      }
      
      hasNavigatedToFirstIncomplete.current = true;
    }
  }, [course, allFiles, completedVideos, sections, selectedFile]);

  // Memoized callback for video unauthorized state
  const handleUnauthorized = useCallback(() => {
    setIsUnauthorized(true);
    setAuthCountdown(8); // Start 8 second countdown to force reading
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (authCountdown !== null && authCountdown > 0) {
      const timer = setTimeout(() => {
        setAuthCountdown(authCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (authCountdown === 0) {
      setAuthCountdown(null);
    }
  }, [authCountdown]);

  // Block sidebar scroll when unauthorized overlay is shown
  useEffect(() => {
    // Find the scrollable sections list inside the sidebar
    const sidebar = document.querySelector('aside');
    const sectionsList = sidebar?.querySelector('.overflow-y-auto');
    
    if (sectionsList) {
      if (isUnauthorized) {
        // Block scrolling
        sectionsList.classList.remove('overflow-y-auto');
        sectionsList.classList.add('overflow-hidden');
      } else {
        // Restore scrolling
        sectionsList.classList.remove('overflow-hidden');
        sectionsList.classList.add('overflow-y-auto');
      }
    }

    return () => {
      if (sectionsList) {
        sectionsList.classList.remove('overflow-hidden');
        sectionsList.classList.add('overflow-y-auto');
      }
    };
  }, [isUnauthorized]);

  // Handle video completion
  const handleVideoComplete = useCallback(async (url: string, watchedTime: number) => {
    if (completedVideos.has(url)) return; // Already marked as completed
    
    console.log(`[CourseViewer] Video completed:`, url);
    
    // Check if progress already exists
    const existingProgress = videoProgress.get(url);
    const isExisting = existingProgress !== undefined;
    
    // Update local state
    setCompletedVideos(prev => new Set([...prev, url]));
    setVideoProgress(prev => new Map(prev).set(url, { 
      ...prev.get(url),
      completed: true, 
      time_watched: watchedTime,
      url 
    }));
    
    // Save to backend (POST if new, PUT if existing)
    const result = await saveCourseProgress(courseId, url, Math.round(watchedTime), true, isExisting);
    if (!result.success) {
      console.error(`[CourseViewer] Error saving completion:`, result.error);
    }
    
    // DON'T auto-skip to next video - let the video finish naturally
    // The user can manually go to next video if they want
  }, [courseId, completedVideos, videoProgress]);

  // Handle video progress update
  const handleVideoProgress = useCallback(async (url: string, currentTime: number) => {
    if (completedVideos.has(url)) return; // Don't update if already completed
    
    console.log(`[CourseViewer] Saving progress:`, url, currentTime);
    
    // Check if progress already exists
    const existingProgress = videoProgress.get(url);
    const isExisting = existingProgress !== undefined;
    
    // Update local state
    setVideoProgress(prev => new Map(prev).set(url, { 
      ...prev.get(url),
      time_watched: currentTime,
      url 
    }));
    
    // Save to backend (POST if new, PUT if existing) - don't await to avoid blocking
    saveCourseProgress(courseId, url, Math.round(currentTime), false, isExisting).catch(err => {
      console.error(`[CourseViewer] Error saving progress:`, err);
    });
  }, [courseId, completedVideos, videoProgress]);

  // Handle toggle complete (mark as complete or remove completion)
  const handleToggleComplete = useCallback(async (url: string, currentIsCompleted: boolean) => {
    if (currentIsCompleted) {
      // Video è completato → rimuovi il progresso (DELETE)
      console.log(`[CourseViewer] Removing completion for:`, url);
      
      // Update local state first (ottimistic update)
      setCompletedVideos(prev => {
        const newSet = new Set(prev);
        newSet.delete(url);
        return newSet;
      });
      setVideoProgress(prev => {
        const newMap = new Map(prev);
        newMap.delete(url);
        return newMap;
      });
      
      // Call DELETE endpoint
      const result = await deleteCourseProgress(courseId, url);
      if (!result.success) {
        console.error(`[CourseViewer] Error deleting progress:`, result.error);
        // Rollback on error
        setCompletedVideos(prev => new Set([...prev, url]));
        alert("Errore durante la rimozione del completamento");
      }
    } else {
      // Video NON è completato → marca come completato
      console.log(`[CourseViewer] Marking as complete:`, url);
      
      // Find the file to get duration
      const fileData = allFiles.find(f => f.file.url === url);
      if (fileData) {
        await handleVideoComplete(url, fileData.file.duration);
      }
    }
  }, [courseId, allFiles, handleVideoComplete]);


  if (isLoading) {
    return (
      <div className="relative h-screen overflow-hidden bg-black">
        <PageBackground />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <main className="relative z-10 flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-white">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
              <div
                className="absolute inset-2 rounded-full border-2 border-transparent border-t-fuchsia-500 animate-spin"
                style={{ animationDuration: "1.5s" }}
              />
            </div>
            <span className="text-lg text-white/70">Caricamento corso...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="relative h-screen overflow-hidden bg-black">
        <PageBackground />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <main className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mx-auto">
                <svg
                  className="w-12 h-12 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              {error || "Corso non trovato"}
            </h1>
            <p className="text-white/50 mb-8">
              Il corso richiesto non è disponibile o non esiste.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-shadow duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Torna alla Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const courseData = course.courseResources;

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      <PageBackground />
      {/* Optimized overlay - reduced blur for better performance */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <main className="relative z-10 h-full flex flex-col">
        {/* Top Header Bar with Navigation */}
        <header className="flex-shrink-0 px-4 md:px-6 py-3 border-b border-white/10 bg-black/60 backdrop-blur-sm">
          <div className="flex items-center justify-between max-w-[1800px] mx-auto">
            {/* Left: Navigation */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-150"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Back to Dashboard */}
              <Link
                href="/dashboard"
                onClick={async (e) => {
                  e.preventDefault();
                  // Save progress before leaving
                  await saveCurrentVideoProgress();
                  // Navigate to dashboard
                  window.location.href = '/dashboard';
                }}
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-150"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>

              {/* Prev/Next Navigation */}
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={goToPrevFile}
                  disabled={currentFileIndex <= 0}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Video precedente"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={goToNextFile}
                  disabled={currentFileIndex >= allFiles.length - 1}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Video successivo"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Course Title */}
              <div className="flex items-center gap-2 text-xs sm:text-sm overflow-hidden">
                <span className="text-white font-medium truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]">
                  {courseData.name}
                </span>
                {selectedFile && (
                  <>
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-white/30 flex-shrink-0 hidden sm:block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="text-white/50 truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px] hidden sm:inline">
                      {selectedFile.sectionName}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Right: Stats */}
            <div className="hidden lg:flex items-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-violet-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
                <span>
                  {currentFileIndex >= 0 ? currentFileIndex + 1 : 0} / {allFiles.length}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile Sidebar Backdrop */}
          {isSidebarOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/80 z-40 animate-in fade-in duration-150"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar - Drawer on mobile, fixed on desktop */}
          <aside
            className={`
              fixed md:relative inset-y-0 left-0 z-50
              w-[280px] sm:w-[320px] md:w-[340px]
              flex-shrink-0 border-r border-white/10 bg-black/95 md:bg-black/60 backdrop-blur-sm flex flex-col
              transition-transform duration-200 ease-out will-change-transform
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
          >
            {/* Mobile Close Button */}
            <div className="md:hidden flex-shrink-0 px-4 py-3 border-b border-white/10">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center justify-between text-white/60 hover:text-white transition-colors duration-150"
              >
                <span className="text-sm font-medium">Menu</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Progress Header */}
            <div className="flex-shrink-0 px-4 py-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/60 text-sm">Your Progress</span>
                <span className="text-white font-medium">{completedVideos.size}/{totalFiles}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-[width] duration-300"
                  style={{ width: `${totalFiles > 0 ? (completedVideos.size / totalFiles) * 100 : 0}%` }}
                />
              </div>
              {completedVideos.size === totalFiles && totalFiles > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs text-green-400 font-medium">
                    Corso completato!
                  </span>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-shrink-0 px-4 py-3 border-b border-white/5">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-colors duration-150"
                />
              </div>
            </div>

            {/* Sections List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {sectionsWithFiles.map(({ section, files }) => (
                <SectionItem
                  key={section.id}
                  section={section}
                  files={files}
                  isExpanded={(expandedSections || new Set()).has(section.id)}
                  onToggle={() => toggleSection(section.id)}
                  selectedFileUrl={selectedFile?.file.url || null}
                  onFileSelect={selectFile}
                  debouncedSearchQuery={debouncedSearchQuery}
                  videoProgress={videoProgress}
                />
              ))}
            </div>
          </aside>

          {/* Main Video Player Area - Scrollable */}
          <section className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 bg-black/30 relative">
            <div className="w-full max-w-6xl mx-auto">
              {selectedFile ? (
                <VideoPlayer
                  file={selectedFile.file}
                  sectionName={selectedFile.sectionName}
                  videoKey={videoKey}
                  onUnauthorized={handleUnauthorized}
                  onVideoComplete={handleVideoComplete}
                  onVideoProgress={handleVideoProgress}
                  onToggleComplete={handleToggleComplete}
                  initialTime={videoProgress.get(selectedFile.file.url)?.time_watched || 0}
                  isCompleted={completedVideos.has(selectedFile.file.url)}
                />
              ) : (
                <EmptyVideoState />
              )}
            </div>

            {/* Authorization Overlay - Covers only video area */}
            {isUnauthorized && (
              <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
                
                {/* Content */}
                <div className="relative z-10 w-full max-w-lg">
                  <div className="bg-gradient-to-br from-black/95 to-black/90 border border-yellow-500/40 rounded-xl p-6 shadow-2xl shadow-yellow-500/30">
                    <div className="text-center">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
                        <svg
                          className="w-8 h-8 text-yellow-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                        Autorizzazione Richiesta
                      </h3>

                      {/* Description */}
                      <div className="mb-4">
                        <p className="text-white/70 text-sm leading-relaxed">
                          Per accedere ai video, devi prima autenticarti sulla cartella del corso.
                          Clicca sul bottone, accedi alla cartella su OneDrive/SharePoint,
                          poi <strong className="text-yellow-300">chiudi la scheda</strong> e il video si ricaricherà automaticamente.
                        </p>
                      </div>

                      {/* Warning Box - Read Instructions */}
                      {authCountdown !== null && authCountdown > 0 && (
                        <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-2 animate-pulse">
                          <svg
                            className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          <div className="flex-1">
                            <p className="text-yellow-200 font-semibold text-xs sm:text-sm">
                              ⏱️ Leggi attentamente le istruzioni sopra
                            </p>
                            <p className="text-yellow-300/80 text-xs mt-0.5">
                              Potrai procedere tra {authCountdown} second{authCountdown !== 1 ? 'i' : 'o'}...
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (!courseData?.url) return;
                            
                            // Open course folder link in new window/tab
                            const authWindow = window.open(courseData.url, '_blank');
                            
                            if (!authWindow) {
                              // Popup blocked - show message
                              alert('Per favore, consenti i popup per questo sito e riprova.');
                              return;
                            }
                            
                            // Monitor when user closes the auth window
                            const checkInterval = setInterval(() => {
                              if (authWindow.closed) {
                                clearInterval(checkInterval);
                                // Auto-reload video when user closes the auth window
                                console.log('[Auth] Window closed, reloading video...');
                                setTimeout(() => {
                                  setIsUnauthorized(false);
                                  setAuthCountdown(null);
                                  setVideoKey(prev => prev + 1);
                                }, 500);
                              }
                            }, 500);
                            
                            // Cleanup after 15 minutes
                            setTimeout(() => {
                              clearInterval(checkInterval);
                            }, 15 * 60 * 1000);
                          }}
                          disabled={authCountdown !== null && authCountdown > 0}
                          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm sm:text-base transition-all duration-200 ${
                            authCountdown !== null && authCountdown > 0
                              ? 'bg-gray-600 cursor-not-allowed opacity-50'
                              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-100'
                          }`}
                        >
                          {authCountdown !== null && authCountdown > 0 ? (
                            <>
                              <svg
                                className="w-5 h-5 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Attendi {authCountdown}s
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                />
                              </svg>
                              Accedi alla Cartella del Corso
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => {
                            setIsUnauthorized(false);
                            setAuthCountdown(null);
                            setVideoKey(prev => prev + 1);
                          }}
                          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white/80 text-sm font-medium hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-150"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Ho effettuato l&apos;accesso, riprova
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
