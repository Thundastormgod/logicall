# Inventory Link Nexus

A modern web application for streamlined inventory management connecting clients and warehouse staff. Inventory Link Nexus provides a comprehensive solution for tracking, managing, and reporting on inventory across multiple clients.

## Project Overview

Inventory Link Nexus is designed to bridge the gap between clients and warehouse staff by providing:

- **Client Portal**: A dedicated interface for clients to view their inventory in real-time
- **Staff Portal**: An administrative interface for warehouse staff to manage inventory across all clients
- **Role-Based Access Control**: Separate authentication flows for clients and staff
- **Inventory Management**: Comprehensive tools for tracking, searching, and sorting inventory items

## Technology Stack

This project is built with modern web technologies:

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Hooks
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form
- **Validation**: Zod

## Features

### Client Portal
- Dashboard with key inventory statistics
- Searchable and sortable inventory listings
- Real-time activity feed
- Category breakdown visualization

### Staff Portal
- Administrative dashboard with cross-client overview
- Client management interface
- Inventory management across all clients
- Low stock notifications
- Report generation

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd inventory-link-nexus

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run build:dev` - Build the app with development settings
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## Project Structure

```
inventory-link-nexus/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and constants
│   ├── pages/          # Page components for routing
│   │   ├── client/     # Client-facing pages
│   │   └── staff/      # Staff-facing pages
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## Current State

This project is currently a frontend prototype with:
- Complete UI implementation with mock data
- Working navigation and state management
- Authentication flow mocked with localStorage

It is designed to be integrated with a backend service in the future.

## Future Development

- Backend API integration using TanStack Query
- Real-time updates with WebSockets
- Enhanced reporting and analytics
- Mobile-responsive design improvements
- User profile management
- Advanced filtering options for inventory
