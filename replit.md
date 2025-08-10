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
- **educationForms**: User education background information
- **jobApplications**: Job application profiles and preferences  
- **pdfReports**: Generated PDF reports with unique IDs for admin access

## Key Features
- User registration and authentication with JWT tokens
- Interactive technology-focused career assessment survey
- AI-powered career path analysis specialized for CS/IT/Cybersecurity
- Mixed question types: text input, multiple-choice, and rating scales
- Personalized results with career matches, skills, and recommendations
- Education background form with database storage
- Job application profile builder
- Professional PDF report generation with unique IDs
- PDF download functionality with brand logo and complete user data
- Admin database access for all user responses and PDF reports
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
- ✅ **Full Gemini AI Integration**: Replaced all static content with AI-generated survey questions and responses
- ✅ **Dynamic Question Generation**: AI creates personalized assessment questions based on user profile
- ✅ **Intelligent Career Analysis**: AI analyzes responses to provide tailored career recommendations
- ✅ **Real-time Results**: Assessment results are dynamically generated and stored in database
- ✅ **AI-Powered Survey Flow**: Complete frontend integration with SurveyPageAI.tsx using React Query
- ✅ **Enhanced Backend**: Updated routes to use Gemini service for all content generation
- ✅ **Database Integration**: Fixed storage interface to support AI-generated assessment flow
- ✅ **Technology Specialization**: All questions and analysis now focus on Technology, CS, IT, and Cybersecurity fields
- ✅ **Mixed Question Types**: Implemented text input fields, multiple-choice options, and rating scales
- ✅ **PDF Generation**: Professional PDF reports with unique IDs and brand logo using Puppeteer
- ✅ **Form Integration**: Education and job application forms with database storage
- ✅ **Admin Access**: All PDF reports and form responses saved to database for admin review
- ✅ **Complete PDF Template**: Professional layout with assessment results, education, and job application data
- ✅ **Download Functionality**: One-click PDF download from results page with proper authentication