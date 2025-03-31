# Integriting Frontend

## Overview
Integriting is a professional platform that merges governance, law, and business expertise with a focus on sustainable development, legal insight, transparency, and whistleblower protection. This frontend application provides a modern, responsive user interface for both public users and administrators.

## 🚀 Features

- **Public-facing Website**
  - Company services showcase
  - Publication library and downloads
  - E-Newspaper/Journal system
  - Seminar and event listings
  - Whistleblower protection portal

- **Admin Dashboard**
  - Content management system
  - Publication management
  - Service management
  - Seminar scheduling
  - E-Newspaper/Journal management
  - Whistleblower reports handling

## 🛠️ Technologies Used

- **React.js** - UI library
- **React Router** - Navigation and routing
- **SCSS** - Styling with Sass preprocessor
- **Axios** - API client for backend communication
- **Context API** - State management
- **JWT Authentication** - Secure admin access

## 🏗️ Project Structure

```
/src
  /components           # Reusable UI components
    /admin              # Admin-specific components
    /common             # Shared components (Button, Header, Footer)
    /home               # Homepage components
    /newspaper          # Journal/newspaper components
    /publications       # Publication-related components
    /seminars           # Seminar and event components
    /services           # Service showcase components
    /whistleblower      # Whistleblower protection components
  /contexts             # React contexts for state management
  /pages                # Page components
    /admin              # Admin dashboard pages
  /services             # API service methods
  /styles               # SCSS stylesheets
    /components         # Component-specific styles
    /pages              # Page-specific styles
  /utils                # Utility functions
  App.jsx               # Main application component
  index.jsx             # Application entry point
  routes.js             # Route definitions
/public                 # Static assets
  /assets
    /icons              # SVG icons for services
    /images             # Site images
```

## 📦 Installation

### Prerequisites
- Node.js (v14.x or higher)
- npm or yarn package manager

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/your-organization/integriting-frontend.git
cd integriting-frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_AUTH_STORAGE_KEY=auth_token
```

4. Start the development server
```bash
npm start
# or
yarn start
```

5. The application will open in your browser at [http://localhost:3000](http://localhost:3000)

## 🧩 Component Architecture

### Core Components

- **Button** - Reusable button component with multiple variants
- **Header** - Responsive navigation header
- **Footer** - Site footer with navigation and contact info
- **ServiceCard** - Displays individual services
- **PublicationCard** - Displays publication entries
- **EventCard** - Displays seminar/event information
- **NewspaperPreview** - Displays e-journal preview
- **DownloadButton** - Enhanced button for downloading files
- **SearchBar** - Reusable search component
- **ReportingForm** - Whistleblower report submission form

### Admin Components

- **Dashboard** - Admin homepage with statistics
- **ContentEditor** - Rich text editor for content management
- **PublicationManager** - Publication CRUD interface
- **ServiceManager** - Service CRUD interface
- **SeminarManager** - Seminar CRUD interface
- **NewspaperManager** - E-journal CRUD interface

## 🎨 Styling

The project uses SCSS with a modular approach:

- **variables.scss** - Global variables for colors, typography, spacing
- Component-specific styles are encapsulated in dedicated SCSS files
- Responsive design using media queries and flexible layouts
- CSS architecture follows BEM (Block Element Modifier) methodology

### Color Palette

- Primary: #1A365D (Deep navy blue)
- Accent: #E9B949 (Gold)
- Secondary: #2A4A7F (Medium blue)
- Light blue: #E8F0FE
- Grays: Various shades from #F8F9FA to #111827

### Typography

- Serif font: Playfair Display (headings and titles)
- Sans-serif font: Inter (body text and UI elements)

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- Tokens are stored in localStorage
- Protected routes redirect to login
- Automatic token refresh mechanism
- Role-based access control (Admin, Editor)

## 📡 API Integration

The application communicates with a RESTful backend API:

- `api.js` - Axios instance with interceptors for authentication
- Service modules for different API endpoints:
  - `publicationService.js`
  - `serviceService.js`
  - `seminarService.js`
  - `newspaperService.js`
  - `whistleblowerService.js`
  - `auth.js`

## 📝 Available Scripts

- `npm start` - Starts the development server
- `npm build` - Creates a production build
- `npm test` - Runs tests
- `npm eject` - Ejects from Create React App

## 🚢 Deployment

### Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

### Deployment Options

1. **Static hosting** (Netlify, Vercel, GitHub Pages)
2. **Container-based** (Docker)
3. **Traditional hosting** (Apache, Nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Sass](https://sass-lang.com/)
- [Axios](https://axios-http.com/)