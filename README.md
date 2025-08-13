# Integriting Frontend

A modern React frontend application built with Vite and configured for deployment with Nginx.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Docker (for containerized deployment)

### Development

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd integriting-frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Or use the convenience script:
   ```bash
   # Linux/macOS
   ./dev.sh
   
   # Windows
   dev.bat
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🐳 Docker Deployment

### Build and run with Docker:

```bash
# Build the image
docker build -t integriting-frontend .

# Run the container
docker run -p 80:80 integriting-frontend
```

### Using Docker Compose:

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d
```
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

3. **Environment Configuration**: 
   Environment variables are managed centrally in the `integriting-deployment` folder. The frontend gets its environment variables through Docker containers. For development, use the deployment environment files:
   - `.env.development` for development
   - `.env.staging` for staging
   - `.env.production` for production

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. The application will open in your browser at [http://localhost:3000](http://localhost:3000)

> **Note**: For local development without Docker, you may need to set environment variables manually or use the deployment scripts from the `integriting-deployment` folder.

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