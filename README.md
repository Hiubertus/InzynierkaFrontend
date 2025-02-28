# E-Learning Platform - Frontend

This repository contains the frontend component of an e-learning platform built as an engineering thesis project. The application is built with Next.js and React, providing a modern and responsive user interface for the e-learning platform.

## Table of Contents

- [Technologies](#technologies)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup & Configuration](#setup--configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)

## Technologies

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI Components
- React Hook Form
- Zod (validation)
- Zustand (state management)
- Axios (API requests)
- DND Kit (drag and drop functionality)

## Features

- **User Authentication**: Login, registration, and profile management
- **Course Browsing**: View available courses, filter, and search functionality
- **Course Creation**: Teachers can create and manage educational content
- **Interactive Learning**: Various content types including text, quizzes, images, and videos
- **Points System**: Virtual currency for purchasing courses
- **Reviews & Ratings**: Rate and review courses, chapters, and teachers
- **Responsive Design**: Fully responsive UI that works on desktop and mobile
- **Drag and Drop Editing**: Intuitive content management for course creators

## Prerequisites

- Node.js 18 or newer
- npm, yarn, pnpm, or bun

## Setup & Configuration

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   NEXT_PUBLIC_BACKEND_ADDRESS=<link to your backend server>
   ```
   For example:
   ```
   NEXT_PUBLIC_BACKEND_ADDRESS=http://localhost:8080
   ```

## Running the Application

To start the development server, run one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

The project follows the standard Next.js structure:

- `app/` - Next.js app directory containing pages and routing
- `components/` - Reusable UI components
- `lib/` - Utility functions and shared logic
- `public/` - Static assets
- `styles/` - Global CSS and Tailwind configuration

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_BACKEND_ADDRESS | URL of the backend API server | http://localhost:8080 |

---

This application is part of an engineering thesis project. For more information or assistance, please refer to the source code documentation or contact the repository owner.