import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  MapPin, 
  Camera, 
  Clock, 
  Users, 
  Shield, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  MessageCircle,
  Globe,
  Heart
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const { isDark, toggleTheme } = useTheme();

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "AI-Powered Detection",
      description: "Automatically identify civic issues using advanced machine learning"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Real-time Tracking",
      description: "Track your complaints from submission to resolution in real-time"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Response",
      description: "Get faster response times with automated department routing"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Issues Reported" },
    { number: "8,500+", label: "Issues Resolved" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  const testimonials = [
    {
      name: "Subhanshi Mishra",
      role: "PHD Scholar, Bangalore",
      content: "UrbanSetu made it so easy to report the pothole near my house. It was fixed within 3 days!",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Business Owner, Delhi",
      content: "The AI detection feature is amazing. It automatically identified the broken street light and routed it to the right department.",
      rating: 5
    },
    {
      name: "Anita Singh",
      role: "Teacher, Bangalore",
      content: "I love how I can track the progress of my complaint. The transparency is incredible!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-dark-900 dark:to-dark-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect dark:glass-effect-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="https://raw.githubusercontent.com/heyabhishekbajpai/UrbanSetu/main/public/logo.png" alt="UrbanSetu Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xl font-bold text-gradient">UrbanSetu</span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg glass-effect dark:glass-effect-dark hover:bg-white/20 transition-colors"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <Link to="/login" className="btn-primary px-2 sm:px-6 py-2 text-xs sm:text-base">
                <span className="sm:whitespace-nowrap">
                  <span className="block sm:inline">Get</span>
                  <span className="block sm:inline sm:ml-1">Started</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to{' '}
                <span className="text-gradient">UrbanSetu</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-2">
                आवाज़ उठाओ, बदलाव लाओ
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
                A crowdsourced civic issue reporting and resolution platform that connects citizens with local authorities for faster, more efficient problem-solving.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link to="/login" className="btn-primary text-lg px-8 py-4">
                Report an Issue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/register" className="btn-secondary text-lg px-8 py-4">
                Join as Admin
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-dark-700">
                <div className="flex items-center justify-center mb-6">
                  <Smartphone className="w-12 h-12 text-primary-500 mr-4" />
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Mobile-First Design
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Optimized for smartphones and tablets
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Camera className="w-8 h-8 text-primary-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Capture</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Take photos of issues</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-8 h-8 text-primary-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Report</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Submit with location</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-primary-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Track</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monitor progress</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The Problem We Solve
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Traditional civic issue reporting is slow, inefficient, and lacks transparency. Citizens often don't know where to report issues or how to track their resolution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Complex Reporting Process
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Citizens struggle to find the right department and navigate bureaucratic processes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Lack of Transparency
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No visibility into complaint status or resolution timeline.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Slow Response Times
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Issues take weeks or months to resolve due to inefficient routing.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>AI-powered issue detection and routing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Real-time tracking and updates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Mobile-first design for accessibility</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Transparent communication channels</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to report, track, and resolve civic issues efficiently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card dark:card-dark text-center group hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Making a Real Impact
            </h2>
            <p className="text-lg text-primary-100 max-w-3xl mx-auto">
              Join thousands of citizens who are already making their cities better.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Citizens Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Real feedback from users who have experienced the power of UrbanSetu.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card dark:card-dark"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Join UrbanSetu today and be part of the change. Report issues, track progress, and help build better cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start as Citizen
              </Link>
              <Link to="/register" className="bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-800 transition-colors border border-primary-400">
                Join as Admin
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <img src="https://raw.githubusercontent.com/heyabhishekbajpai/UrbanSetu/main/public/logo.png" alt="UrbanSetu Logo" className="w-8 h-8 object-contain" />
                </div>
                <span className="text-xl font-bold">UrbanSetu</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering citizens to report civic issues and track their resolution through AI-powered technology and transparent communication.
              </p>
              <p className="text-lg font-semibold text-primary-400">
                आवाज़ उठाओ, बदलाव लाओ
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  bajpai.connect@gmail.com
                </li>
                <li className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Made with ❤️ for India by team NovaX
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Urbansetu. All rights reserved. Building better cities, one report at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
