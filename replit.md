# Karen Mor - Child & Educational Psychologist Website

## Overview
Professional website for Karen Mor, a child and educational psychologist based in Netanya, Israel. The site is written in Hebrew (RTL) in first person, featuring a warm and professional design.

## Current State
- **Status**: Complete MVP
- **Last Updated**: December 24, 2025

## Project Architecture

### Frontend (`client/src/`)
- **Framework**: React with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS with custom warm color palette
- **Font**: Heebo (Hebrew-optimized)
- **Direction**: RTL (Right-to-Left)

### Backend (`server/`)
- **Framework**: Express.js
- **Storage**: In-memory storage (MemStorage)
- **API Endpoints**:
  - `POST /api/contact` - Submit contact form

### Key Files
- `client/src/pages/home.tsx` - Main landing page with all sections
- `client/src/index.css` - Custom color scheme (warm teal primary, orange accent)
- `shared/schema.ts` - Data models and validation schemas
- `server/routes.ts` - API routes
- `server/storage.ts` - In-memory data storage

## Features
1. **Hero Section** - Full-screen with professional image and CTAs
2. **About Section** - Karen's background and approach (first person)
3. **Services** - 5 main services offered (therapy, diagnosis, parent guidance, group therapy, educational counseling)
4. **Specializations** - 6 areas of expertise displayed as badges
5. **Why Work With Me** - Therapeutic approach highlights
6. **Testimonials** - Parent reviews
7. **Workshops** - Group programs and workshops
8. **Contact Section** - Form with validation + contact info
9. **Footer** - Quick links and contact details

## Design System
- **Primary Color**: Teal (175, 45%, 42%)
- **Accent Color**: Orange (24, 80%, 55%)
- **Font**: Heebo (Hebrew sans-serif)
- **Border Radius**: Small (rounded-md)
- **Spacing**: Consistent 4-6-8-12-16 unit system

## Contact Information
- Phone: 052-5624642
- Email: info@karenmor.com
- Address: Yehuda Halevi 28, Netanya
- Website: https://www.karenmor.com

## Running the Project
```bash
npm run dev
```
The application runs on port 5000.
