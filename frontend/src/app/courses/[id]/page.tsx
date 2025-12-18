"use client";

import PageBackground from "@/components/PageBackground";
import {
  getCourse,
  formatDuration,
  CourseResponse,
  CoursePart,
  CourseFile,
} from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
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

// Video Player Component
interface VideoPlayerProps {
  file: CourseFile;
  sectionName: string;
}

function VideoPlayer({ file, sectionName }: VideoPlayerProps) {
  const isVideo = ["mp4", "mkv", "avi", "webm", "mov"].includes(
    file.format.toLowerCase()
  );

  return (
    <div className="flex flex-col py-4 sm:py-6">
      {/* Video Player - SOPRA */}
      <div className="mb-4 sm:mb-6">
        {isVideo ? (
          <div className="w-full">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl shadow-violet-500/10">
              <video
                controls
                controlsList="nodownload"
                className="w-full aspect-video bg-black"
                src={file.url}
                preload="metadata"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
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
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
              {file.name}
            </h2>
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
                  className="flex items-center gap-1 text-xs text-white/40 hover:text-violet-400 transition-colors"
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
}

// Empty state when no file is selected
function EmptyVideoState() {
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
}

// Collapsible Section Component - Now showing FILES instead of sub-parts
interface SectionItemProps {
  section: FlattenedPart;
  files: CourseFile[];
  isExpanded: boolean;
  onToggle: () => void;
  selectedFileUrl: string | null;
  onFileSelect: (file: CourseFile, sectionName: string) => void;
  searchQuery: string;
}

function SectionItem({
  section,
  files,
  isExpanded,
  onToggle,
  selectedFileUrl,
  onFileSelect,
  searchQuery,
}: SectionItemProps) {
  // Filter files by search query
  const filteredFiles = searchQuery
    ? files.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files;

  // If searching and no files match, hide section
  if (searchQuery && filteredFiles.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-white/5 last:border-b-0">
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
      >
        {/* Expand/Collapse Arrow */}
        <svg
          className={`w-4 h-4 text-white/40 transition-transform flex-shrink-0 ${
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

              return (
                <button
                  key={idx}
                  onClick={() => onFileSelect(file, section.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 pl-11 text-left transition-colors ${
                    isSelected
                      ? "bg-violet-500/20 border-l-2 border-violet-500"
                      : "hover:bg-white/5 border-l-2 border-transparent"
                  }`}
                >
                  {/* Video/File Icon */}
                  {isVideo ? (
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
                      isSelected ? "text-white font-medium" : "text-white/70"
                    }`}
                  >
                    {file.name}
                  </span>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {file.duration > 0 && (
                      <span className="text-xs text-white/40">
                        {formatDuration(file.duration)}
                      </span>
                    )}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        isSelected
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      if (!courseId || isNaN(courseId)) {
        setError("ID corso non valido");
        setIsLoading(false);
        return;
      }

      try {
        console.log(`[CourseViewer] Fetching course ${courseId}...`);
        const data = await getCourse(courseId);

        if (!data) {
          setError("Corso non trovato");
        } else {
          setCourse(data);
        }
      } catch (err) {
        console.error("[CourseViewer] Error:", err);
        setError("Errore nel caricamento del corso");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourse();
  }, [courseId]);

  // Flatten parts for navigation
  const flattenedParts = useMemo(() => {
    if (!course) return [];
    return flattenParts(course.courseResources.parts);
  }, [course]);

  // Get sections (level 0 parts)
  const sections = useMemo(() => getSections(flattenedParts), [flattenedParts]);

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

  // Toggle section expansion
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev || []);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Select a file to play
  const selectFile = useCallback(
    (file: CourseFile, sectionName: string) => {
      setSelectedFile({ file, sectionName });
      // Close sidebar on mobile when file is selected
      setIsSidebarOpen(false);
    },
    []
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
  const goToPrevFile = useCallback(() => {
    if (currentFileIndex > 0) {
      const prev = allFiles[currentFileIndex - 1];
      setSelectedFile(prev);
    }
  }, [currentFileIndex, allFiles]);

  const goToNextFile = useCallback(() => {
    if (currentFileIndex < allFiles.length - 1) {
      const next = allFiles[currentFileIndex + 1];
      setSelectedFile(next);
    }
  }, [currentFileIndex, allFiles]);

  if (isLoading) {
    return (
      <div className="relative h-screen overflow-hidden bg-black">
        <PageBackground />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
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
      {/* Strong blur overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />

      <main className="relative z-10 h-full flex flex-col">
        {/* Top Header Bar with Navigation */}
        <header className="flex-shrink-0 px-4 md:px-6 py-3 border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-between max-w-[1800px] mx-auto">
            {/* Left: Navigation */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
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
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
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
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
              className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 animate-in fade-in duration-200"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar - Drawer on mobile, fixed on desktop */}
          <aside
            className={`
              fixed md:relative inset-y-0 left-0 z-50
              w-[280px] sm:w-[320px] md:w-[340px]
              flex-shrink-0 border-r border-white/10 bg-black/95 md:bg-black/40 backdrop-blur-xl flex flex-col
              transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
          >
            {/* Mobile Close Button */}
            <div className="md:hidden flex-shrink-0 px-4 py-3 border-b border-white/10">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center justify-between text-white/60 hover:text-white transition-colors"
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
                <span className="text-white font-medium">0/{totalFiles}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                  style={{ width: "0%" }}
                />
              </div>
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
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Sections List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {sections.map((section) => (
                <SectionItem
                  key={section.id}
                  section={section}
                  files={getAllFilesForSection(flattenedParts, section.id)}
                  isExpanded={(expandedSections || new Set()).has(section.id)}
                  onToggle={() => toggleSection(section.id)}
                  selectedFileUrl={selectedFile?.file.url || null}
                  onFileSelect={selectFile}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          </aside>

          {/* Main Video Player Area - Scrollable */}
          <section className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 bg-black/20 backdrop-blur-lg">
            <div className="w-full max-w-6xl mx-auto">
              {selectedFile ? (
                <VideoPlayer
                  file={selectedFile.file}
                  sectionName={selectedFile.sectionName}
                />
              ) : (
                <EmptyVideoState />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
