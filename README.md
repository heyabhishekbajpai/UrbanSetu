# UrbanSetu - Civic Issue Reporting Platform

> **आवाज़ उठाओ, बदलाव लाओ** (Raise Your Voice, Bring Change)

A modern, AI-powered civic issue reporting and resolution platform designed for mobile-first usage. UrbanSetu connects citizens with local authorities for faster, more efficient problem-solving through crowdsourced reporting and real-time tracking.

## 🌟 Features

### For Citizens
- **AI-Powered Issue Detection**: Automatically identify civic issues using Teachable Machine
- **Quick Reporting**: Mobile-optimized camera capture and form submission
- **Interactive Maps**: Google Maps integration for precise location selection
- **Real-time Tracking**: Monitor complaint progress from submission to resolution
- **Smart Routing**: Automatic department assignment based on AI detection
- **Feedback System**: Rate and comment on resolution quality

### For Administrators
- **Live Dashboard**: Comprehensive overview of all complaints and statistics
- **Department Analytics**: Performance metrics and response time tracking
- **Bulk Actions**: Efficient complaint management tools
- **Map Integration**: Geographic visualization of issues
- **Status Management**: Update complaint status and assign to teams

### Technical Features
- **Mobile-First Design**: Optimized for smartphones and tablets
- **Dark/Light Mode**: User preference support
- **Responsive UI**: Works seamlessly across all device sizes
- **Real-time Updates**: Live status notifications
- **Geolocation**: GPS-based location capture
- **Image Processing**: AI-powered civic issue classification

## 🚀 Tech Stack

- **Frontend**: React.js 18 with modern hooks
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Maps**: Leaflet.js integration
- **AI/ML**: TensorFlow.js with Teachable Machine
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 🎨 Design System

### Color Scheme
- **Light Mode**: Green (#2d5016, #48bb78) and white with subtle gradients
- **Dark Mode**: Dark green (#1a3d0a) and grey (#2d3748)

### UI Components
- Glassmorphism effects for modern aesthetics
- Smooth animations and micro-interactions
- Professional civic app design language
- Mobile-first responsive layouts

## 🤖 AI Integration

### Teachable Machine Model
- **Model Location**: Local files in `/public/models/` directory
- **Model Files**: model.json, metadata.json, model.weights.bin
- **Classes**: Pothole, Garbage, Sewage, StreetLight, FallenTree
- **Confidence Threshold**: >60% for auto-selection
- **Manual Override**: Available for low-confidence predictions

### Department Mapping
- **Pothole** → Road Authority
- **Garbage** → Sanitation Department
- **Sewage** → Water & Sewage Board
- **StreetLight** → Electrical Department
- **FallenTree** → Parks & Horticulture

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with camera access
- Internet connection for AI model loading

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd urbansetu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google Maps API (Optional)**
   - Get a free API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Enable the following APIs:
     - Maps JavaScript API
     - Geocoding API
   - Create a `.env` file in the root directory:
     ```bash
     REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
     ```
   - **Note**: Without an API key, the map will show a placeholder with setup instructions. The app works fully without the map feature.

4. **Start development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Application Structure

### Public Pages
- **Landing Page**: Hero section, features, testimonials, and call-to-action
- **Authentication**: Login/Register with Citizen/Admin options
- **Social Login**: Google OAuth and phone number support

### Citizen Dashboard
- **Quick Report**: One-tap issue reporting with camera integration
- **Recent Complaints**: Status timeline and progress tracking
- **Statistics**: Personal reporting metrics
- **Profile Management**: Account settings and preferences

### Admin Dashboard
- **Live Map View**: Geographic complaint visualization
- **Complaints Table**: Filterable and searchable complaint management
- **Analytics**: Department-wise performance metrics
- **Bulk Actions**: Efficient complaint processing tools

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Deployment Options
- **Netlify**: Drag and drop the build folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload build files to S3 bucket
- **Heroku**: Deploy with buildpacks

## 📞 Support

For support and questions:
- **Email**: bajpai.connect@gmail.com
- **Documentation**: [docs.urbansetu.com](https://docs.urbansetu.com)

---

**Made with ❤️ for better cities and communities**

*UrbanSetu - Empowering citizens to build better cities, one report at a time.*
