# Overview

ContentGuard is a real-time content moderation dashboard built with React, Express, and PostgreSQL. The application provides AI-powered content analysis capabilities for detecting potentially harmful content including violence, misinformation, and suspicious marketing materials. It features a modern dashboard interface for monitoring content processing queues, viewing system analytics, and managing moderation workflows in real-time.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React 18 and TypeScript using a modern component-based architecture. The UI leverages shadcn/ui components built on Radix UI primitives for consistent design patterns. TailwindCSS provides utility-first styling with a custom design system featuring CSS variables for theming. The application uses Wouter for client-side routing and TanStack Query for server state management with optimistic updates and real-time data synchronization.

## Backend Architecture
The server implements a REST API using Express.js with TypeScript in ESM module format. The architecture follows a layered pattern with separate concerns for routing, business logic, and data access. WebSocket integration provides real-time updates for content analysis status changes and system metrics. The server includes middleware for request logging, error handling, and JSON parsing.

## Data Storage Solutions
PostgreSQL serves as the primary database with Drizzle ORM providing type-safe database operations and schema management. The database schema includes tables for users, content analyses, system statistics, and activity logs. Neon Database is used as the hosting provider with connection pooling for efficient resource management. Database migrations are handled through Drizzle Kit.

## Authentication and Authorization
The application currently has basic user schema defined but authentication implementation appears to be in development. The user table includes username and password fields, suggesting planned credential-based authentication.

## Real-time Communication
WebSocket connections enable bidirectional communication for live updates of content analysis progress, queue status changes, and system health metrics. The WebSocket manager handles connection lifecycle, automatic reconnection, and event-based message routing.

## Content Analysis Pipeline
The system simulates content moderation through an analysis pipeline that processes different content types (text, image, video, audio). Analysis results include risk levels (safe, medium, high), detected issues, confidence scores, and processing metrics. The pipeline supports queuing and real-time status updates.

# External Dependencies

## Database Services
- **Neon Database**: PostgreSQL hosting with serverless capabilities
- **Drizzle ORM**: Type-safe database toolkit for schema management and queries

## UI Component Libraries
- **Radix UI**: Headless component primitives for accessible UI elements
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Frontend build tool with HMR and development server
- **TailwindCSS**: Utility-first CSS framework
- **TanStack Query**: Server state management and caching
- **TypeScript**: Type safety across the entire application

## Runtime Dependencies
- **Express.js**: Web application framework for the REST API
- **WebSocket (ws)**: Real-time bidirectional communication
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation library integrated with Drizzle

## Replit Integration
- **Replit Vite Plugins**: Development environment integration including error overlay and cartographer for enhanced debugging