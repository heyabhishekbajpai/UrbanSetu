import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  MessageSquare,
  Star,
  Camera,
  Calendar,
  Phone,
  Mail,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { format, formatDistanceToNow } from 'date-fns';

const ComplaintTracking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadComplaint = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockComplaint = {
        id: id,
        title: 'Pothole on Main Road',
        description: 'Large pothole causing traffic issues and safety concerns for pedestrians and vehicles.',
        status: 'in_progress',
        priority: 'high',
        category: 'Pothole',
        department: 'Road Authority',
        location: 'Main Road, Sector 15, Noida',
        address: 'Main Road, Sector 15, Noida, Uttar Pradesh 201301',
        latitude: 28.5355,
        longitude: 77.3910,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        estimatedResolution: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        reporter: {
          name: user?.name || 'John Doe',
          email: user?.email || 'john@example.com',
          phone: '+91 98765 43210'
        },
        assignedTo: {
          name: 'Rajesh Kumar',
          department: 'Road Authority',
          phone: '+91 98765 12345',
          email: 'rajesh.kumar@noida.gov.in'
        },
        aiPrediction: {
          className: 'Pothole',
          probability: 0.87
        }
      };

      const mockTimeline = [
        {
          id: '1',
          status: 'registered',
          title: 'Complaint Registered',
          description: 'Your complaint has been successfully registered and assigned a tracking ID.',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          user: 'System',
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'text-green-600 bg-green-100 dark:bg-green-900/30'
        },
        {
          id: '2',
          status: 'forwarded',
          title: 'Forwarded to Department',
          description: 'Complaint has been forwarded to Road Authority for review and action.',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          user: 'System',
          icon: <AlertCircle className="w-5 h-5" />,
          color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
        },
        {
          id: '3',
          status: 'acknowledged',
          title: 'Department Acknowledged',
          description: 'Road Authority has acknowledged the complaint and assigned it to field team.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          user: 'Rajesh Kumar',
          icon: <User className="w-5 h-5" />,
          color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
        },
        {
          id: '4',
          status: 'in_progress',
          title: 'Work Started',
          description: 'Field team has started working on the pothole repair. Materials have been arranged.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          user: 'Rajesh Kumar',
          icon: <Clock className="w-5 h-5" />,
          color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
        }
      ];

      setComplaint(mockComplaint);
      setTimeline(mockTimeline);
      setLoading(false);
    };

    loadComplaint();
  }, [id, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'in_progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'closed': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        text: newComment,
        timestamp: new Date(),
        user: user?.name || 'You'
      };
      
      // Add to timeline
      setTimeline(prev => [...prev, {
        id: comment.id,
        status: 'comment',
        title: 'Comment Added',
        description: comment.text,
        timestamp: comment.timestamp,
        user: comment.user,
        icon: <MessageSquare className="w-5 h-5" />,
        color: 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
      }]);
      
      setNewComment('');
      toast.success('Comment added successfully');
    }
  };

  const handleRating = (value) => {
    setRating(value);
    setShowRating(false);
    toast.success('Thank you for your feedback!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Complaint Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The complaint you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/citizen')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/citizen')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Complaint #{complaint.id}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {complaint.title}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card dark:card-dark"
            >
              <div className="relative">
                <img
                  src={complaint.image}
                  alt={complaint.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card dark:card-dark"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {complaint.description}
              </p>
              
              {complaint.aiPrediction && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">AI</span>
                    </div>
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      AI Detection: {complaint.aiPrediction.className} 
                      {' '}({Math.round(complaint.aiPrediction.probability * 100)}% confidence)
                    </span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card dark:card-dark"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Progress Timeline
              </h3>
              
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        by {item.user} • {format(item.timestamp, 'MMM dd, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Add Comment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card dark:card-dark"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add Comment
              </h3>
              <div className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment or update..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Comment
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card dark:card-dark"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Status Overview
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{complaint.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Department:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{complaint.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Created:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {format(complaint.createdAt, 'MMM dd, yyyy')}
                  </span>
                </div>
                {complaint.estimatedResolution && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Est. Resolution:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {format(complaint.estimatedResolution, 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card dark:card-dark"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Location
              </h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {complaint.address}
                  </span>
                </div>
                <button className="w-full btn-secondary text-sm">
                  View on Map
                </button>
              </div>
            </motion.div>

            {/* Assigned Officer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card dark:card-dark"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Assigned Officer
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {complaint.assignedTo.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {complaint.assignedTo.department}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {complaint.assignedTo.phone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {complaint.assignedTo.email}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card dark:card-dark"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full btn-secondary text-sm flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
                <button className="w-full btn-secondary text-sm flex items-center justify-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share Complaint</span>
                </button>
                {complaint.status === 'resolved' && !showRating && (
                  <button
                    onClick={() => setShowRating(true)}
                    className="w-full btn-primary text-sm flex items-center justify-center space-x-2"
                  >
                    <Star className="w-4 h-4" />
                    <span>Rate Resolution</span>
                  </button>
                )}
              </div>
            </motion.div>

            {/* Rating Modal */}
            {showRating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card dark:card-dark"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Rate Resolution
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    How satisfied are you with the resolution?
                  </p>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleRating(value)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          value <= rating
                            ? 'bg-yellow-400 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintTracking;
