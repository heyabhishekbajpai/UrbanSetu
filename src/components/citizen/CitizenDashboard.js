import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Bell, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { format } from 'date-fns';

const CitizenDashboard = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0
  });
  const [hasRecentSubmission, setHasRecentSubmission] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate loading complaints
    const mockComplaints = [
      {
        id: '1',
        title: 'Pothole on Main Road',
        description: 'Large pothole causing traffic issues',
        status: 'resolved',
        priority: 'high',
        category: 'Pothole',
        location: 'Main Road, Sector 15',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        image: 'https://raw.githubusercontent.com/heyabhishekbajpai/UrbanSetu/main/public/pothole.jpg'
      },
      {
        id: '2',
        title: 'Broken Street Light',
        description: 'Street light not working near park',
        status: 'in_progress',
        priority: 'medium',
        category: 'StreetLight',
        location: 'Park Road, Sector 12',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        image: 'https://raw.githubusercontent.com/heyabhishekbajpai/UrbanSetu/main/public/streetlight.jpg'
      },
      {
        id: '3',
        title: 'Garbage Accumulation',
        description: 'Garbage not being collected regularly',
        status: 'pending',
        priority: 'high',
        category: 'Garbage',
        location: 'Residential Area, Sector 8',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        image: 'https://raw.githubusercontent.com/heyabhishekbajpai/UrbanSetu/main/public/garbage.png'
      },
      {
        id: '4',
        title: 'Water Leakage',
        description: 'Water pipe burst causing flooding in the area',
        status: 'registered',
        priority: 'urgent',
        category: 'Water',
        location: 'Near Community Center, Sector 5',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        image: 'https://raw.githubusercontent.com/heyabhishekbajpai/UrbanSetu/main/public/water.jpg'
      }
    ];

    setRecentComplaints(mockComplaints);
    setStats({
      total: 5, // Changed from mockComplaints.length to 5
      resolved: mockComplaints.filter(c => c.status === 'resolved').length,
      pending: mockComplaints.filter(c => c.status === 'pending').length,
      inProgress: mockComplaints.filter(c => c.status === 'in_progress').length
    });

    // Check if there's a recent complaint submission (within last 24 hours)
    const now = new Date();
    const recentSubmission = mockComplaints.find(complaint => {
      const complaintTime = new Date(complaint.createdAt);
      const hoursDiff = (now - complaintTime) / (1000 * 60 * 60);
      return hoursDiff <= 24 && (complaint.status === 'registered' || complaint.status === 'pending');
    });
    
    setHasRecentSubmission(!!recentSubmission);
    
    // Check if user just submitted a complaint (from localStorage)
    const complaintSubmitted = localStorage.getItem('complaintSubmitted');
    const complaintSubmittedTime = localStorage.getItem('complaintSubmittedTime');
    
    console.log('Checking localStorage:', { complaintSubmitted, complaintSubmittedTime });
    
    if (complaintSubmitted === 'true' && complaintSubmittedTime) {
      const submissionTime = new Date(complaintSubmittedTime);
      const timeDiff = (now - submissionTime) / (1000 * 60 * 60); // hours
      
      console.log('Complaint submission found:', { submissionTime, timeDiff });
      
      // Show progress bar if complaint was submitted within last 24 hours
      if (timeDiff <= 24) {
        console.log('Showing progress bar');
        setShowProgressBar(true);
        // Progress bar stays visible until page refresh or navigation
      }
      
      // Clear the localStorage flag after a delay to ensure progress bar shows
      setTimeout(() => {
        localStorage.removeItem('complaintSubmitted');
        localStorage.removeItem('complaintSubmittedTime');
        console.log('Cleared localStorage flags');
      }, 1000);
    } else {
      console.log('No recent complaint submission found');
      setShowProgressBar(false);
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'in_progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  // Get progress height based on complaint status
  const getProgressHeight = (status) => {
    switch (status) {
      case 'registered': return '25%';
      case 'pending': return '50%';
      case 'in_progress': return '75%';
      case 'resolved': return '100%';
      default: return '25%';
    }
  };

  // Function to show progress bar after complaint submission
  const handleComplaintSubmitted = () => {
    setShowProgressBar(true);
    // Hide progress bar after 10 seconds
    setTimeout(() => {
      setShowProgressBar(false);
    }, 10000);
  };

  // Filter complaints based on search query
  const filteredComplaints = recentComplaints.filter(complaint =>
    complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="https://raw.githubusercontent.com/heyabhishekbajpai/UrbanSetu/main/public/logo.png" alt="UrbanSetu Logo" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  UrbanSetu
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <Link
                to="/profile"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quick Report Button */}
            <Link
              to="/citizen/report"
              className="card dark:card-dark text-center group hover:shadow-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Report Issue</h3>
              <p className="text-primary-100 text-sm">
                Report a new civic issue quickly
              </p>
            </Link>

            {/* Statistics Cards */}
            <div className="card dark:card-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="card dark:card-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="card dark:card-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>


        {/* Complaint Progress Bar - Only show after user submits a complaint */}
        {showProgressBar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
          <div className="card dark:card-dark">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Your Latest Complaint Progress
            </h3>
            
            {/* Progress Steps */}
            <div className="relative">
              {/* Progress Steps */}
              <div className="flex justify-between">
                {/* Step 1: Complaint Registered */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mb-2 shadow-lg">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Complaint Registered</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your complaint has been submitted</p>
                  </div>
                </div>

                {/* Step 2: Forwarded to Department */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mb-2 shadow-lg">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Forwarded to Department</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your complaint is being reviewed</p>
                  </div>
                </div>

                {/* Step 3: Worker Assigned */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-semibold text-sm mb-2 shadow-lg">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Worker Assigned</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">A worker will be assigned</p>
                  </div>
                </div>

                {/* Step 4: Issue Resolved */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-semibold text-sm mb-2 shadow-lg">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Issue Resolved</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Your complaint will be resolved</p>
                  </div>
                </div>
              </div>
              
              {/* Bold Progress Line - Below the icons */}
              <div className="absolute top-6 h-2 bg-gray-200 dark:bg-gray-700 rounded-full" style={{ left: '48px', right: '48px' }}>
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-2000 ease-in-out shadow-lg"
                  style={{ 
                    width: '60%',
                    animation: 'progressAnimation 2s ease-in-out'
                  }}
                ></div>
              </div>
            </div>

            {/* Progress Info */}
            <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                    Current Status: Your complaint is being reviewed by the department
                  </p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                    Expected next update within 24-48 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
          </motion.div>
        )}

        {/* Recent Complaints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Complaints
            </h2>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex-shrink-0">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No complaints found matching your search.' : 'No complaints available.'}
                </p>
              </div>
            ) : (
              filteredComplaints.map((complaint, index) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card dark:card-dark hover:shadow-lg transition-shadow cursor-pointer relative"
                onClick={() => navigate(`/citizen/tracking/${complaint.id}`)}
              >
                {/* Vertical Progress Bar */}
                <div className="absolute left-4 top-4 bottom-4 w-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="w-full bg-gradient-to-b from-primary-500 to-primary-600 rounded-full transition-all duration-2000 ease-in-out shadow-lg"
                    style={{ 
                      height: getProgressHeight(complaint.status),
                      animation: 'verticalProgressAnimation 2s ease-in-out',
                      '--progress-height': getProgressHeight(complaint.status)
                    }}
                  ></div>
                </div>
                
                <div className="flex items-start space-x-4 ml-6">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={complaint.image}
                      alt={complaint.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="space-y-3">
                      <div className="w-full">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                            {complaint.title}
                          </h3>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded flex-shrink-0">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                          {complaint.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{complaint.location}</span>
                      </div>
                      
                      {/* Status and Priority Badges - moved below content */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(complaint.status)}`}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(complaint.status)}
                            <span className="capitalize">{complaint.status.replace('_', ' ')}</span>
                          </span>
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </div>
                      
                      {/* Date - moved below badges */}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {format(complaint.createdAt, 'MMM dd, yyyy')}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 px-2">
                      <button className="flex items-center space-x-1 text-xs sm:text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </button>
                      <button className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Add Comment</span>
                        <span className="sm:hidden">Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
            )}
          </div>

        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card dark:card-dark"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Tips for Better Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Camera className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  Take Clear Photos
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ensure good lighting and capture the issue from multiple angles
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  Accurate Location
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use GPS location for precise positioning of the issue
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  Detailed Description
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Provide specific details about the issue and its impact
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  Follow Up
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Check status updates regularly and provide feedback
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
