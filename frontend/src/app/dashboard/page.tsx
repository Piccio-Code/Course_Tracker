"use client";

import PageBackground from "@/components/PageBackground";
import {
  getUser,
  logout,
  getCourses,
  createCourse,
  deleteCourse,
  formatDuration,
  formatDate,
  timeAgo,
  User,
  CoursesListResponse,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, memo } from "react";

// Colori per le card dei corsi (gradient)
const courseColors = [
  { from: "from-violet-500", to: "to-purple-600", glow: "violet" },
  { from: "from-fuchsia-500", to: "to-pink-600", glow: "fuchsia" },
  { from: "from-cyan-500", to: "to-blue-600", glow: "cyan" },
  { from: "from-emerald-500", to: "to-teal-600", glow: "emerald" },
  { from: "from-orange-500", to: "to-amber-600", glow: "orange" },
  { from: "from-rose-500", to: "to-red-600", glow: "rose" },
];

interface CourseCardProps {
  course: CoursesListResponse;
  index: number;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const CourseCard = memo(function CourseCard({ course, index, onClick, onDelete }: CourseCardProps) {
  const colorSet = courseColors[index % courseColors.length];

  return (
    <div
      className="group relative animate-in fade-in slide-in-from-bottom-4 w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${colorSet.from} ${colorSet.to} rounded-2xl blur opacity-0`}
      />

      {/* Card */}
      <div className="relative rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl overflow-hidden cursor-pointer">
        {/* Header gradient bar */}
        <div
          className={`h-1.5 bg-gradient-to-r ${colorSet.from} ${colorSet.to}`}
        />

        {/* Delete button */}
        <button
          onClick={onDelete}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 transition-colors duration-150 opacity-0 group-hover:opacity-100"
          title="Elimina corso"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>

        <div className="p-6">
          {/* Course name */}
          <h3 className="text-xl font-bold text-white mb-4 truncate">
            {course.name}
          </h3>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Durata
              </div>
              <p
                className={`text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r ${colorSet.from} ${colorSet.to}`}
              >
                {formatDuration(course.duration)}
              </p>
            </div>

            {/* Created */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Creato
              </div>
              <p className="text-sm font-medium text-white/80">
                {formatDate(course.created)}
              </p>
            </div>
          </div>

          {/* Footer - Last updated */}
          <div className="mt-5 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">
                Aggiornato {timeAgo(course.lastUpdated)}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${colorSet.from} ${colorSet.to} animate-pulse`}
                />
                <span className="text-xs text-white/50">ID: {course.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
        />
      </div>
    </div>
  );
});

interface EmptyStateProps {
  onAddCourse: () => void;
}

const EmptyState = memo(function EmptyState({ onAddCourse }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Nessun corso</h3>
      <p className="text-white/50 text-center max-w-sm mb-6">
        Non hai ancora aggiunto nessun corso. Inizia ad organizzare il tuo
        percorso di apprendimento!
      </p>
      <button
        onClick={onAddCourse}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-[transform,shadow] duration-200 hover:scale-105 will-change-transform"
      >
        Aggiungi il tuo primo corso
      </button>
    </div>
  );
});

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState = memo(function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
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
      <h3 className="text-xl font-semibold text-white mb-2">
        Errore nel caricamento
      </h3>
      <p className="text-white/50 text-center max-w-sm mb-6">
        Non è stato possibile caricare i corsi. Controlla la connessione e
        riprova.
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition-[transform,shadow] duration-200 hover:scale-105 flex items-center gap-2 will-change-transform"
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
        Riprova
      </button>
    </div>
  );
});

// Modal per creare un nuovo corso - Memoized
interface NewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewCourseModal = memo(function NewCourseModal({ isOpen, onClose, onSuccess }: NewCourseModalProps) {
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!link.trim()) {
      setError("Inserisci un link OneDrive valido");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("[NewCourseModal] Creating course...", { link, name });
      const result = await createCourse(link.trim(), name.trim() || undefined);

      if (result.success) {
        console.log("[NewCourseModal] Course created successfully:", result.data);
        setLink("");
        setName("");
        onSuccess();
        onClose();
      } else {
        console.error("[NewCourseModal] Error creating course:", result.error);
        setError(result.error || "Errore durante la creazione del corso");
      }
    } catch (err) {
      console.error("[NewCourseModal] Exception:", err);
      setError("Errore imprevisto durante la creazione del corso");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setLink("");
      setName("");
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 animate-in zoom-in-95 fade-in duration-200">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-3xl blur-lg opacity-30" />

        <div className="relative rounded-2xl bg-black/95 border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Nuovo Corso</h2>
                <p className="text-sm text-white/50">
                  Aggiungi un corso da OneDrive
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-150 disabled:opacity-50"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* OneDrive Link */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Link OneDrive <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://onedrive.live.com/..."
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-colors duration-150 disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-white/40">
                Incolla il link condiviso della cartella OneDrive contenente il
                corso
              </p>
            </div>

            {/* Course Name (optional) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Nome del corso{" "}
                <span className="text-white/40 font-normal">(opzionale)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Es: React Complete Course"
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-colors duration-150 disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-white/40">
                Se non specificato, verrà usato il nome della cartella
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            )}

            {/* Info box */}
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-violet-300/80">
                  <p className="font-medium text-violet-300 mb-1">
                    Come funziona?
                  </p>
                  <p>
                    Il sistema analizzerà la cartella OneDrive e creerà
                    automaticamente la struttura del corso con tutte le parti e
                    i video.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:border-white/20 transition-colors duration-150 disabled:opacity-50"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !link.trim()}
                className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creazione in corso...
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Crea Corso
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<CoursesListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<CoursesListResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Funzione per caricare i corsi
  const fetchCourses = useCallback(async () => {
    setIsLoadingCourses(true);
    setError(null);

    try {
      console.log("[Dashboard] Fetching courses...");
      const userCourses = await getCourses();
      console.log("[Dashboard] Courses received:", userCourses);
      setCourses(userCourses);
    } catch (err) {
      console.error("[Dashboard] Error fetching courses:", err);
      setError("Impossibile caricare i corsi");
    } finally {
      setIsLoadingCourses(false);
    }
  }, []);

  // Check auth e carica corsi iniziali
  useEffect(() => {
    async function checkAuth() {
      console.log("[Dashboard] Checking authentication...");
      const currentUser = await getUser();

      if (!currentUser) {
        console.log("[Dashboard] User not authenticated, redirecting to login");
        router.push("/login");
        return;
      }

      console.log("[Dashboard] User authenticated:", currentUser);
      setUser(currentUser);

      // Fetch courses
      await fetchCourses();

      setIsLoading(false);
    }

    checkAuth();
  }, [router, fetchCourses]);

  const handleLogout = async () => {
    console.log("[Dashboard] Logging out...");
    await logout();
    router.push("/login");
  };

  const handleRefresh = async () => {
    console.log("[Dashboard] Refreshing courses...");
    await fetchCourses();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCourseCreated = () => {
    console.log("[Dashboard] Course created, refreshing list...");
    fetchCourses();
  };

  // Memoized navigation handler for courses
  const handleCourseClick = useCallback((courseId: number) => {
    router.push(`/courses/${courseId}`);
  }, [router]);

  // Handle delete course - open confirmation modal
  const handleDeleteClick = useCallback((e: React.MouseEvent, course: CoursesListResponse) => {
    e.stopPropagation(); // Prevent card click
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  }, []);

  // Confirm delete course
  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;

    setIsDeleting(true);
    console.log("[Dashboard] Deleting course:", courseToDelete.id);

    const result = await deleteCourse(courseToDelete.id);

    if (result.success) {
      console.log("[Dashboard] Course deleted successfully");
      // Remove course from list
      setCourses(prevCourses => prevCourses.filter(c => c.id !== courseToDelete.id));
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
    } else {
      console.error("[Dashboard] Error deleting course:", result.error);
      alert(result.error || "Errore durante l'eliminazione del corso");
    }

    setIsDeleting(false);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  // Calcola la durata totale di tutti i corsi
  const totalDuration = courses.reduce((acc, c) => acc + c.duration, 0);

  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black">
        <PageBackground />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <main className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-white">
            {/* Animated loader */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
              <div
                className="absolute inset-2 rounded-full border-2 border-transparent border-t-fuchsia-500 animate-spin"
                style={{ animationDuration: "1.5s" }}
              />
            </div>
            <span className="text-lg text-white/70">Caricamento...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <PageBackground />
      {/* Optimized overlay - reduced blur for performance */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <main className="relative z-10 min-h-screen px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between max-w-7xl mx-auto mb-12">
          <h1 className="text-2xl font-bold text-white">
            Course
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Hub
            </span>
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">{user?.username}</p>
              <p className="text-white/60 text-sm">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-white/80 transition-colors duration-150 hover:bg-white/10 hover:border-white/20"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto">
          {/* Stats Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                I tuoi Corsi
              </h2>
              <p className="text-white/50">
                {courses.length > 0
                  ? `${courses.length} cors${courses.length === 1 ? "o" : "i"} in totale`
                  : "Inizia il tuo percorso di apprendimento"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={isLoadingCourses}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/60 transition-colors duration-150 hover:bg-white/10 hover:border-white/20 hover:text-white disabled:opacity-50"
                title="Aggiorna corsi"
              >
                <svg
                  className={`w-5 h-5 ${isLoadingCourses ? "animate-spin" : ""}`}
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
              </button>

              {courses.length > 0 && (
                <>
                  {/* Total duration */}
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider">
                        Totale
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {formatDuration(totalDuration)}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Add course button - always visible */}
              <button
                onClick={handleOpenModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-[transform,shadow] duration-200 hover:scale-105 will-change-transform"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nuovo Corso
              </button>
            </div>
          </div>

          {/* Chroma Grid */}
          <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-8 backdrop-blur-sm">
            {/* Loading overlay for courses */}
            {isLoadingCourses && courses.length > 0 && (
              <div className="mb-4 flex items-center justify-center gap-2 text-white/60">
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-sm">Aggiornamento in corso...</span>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-6">
              {error ? (
                <ErrorState onRetry={handleRefresh} />
              ) : courses.length > 0 ? (
                courses.map((course, index) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    index={index}
                    onClick={() => handleCourseClick(course.id)}
                    onDelete={(e) => handleDeleteClick(e, course)}
                  />
                ))
              ) : isLoadingCourses ? (
                // Loading skeleton
                <>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden animate-pulse"
                    >
                      <div className="h-1.5 bg-white/10" />
                      <div className="p-6">
                        <div className="h-6 bg-white/10 rounded mb-4 w-3/4" />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="h-3 bg-white/5 rounded w-16" />
                            <div className="h-5 bg-white/10 rounded w-12" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-white/5 rounded w-16" />
                            <div className="h-5 bg-white/10 rounded w-20" />
                          </div>
                        </div>
                        <div className="mt-5 pt-4 border-t border-white/5">
                          <div className="h-3 bg-white/5 rounded w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <EmptyState onAddCourse={handleOpenModal} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal per nuovo corso */}
      <NewCourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleCourseCreated}
      />

      {/* Modal di conferma eliminazione */}
      {isDeleteModalOpen && courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md bg-gradient-to-br from-black/95 to-black/90 border border-red-500/30 rounded-2xl p-6 shadow-2xl shadow-red-500/20 animate-in zoom-in-95 duration-200">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-400"
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
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white text-center mb-2">
              Elimina Corso
            </h3>

            {/* Description */}
            <p className="text-white/70 text-center mb-6">
              Sei sicuro di voler eliminare il corso{" "}
              <span className="font-semibold text-white">{courseToDelete.name}</span>?
              <br />
              <span className="text-red-400 text-sm">Questa azione non può essere annullata.</span>
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:border-white/20 transition-colors duration-150 disabled:opacity-50"
              >
                Annulla
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Eliminazione...
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Elimina
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
