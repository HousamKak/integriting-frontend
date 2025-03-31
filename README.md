# Integriting Website

## Overview
Integriting platform merges governance, law, and business with a focus on sustainable development, legal insight, transparency, and whistleblower protection.

## Features
- Professional governance consulting
- Legal review and publications
- Seminar and event management
- Whistleblower protection portal
- E-Newspaper/Journal system
- Admin dashboard for content management

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn package manager

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/integriting-website.git
cd integriting-website
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following content:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server
```bash
npm start
# or
yarn start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Starting the Backend
The backend server needs to be running for the frontend to work properly.

1. Navigate to the backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with the required environment variables
```
PORT=5000
JWT_SECRET=your_jwt_secret
ADMIN_DEFAULT_PASSWORD=admin123
ADMIN_EMAIL=admin@integriting.com
```

4. Start the backend server
```bash
npm start
```

## Building for Production
```bash
npm run build
# or
yarn build
```

## Technologies Used
- React.js
- SCSS for styling
- React Router for navigation
- Node.js backend with Express
- SQLite for database
- JWT for authentication

## Project Structure
- `/src` - React source code
  - `/components` - Reusable UI components
  - `/pages` - Page components
  - `/services` - API service methods
  - `/contexts` - React context providers
  - `/styles` - SCSS stylesheets
  - `/utils` - Utility functions
- `/public` - Static assets
- `/backend` - Server-side code