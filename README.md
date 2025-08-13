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

2. **Environment Configuration:**
   Environment variables are managed centrally in the `integriting-deployment` folder. For development:
   
   ```bash
   cd ../integriting-deployment
   start-dev.bat
   ```

3. **Manual Development (without Docker):**
   ```bash
   npm run dev
   ```
   
   Or use the convenience script:
   ```bash
   # Windows
   dev.bat
   ```

4. **Open your browser:**
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

### Using Docker Compose (Recommended):

```bash
cd ../integriting-deployment
start-dev.bat    # Development
start-staging.bat # Staging
start-prod.bat   # Production
```

### Manual Docker Build:

```bash
# Build the image
docker build -t integriting-frontend .

# Run the container
docker run -p 80:80 integriting-frontend
```

## 📁 Project Structure

```
integriting-frontend/
├── src/
  /components           # Reusable UI components
    /admin              # Admin-specific components
    /common             # Shared components (Button, Header, Footer)
    /home               # Homepage components
    /newspaper          # E-journal components
    /publications       # Publication components
    /seminars           # Seminar components
    /services           # Service components
    /whistleblower      # Whistleblower reporting components
  /contexts             # React context providers
    AuthContext.jsx     # Authentication state management
    ThemeContext.jsx    # Theme management
  /pages                # Route-level page components
    HomePage.jsx        # Landing page
    LoginPage.jsx       # Authentication page
    NewspaperPage.jsx   # E-journal page
    PublicationDetailPage.jsx # Individual publication
    PublicationsPage.jsx # Publications listing
    SeminarsPage.jsx    # Seminars page
    ServiceDetailPage.jsx # Individual service
    ServicesPage.jsx    # Services listing
    WhistleblowerPage.jsx # Anonymous reporting
    /admin              # Admin panel pages
  /services             # API service modules
    analyticsService.js # Analytics integration
    api.js             # Axios instance with interceptors
    auth.js            # Authentication service
    newsletterService.js # Newsletter subscriptions
    newspaperService.js # E-journal API calls
    publicationService.js # Publications API
    seminarService.js  # Seminars API
    serviceService.js  # Services API
    whistleblowerService.js # Whistleblower API
  /styles               # SCSS stylesheets
    /components         # Component-specific styles
    /pages              # Page-specific styles
    /utils              # Utility styles and mixins
  App.jsx               # Main application component
  index.jsx             # Application entry point
  routes.js             # Route definitions
/public                 # Static assets
  /assets
    /icons              # SVG icons for services
    /images             # Site images
    /logo               # Logo files
```

## 📦 Installation

### Prerequisites
- Node.js (v18.x or higher)
- npm or yarn package manager
- Docker (for containerized deployment)

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
   Environment variables are managed centrally in the `integriting-deployment` folder. The frontend gets its environment variables through Docker containers:
   
   ```bash
   cd ../integriting-deployment
   start-dev.bat    # For development
   start-staging.bat # For staging
   start-prod.bat   # For production
   ```

4. **Manual Development** (without Docker):
```bash
npm run dev
# or
yarn dev
```

5. The application will open in your browser at [http://localhost:3000](http://localhost:3000)

> **Note**: For production deployment, always use the Docker-based approach from the `integriting-deployment` folder for proper environment variable management.

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

- `npm run dev` - Starts the Vite development server
- `npm run build` - Creates an optimized production build
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint (if configured)

## 🚢 Deployment

### Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Options

1. **Docker-based Deployment (Recommended)**
   ```bash
   cd ../integriting-deployment
   start-prod.bat
   ```

2. **Static hosting** (Netlify, Vercel, GitHub Pages)
3. **Container-based** with custom Docker setup
4. **Traditional hosting** (Apache, Nginx) - serve the `dist/` folder

### Production Considerations

- The application uses Vite for building and Nginx for serving in production
- Environment variables are injected at container runtime
- All static assets are optimized and compressed
- The production build includes service worker for caching (if configured)

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