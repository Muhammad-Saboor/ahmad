# CareerPath AI - Career Assessment Platform

## Overview
A full-stack career assessment platform that helps users discover their ideal career paths through AI-powered analysis. Users can take comprehensive assessments and receive personalized career recommendations with detailed insights.

## Project Architecture

### Frontend (React + TypeScript)
- **Router**: Wouter for client-side routing
- **State Management**: React Context for authentication
- **Styling**: Tailwind CSS with custom components
- **Forms**: React Hook Form with Zod validation
- **API Client**: Custom fetch-based client with JWT authentication

### Backend (Express + TypeScript)
- **Framework**: Express.js
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Database**: PostgreSQL with Drizzle ORM
- **API**: RESTful endpoints for auth and assessments

### Database Schema
- **users**: User authentication and profile data
- **assessments**: Survey responses and generated results

## Key Features
- User registration and authentication
- Interactive career assessment survey
- AI-powered career path analysis (currently mock data)
- Personalized results with career matches, skills, and recommendations
- User profile management
- Responsive design for all devices

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (auto-configured)
- `JWT_SECRET`: Secret key for JWT token signing (user-provided)

## Recent Changes (Migration from Bolt to Replit)
- ✅ Migrated from Supabase to PostgreSQL with Drizzle ORM
- ✅ Replaced React Router with Wouter
- ✅ Implemented JWT-based authentication
- ✅ Created server-side API routes for auth and assessments
- ✅ Removed all Supabase dependencies
- ✅ Set up proper database schema and migrations
- ✅ Secured authentication with user-provided JWT secret

## User Preferences
- Uses modern web development best practices
- Prefers server-side logic for security
- Wants clean, professional UI/UX
- Requires secure authentication implementation

## Development Commands
- `npm run dev`: Start development server
- `npm run db:push`: Push schema changes to database
- `npm run build`: Build for production

## Next Steps
- Integrate real AI service for career analysis (currently uses mock data)
- Add more comprehensive assessment questions
- Implement result export/sharing features
- Add admin dashboard for analytics

## Recent Feature Updates
- ✅ Added Career Roadmap feature replacing salary ranges
- ✅ Created comprehensive Education Form for personal/educational details
- ✅ Built Job Application Form for resume details and company preferences
- ✅ Enhanced Results page with interactive navigation to new features
- ✅ Fixed all TypeScript compilation issues