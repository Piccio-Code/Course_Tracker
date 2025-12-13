import { Course } from "./types.ts";

export const MOCK_COURSE: Course = {
  id: "go-cli-101",
  title: "Command Line Applications in Go",
  modules: [
    {
      id: "mod-1",
      title: "Introduction",
      lessons: [
        { 
          id: "l-1-1", 
          title: "Introduction to the course", 
          duration: "02:58", 
          isCompleted: false, 
          type: 'video',
          transcript: "Welcome to Command Line Applications in Go. In this course, we will explore how to build robust, fast, and efficient CLI tools using the Go programming language. We'll start by setting up our environment and understanding the basic structure of a Go program."
        },
        { id: "l-1-2", title: "Welcome!", duration: "04:56", isCompleted: false, type: 'video', transcript: "Hi everyone, I'm your instructor. Go is an amazing language for systems programming. Let's talk about why CLI tools matter." },
        { id: "l-1-3", title: "Setting up your environment", duration: "15:27", isCompleted: false, type: 'video', transcript: "Let's install Go. Go to golang.org..." },
        { id: "l-1-4", title: "Go 101: Variables, Values & Types", duration: "24:33", isCompleted: false, type: 'video', transcript: "Variables in Go are statically typed..." },
        { id: "l-1-5", title: "Go 101: Conditionals & Loops", duration: "19:26", isCompleted: false, type: 'video', transcript: "For loops are the only loops in Go..." },
        { id: "l-1-6", title: "Go 101: Functions & Pointers", duration: "17:09", isCompleted: false, type: 'video', transcript: "Functions can return multiple values..." },
        { id: "l-1-7", title: "Go 101: Packages", duration: "12:44", isCompleted: false, type: 'video', transcript: "Packages organize code..." },
      ]
    },
    {
      id: "mod-2",
      title: "Counting Words",
      lessons: [
        { id: "l-2-1", title: "Reading Input", duration: "10:05", isCompleted: false, type: 'video' },
        { id: "l-2-2", title: "String Manipulation", duration: "08:30", isCompleted: false, type: 'video' },
        { id: "l-2-3", title: "Maps and Structs", duration: "14:15", isCompleted: false, type: 'video' },
        { id: "l-2-4", title: "Writing Tests", duration: "12:00", isCompleted: false, type: 'video' },
        { id: "l-2-5", title: "Refactoring", duration: "09:45", isCompleted: false, type: 'video' },
        { id: "l-2-6", title: "Command Flags", duration: "11:20", isCompleted: false, type: 'video' },
        { id: "l-2-7", title: "Finalizing the Word Counter", duration: "06:10", isCompleted: false, type: 'video' },
      ]
    },
    {
      id: "mod-3",
      title: "Input, Output, & Arguments",
      lessons: Array(13).fill(null).map((_, i) => ({ id: `l-3-${i}`, title: `Lesson ${i + 1}`, duration: "10:00", isCompleted: false, type: 'video' }))
    },
    {
      id: "mod-4",
      title: "Adding Features",
      lessons: Array(15).fill(null).map((_, i) => ({ id: `l-4-${i}`, title: `Feature ${i + 1}`, duration: "05:00", isCompleted: false, type: 'video' }))
    },
    {
      id: "mod-5",
      title: "Concurrency & Streams",
      lessons: Array(7).fill(null).map((_, i) => ({ id: `l-5-${i}`, title: `Stream ${i + 1}`, duration: "12:30", isCompleted: false, type: 'video' }))
    },
    {
      id: "mod-6",
      title: "Advanced Testing",
      lessons: Array(8).fill(null).map((_, i) => ({ id: `l-6-${i}`, title: `Test ${i + 1}`, duration: "08:15", isCompleted: false, type: 'video' }))
    },
    {
      id: "mod-7",
      title: "Commands, Signals, & Contexts",
      lessons: Array(11).fill(null).map((_, i) => ({ id: `l-7-${i}`, title: `Signal ${i + 1}`, duration: "11:00", isCompleted: false, type: 'video' }))
    },
    {
      id: "mod-8",
      title: "Filesystem & Networking",
      lessons: Array(14).fill(null).map((_, i) => ({ id: `l-8-${i}`, title: `Network ${i + 1}`, duration: "14:20", isCompleted: false, type: 'video' }))
    }
  ]
};