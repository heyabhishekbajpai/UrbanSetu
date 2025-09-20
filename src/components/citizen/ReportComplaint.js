import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import * as tmImage from '@teachablemachine/image';
import { 
  Camera, 
  Upload, 
  MapPin, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  X,
  Edit3,
  Zap,
  Globe,
  Mic,
  MicOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import GoogleMap from '../common/GoogleMap';

// AI Model Integration
const AI_MODEL_URL = '/models/';
const FALLBACK_MODEL_URL = 'https://teachablemachine.withgoogle.com/models/FzFLbZLp9f/';
const AI_CLASSES = ['Pothole', 'Garbage', 'Sewage', 'StreetLight', 'FallenTree'];
const CONFIDENCE_THRESHOLD = 0.6;

const DEPARTMENT_MAPPING = {
  'Pothole': 'Road Authority',
  'Garbage': 'Sanitation Department',
  'Sewage': 'Water & Sewage Board',
  'StreetLight': 'Electrical Department',
  'FallenTree': 'Parks & Horticulture'
};

const DESCRIPTION_TEMPLATES = {
  'Pothole': 'I have noticed a pothole at [ADDRESS]. It is creating difficulty for pedestrians and vehicles.',
  'Garbage': 'There is accumulated garbage at [ADDRESS]. It needs immediate attention for cleanliness.',
  'Sewage': 'There is sewage overflow/blockage at [ADDRESS]. It is causing unhygienic conditions.',
  'StreetLight': 'Street light is not working at [ADDRESS]. It is causing safety concerns during night time.',
  'FallenTree': 'A tree has fallen at [ADDRESS]. It is blocking the path and needs removal.'
};

const ReportComplaint = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [step, setStep] = useState(1);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [aiModelLoaded, setAiModelLoaded] = useState(false);
  const [locationLoaded, setLocationLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: '',
      description: '',
      priority: 'medium',
      department: '',
      address: '',
      latitude: '',
      longitude: ''
    }
  });

  const watchedCategory = watch('category');
  const watchedDescription = watch('description');

  // Load AI Model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoading(true);
        console.log('Loading AI model from local files...');
        console.log('Model URL:', AI_MODEL_URL + 'model.json');
        console.log('Metadata URL:', AI_MODEL_URL + 'metadata.json');
        
        // Test if files are accessible
        const modelResponse = await fetch(AI_MODEL_URL + 'model.json');
        const metadataResponse = await fetch(AI_MODEL_URL + 'metadata.json');
        
        if (!modelResponse.ok) {
          throw new Error(`Model file not accessible: ${modelResponse.status}`);
        }
        if (!metadataResponse.ok) {
          throw new Error(`Metadata file not accessible: ${metadataResponse.status}`);
        }
        
        console.log('Model files are accessible, loading with Teachable Machine...');
        const model = await tmImage.load(AI_MODEL_URL + 'model.json', AI_MODEL_URL + 'metadata.json');
        setModel(model);
        setModelLoading(false);
        setAiModelLoaded(true);
        console.log('Model loaded successfully:', model);
      } catch (error) {
        console.error('Error loading local AI model:', error);
        console.log('Trying fallback online model...');
        
        try {
          // Try fallback online model
          const fallbackModel = await tmImage.load(FALLBACK_MODEL_URL + 'model.json', FALLBACK_MODEL_URL + 'metadata.json');
          setModel(fallbackModel);
          setModelLoading(false);
          setAiModelLoaded(true);
          console.log('Fallback model loaded successfully:', fallbackModel);
        } catch (fallbackError) {
          console.error('Error loading fallback model:', fallbackError);
          setModelLoading(false);
          console.error('Failed to load AI model from both local and online sources');
        }
      }
    };

    loadModel();
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        console.log('Listening... Speak now');
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const currentDescription = getValues('description') || '';
        setValue('description', currentDescription + transcript);
        console.log('Voice transcribed successfully');
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        console.error(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }, [setValue, getValues]);

  // Automatically get user's location when component mounts
  useEffect(() => {
    if (!currentLocation && !isLoadingLocation) {
      getCurrentLocation();
    }
  }, []);

  // Reverse geocoding function to convert coordinates to detailed address
  const reverseGeocode = useCallback(async (latitude, longitude) => {
    try {
      // Try multiple geocoding services for better accuracy
      const services = [
        // OpenStreetMap Nominatim (free, good for detailed addresses)
        {
          url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18&extratags=1&namedetails=1&accept-language=en`,
          type: 'nominatim'
        },
        // BigDataCloud (backup)
        {
          url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          type: 'bigdatacloud'
        },
        // Additional Nominatim request with different parameters for better results
        {
          url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18&extratags=1&namedetails=1&accept-language=en`,
          type: 'nominatim_alt'
        },
      ];

      for (const service of services) {
        try {
          const headers = {
            'User-Agent': 'UrbanSetu/1.0'
          };
          
          const response = await fetch(service.url, { headers });
          const data = await response.json();
          
          if (service.type === 'nominatim') {
            // OpenStreetMap Nominatim response
            if (data.address) {
              const addr = data.address;
              const addressParts = [];
              
              // Build detailed address from most specific to least specific
              // Prioritize area/colony names and specific locations
              if (addr.house_number) addressParts.push(addr.house_number);
              if (addr.road || addr.street) addressParts.push(addr.road || addr.street);
              
              // Prioritize area/colony names - these are most important for pinpoint location
              if (addr.suburb) addressParts.push(addr.suburb);
              if (addr.neighbourhood) addressParts.push(addr.neighbourhood);
              if (addr.quarter) addressParts.push(addr.quarter);
              if (addr.hamlet) addressParts.push(addr.hamlet);
              if (addr.village) addressParts.push(addr.village);
              if (addr.city_district) addressParts.push(addr.city_district);
              if (addr.district) addressParts.push(addr.district);
              if (addr.borough) addressParts.push(addr.borough);
              
              // Add city for context, but avoid duplicates
              if (addr.city && !addressParts.includes(addr.city)) addressParts.push(addr.city);
              if (addr.town && !addressParts.includes(addr.town)) addressParts.push(addr.town);
              if (addr.municipality && !addressParts.includes(addr.municipality)) addressParts.push(addr.municipality);
              
              if (addr.county) addressParts.push(addr.county);
              if (addr.state || addr.province) addressParts.push(addr.state || addr.province);
              if (addr.postcode) addressParts.push(addr.postcode);
              // Don't add country to keep address shorter and more local
              
              const fullAddress = addressParts.join(', ');
              if (fullAddress.length > 15) { // Ensure we got a meaningful address
                return fullAddress;
              }
              
              // If parsed address is too short, try using display_name
              if (data.display_name && data.display_name.length > fullAddress.length) {
                return data.display_name;
              }
              
              // If we still don't have a good address, try to build one from available data
              if (fullAddress.length < 10) {
                const fallbackParts = [];
                if (addr.road || addr.street) fallbackParts.push(addr.road || addr.street);
                if (addr.suburb || addr.neighbourhood) fallbackParts.push(addr.suburb || addr.neighbourhood);
                if (addr.city && !fallbackParts.includes(addr.city)) fallbackParts.push(addr.city);
                if (addr.state && !fallbackParts.includes(addr.state)) fallbackParts.push(addr.state);
                if (addr.postcode) fallbackParts.push(addr.postcode);
                
                if (fallbackParts.length > 0) {
                  return fallbackParts.join(', ');
                }
              }
            }
          } else if (service.type === 'bigdatacloud') {
            // BigDataCloud response
            if (data.localityInfo && data.localityInfo.administrative) {
              const addressParts = [];
              
              // Try to get more detailed information from BigDataCloud
              if (data.locality) addressParts.push(data.locality);
              if (data.principalSubdivision) addressParts.push(data.principalSubdivision);
              if (data.countryName) addressParts.push(data.countryName);
              
              const address = addressParts.join(', ');
              if (address.length > 15) {
                return address;
              }
            }
            
            // Also try the main data fields
            if (data.locality || data.principalSubdivision || data.countryName) {
              const addressParts = [];
              if (data.locality) addressParts.push(data.locality);
              if (data.principalSubdivision) addressParts.push(data.principalSubdivision);
              if (data.countryName) addressParts.push(data.countryName);
              
              const address = addressParts.join(', ');
              if (address.length > 15) {
                return address;
              }
            }
          } else if (service.type === 'nominatim_alt') {
            // Alternative Nominatim response with different parameters
            if (data.address) {
              const addr = data.address;
              const addressParts = [];
              
              // Try to get more specific information
              if (addr.house_number) addressParts.push(addr.house_number);
              if (addr.road || addr.street) addressParts.push(addr.road || addr.street);
              if (addr.suburb || addr.neighbourhood) addressParts.push(addr.suburb || addr.neighbourhood);
              if (addr.city_district || addr.district) addressParts.push(addr.city_district || addr.district);
              if (addr.city || addr.town) addressParts.push(addr.city || addr.town);
              if (addr.state) addressParts.push(addr.state);
              if (addr.postcode) addressParts.push(addr.postcode);
              
              const fullAddress = addressParts.join(', ');
              if (fullAddress.length > 15) {
                return fullAddress;
              }
            }
            
            // Fallback to display_name if available
            if (data.display_name) {
              return data.display_name;
            }
          }
        } catch (serviceError) {
          console.log(`Service ${service.type} failed, trying next: ${serviceError.message}`);
          continue;
        }
      }
      
      // If all services fail, try to build a basic address from coordinates
      // This is a fallback when no geocoding service works
      return `GPS Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  }, []);

  // Handle map location selection
  const handleMapLocationSelect = useCallback(async (location) => {
    setCurrentLocation(location);
    setValue('latitude', location.latitude);
    setValue('longitude', location.longitude);
    
    // Get readable address using reverse geocoding
    const address = await reverseGeocode(location.latitude, location.longitude);
    setCurrentAddress(address);
    setValue('address', address);
    
    console.log(`Location updated: ${address}`);
  }, [setValue, reverseGeocode]);

  // Voice transcription functions
  const startVoiceTranscription = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        console.error('Failed to start voice transcription');
      }
    }
  };

  const stopVoiceTranscription = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          setValue('latitude', latitude);
          setValue('longitude', longitude);
          
          // Get readable address using reverse geocoding
          const address = await reverseGeocode(latitude, longitude);
          setCurrentAddress(address);
          setValue('address', address);
          
          setIsLoadingLocation(false);
          setLocationLoaded(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
          console.error('Failed to get location. Please enable location access.');
        }
      );
    } else {
      setIsLoadingLocation(false);
      console.error('Geolocation is not supported by this browser.');
    }
  };

  // Capture image from camera
  const captureImage = () => {
    setIsCapturing(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera on mobile
        } 
      })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
          console.error('Failed to access camera');
          setIsCapturing(false);
        });
    } else {
      console.error('Camera not supported');
      setIsCapturing(false);
    }
  };

  // Take photo
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      
      // Stop camera
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      setIsCapturing(false);
      processImageWithAI(imageData);
    }
  };

  // Process image with AI
  const processImageWithAI = async (imageData) => {
    setIsProcessing(true);
    
    try {
      if (!model) {
        console.error('AI model not loaded yet. Please wait...');
        setIsProcessing(false);
        return;
      }

      // Create an image element from the data URL
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageData;
      });

      // Get prediction from the model
      const prediction = await model.predict(img);
      
      // Find the highest confidence prediction
      let maxConfidence = 0;
      let predictedClass = '';
      
      for (let i = 0; i < prediction.length; i++) {
        if (prediction[i].probability > maxConfidence) {
          maxConfidence = prediction[i].probability;
          predictedClass = prediction[i].className;
        }
      }

      const aiPrediction = {
        className: predictedClass,
        probability: maxConfidence
      };
      
      setAiPrediction(aiPrediction);
      
      if (aiPrediction.probability > CONFIDENCE_THRESHOLD) {
        const category = aiPrediction.className;
        setValue('category', category);
        setValue('department', DEPARTMENT_MAPPING[category]);
        
        // Auto-generate description
        const template = DESCRIPTION_TEMPLATES[category];
        const address = currentAddress || (currentLocation ? 
          `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}` : 
          '[ADDRESS]');
        const description = template.replace('[ADDRESS]', address);
        setValue('description', description);
        
        console.log(`AI detected: ${category} (${(aiPrediction.probability * 100).toFixed(1)}% confidence)`);
      } else {
        console.warn('AI confidence too low. Please select category manually.');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      console.error('Failed to process image with AI');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setCapturedImage(imageData);
        processImageWithAI(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form
  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const complaintData = {
        ...data,
        image: capturedImage,
        aiPrediction: aiPrediction,
        userId: user.id,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      console.log('Complaint submitted:', complaintData);
      console.log('Complaint submitted successfully!');
      
      // Store complaint submission flag in localStorage to trigger progress bar
      const submissionTime = new Date().toISOString();
      localStorage.setItem('complaintSubmitted', 'true');
      localStorage.setItem('complaintSubmittedTime', submissionTime);
      
      console.log('Stored localStorage flags:', {
        complaintSubmitted: localStorage.getItem('complaintSubmitted'),
        complaintSubmittedTime: localStorage.getItem('complaintSubmittedTime')
      });
      
      navigate('/citizen');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      console.error('Failed to submit complaint');
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <button
                onClick={() => navigate('/citizen')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  Report Issue
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  Step {step} of 3
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors flex-shrink-0"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {/* AI Model Status */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-dark-700 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600">
              {modelLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI Model</span>
                </>
              ) : aiModelLoaded ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">AI Model</span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">AI Model</span>
                </>
              )}
            </div>

            {/* Location Status */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-dark-700 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600">
              {isLoadingLocation ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                </>
              ) : locationLoaded ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Location</span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Location</span>
                </>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 1: Image Capture */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card dark:card-dark"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Capture the Issue
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Take a clear photo or upload an image of the civic issue
                  </p>
                  
                  {/* Model Loading Status */}
                  {modelLoading && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        <span className="text-sm text-blue-600 dark:text-blue-400">
                          Loading AI model...
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {!capturedImage ? (
                  <div className="space-y-4">
                    {/* Camera Capture */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={captureImage}
                        disabled={isCapturing || modelLoading}
                        className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Camera className="w-5 h-5" />
                        <span>{isCapturing ? 'Accessing Camera...' : 'Take Photo'}</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={modelLoading}
                        className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Upload Image</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {/* Camera Preview */}
                    {isCapturing && (
                      <div className="relative bg-gray-100 dark:bg-dark-700 rounded-lg overflow-hidden">
                        <video
                          ref={videoRef}
                          className="w-full h-64 object-cover"
                          autoPlay
                          muted
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                          <button
                            type="button"
                            onClick={takePhoto}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
                          >
                            <Camera className="w-6 h-6 text-gray-800" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const stream = videoRef.current?.srcObject;
                              if (stream) {
                                stream.getTracks().forEach(track => track.stop());
                              }
                              setIsCapturing(false);
                            }}
                            className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                          >
                            <X className="w-6 h-6 text-white" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={capturedImage}
                        alt="Captured issue"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setCapturedImage(null)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    {/* AI Processing Status */}
                    {isProcessing && (
                      <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        <span className="text-blue-600 dark:text-blue-400">
                          AI is analyzing the image...
                        </span>
                      </div>
                    )}

                    {/* AI Prediction Results */}
                    {aiPrediction && !isProcessing && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800 dark:text-green-200">
                            AI Detection Results
                          </span>
                        </div>
                        <p className="text-green-700 dark:text-green-300">
                          Detected: <strong>{aiPrediction.className}</strong> 
                          {' '}({Math.round(aiPrediction.probability * 100)}% confidence)
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!capturedImage}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card dark:card-dark"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Edit3 className="w-8 h-8 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Issue Details
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Provide more information about the issue
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Issue Category
                    </label>
                    <select
                      {...register('category', { required: 'Please select a category' })}
                      className={`input-field dark:input-field-dark ${
                        errors.category ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                    >
                      <option value="">Select Category</option>
                      {AI_CLASSES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>

                  {/* Department */}
                  {watchedCategory && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Responsible Department
                      </label>
                      <input
                        type="text"
                        value={DEPARTMENT_MAPPING[watchedCategory] || ''}
                        readOnly
                        className="input-field dark:input-field-dark bg-gray-50 dark:bg-dark-700"
                      />
                    </div>
                  )}

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority Level
                    </label>
                    <select
                      {...register('priority')}
                      className="input-field dark:input-field-dark"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <div className="relative">
                      <textarea
                        {...register('description', { required: 'Please provide a description' })}
                        rows={4}
                        className={`input-field dark:input-field-dark pr-12 ${
                          errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}
                        placeholder="Describe the issue in detail..."
                      />
                      <button
                        type="button"
                        onClick={isListening ? stopVoiceTranscription : startVoiceTranscription}
                        disabled={!recognition}
                        className={`absolute right-3 top-3 p-2 rounded-full transition-all duration-200 ${
                          isListening 
                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        } ${!recognition ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                        title={isListening ? 'Stop voice transcription' : 'Start voice transcription'}
                      >
                        {isListening ? (
                          <MicOff className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                    {!recognition && (
                      <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                        ⚠️ Voice transcription not supported in this browser
                      </p>
                    )}
                    {recognition && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        🎤 Click the microphone to add voice description
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Location & Submit */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card dark:card-dark"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Location & Review
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Confirm the location and review your report
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <div className="space-y-3">
                      {/* Current Location Display */}
                      {currentAddress && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              Current Location:
                            </span>
                          </div>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            {currentAddress}
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <input
                            {...register('address', { required: 'Please provide the address' })}
                            className={`flex-1 input-field dark:input-field-dark ${
                              errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                            }`}
                            placeholder={currentAddress || "Enter the complete address (House No, Street, Area, City, PIN)"}
                            defaultValue={currentAddress || ''}
                          />
                          <button
                            type="button"
                            onClick={getCurrentLocation}
                            disabled={isLoadingLocation}
                            className="btn-secondary flex items-center space-x-2"
                          >
                            {isLoadingLocation ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Globe className="w-4 h-4" />
                            )}
                            <span>{isLoadingLocation ? 'Getting...' : 'Update GPS'}</span>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          💡 For best accuracy, include: House/Flat number, Street name, Area, City, and PIN code
                        </p>
                      </div>
                    </div>
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                    
                    {/* Google Map */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Map Location
                      </label>
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                        <GoogleMap
                          center={currentLocation ? { lat: currentLocation.latitude, lng: currentLocation.longitude } : { lat: 26.8467, lng: 80.9462 }} // Default to Lucknow
                          zoom={15}
                          onLocationSelect={handleMapLocationSelect}
                          currentLocation={currentLocation}
                          className="h-64"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        📍 Click on the map or drag the marker to set the exact location
                      </p>
                    </div>
                  </div>

                  {/* Review Summary */}
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Report Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Category:</span>
                        <span className="text-gray-900 dark:text-white">{watchedCategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Department:</span>
                        <span className="text-gray-900 dark:text-white">
                          {DEPARTMENT_MAPPING[watchedCategory]}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                        <span className="text-gray-900 dark:text-white capitalize">
                          {watch('priority')}
                        </span>
                      </div>
                      {aiPrediction && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">AI Confidence:</span>
                          <span className="text-gray-900 dark:text-white">
                            {Math.round(aiPrediction.probability * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Submit Report</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};

export default ReportComplaint;
