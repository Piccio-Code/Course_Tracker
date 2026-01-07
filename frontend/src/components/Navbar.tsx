"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-transform duration-200 group-hover:scale-110">
              <Image
                src="/logo.png"
                alt="CourseTracker Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">
              Course<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Tracker</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              Caratteristiche
            </Link>
            <Link
              href="#how-it-works"
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              Come Funziona
            </Link>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-white/90 hover:text-white transition-colors duration-200"
            >
              Accedi
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/25 transition-[transform,shadow] duration-200 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105"
            >
              Inizia Ora
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-violet-400 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-white/80 hover:text-white transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#features"
                className="text-white/80 hover:text-white transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Caratteristiche
              </Link>
              <Link
                href="#how-it-works"
                className="text-white/80 hover:text-white transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Come Funziona
              </Link>
              <div className="flex flex-col gap-3 mt-4">
                <Link
                  href="/login"
                  className="px-6 py-3 text-center text-white/90 border border-white/30 rounded-full hover:bg-white/10 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Accedi
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-3 text-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/25"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Inizia Ora
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

