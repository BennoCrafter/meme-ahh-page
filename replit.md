# Video Player Application

## Overview

This is a modern video player web application built with React, TypeScript, and Express.js. The application features a full-stack architecture with a React frontend using shadcn/ui components and Tailwind CSS, backed by an Express.js server with PostgreSQL database integration via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Comprehensive shadcn/ui component system with Radix UI primitives

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **Session Storage**: PostgreSQL-based sessions with connect-pg-simple

### Development Setup
- **Package Manager**: npm with lockfile version 3
- **Development Server**: tsx for TypeScript execution in development
- **Build Process**: esbuild for server bundling, Vite for client bundling
- **Hot Reload**: Vite HMR with runtime error overlay

## Key Components

### Video Player Feature
- Custom video player component with full media controls
- Play/pause, volume control, fullscreen, and progress tracking
- Auto-play functionality with muted start for browser compliance
- Responsive design with mobile considerations
- Loading states and error handling

### UI Component Library
- Complete shadcn/ui implementation with 40+ components
- Radix UI primitives for accessibility and behavior
- Class Variance Authority for component variants
- Consistent theming with CSS custom properties
- Dark mode support built-in

### Database Schema
- User management with username/password authentication
- UUID primary keys with PostgreSQL gen_random_uuid()
- Drizzle schema with Zod validation integration
- Type-safe database operations

### Storage Layer
- Abstracted storage interface (IStorage) for flexibility
- In-memory storage implementation for development
- Database storage ready for production (Drizzle integration)
- CRUD operations for user management

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **Server Processing**: Express routes handle requests with middleware logging
3. **Database Operations**: Drizzle ORM provides type-safe database access
4. **Response Handling**: JSON responses with proper error handling
5. **State Management**: TanStack Query caches and manages server state
6. **UI Updates**: React components re-render based on query state changes

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Neon PostgreSQL driver
- **drizzle-orm**: Database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router

### UI & Styling
- **@radix-ui/**: Comprehensive primitive component library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay

## Deployment Strategy

### Build Process
1. **Client Build**: Vite builds React app to `dist/public`
2. **Server Build**: esbuild bundles Express server to `dist/index.js`
3. **Type Checking**: TypeScript compiler validates all code
4. **Database Migration**: Drizzle Kit handles schema migrations

### Production Configuration
- **Environment Variables**: DATABASE_URL for PostgreSQL connection
- **Static File Serving**: Express serves built React app
- **Error Handling**: Centralized error middleware with proper status codes
- **Session Management**: PostgreSQL-backed sessions for scalability

### Development Workflow
- **Hot Reload**: Vite HMR for instant client updates
- **Server Restart**: tsx watches for server file changes
- **Database Updates**: `npm run db:push` for schema synchronization
- **Type Safety**: Shared types between client and server via `shared/` directory

The application is structured as a monorepo with clear separation between client, server, and shared code, making it maintainable and scalable for future development.