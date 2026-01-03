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
    Phone,
    Mail,
    Calendar,
    Save,
    Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { supabase } from '../../supabaseClient';

const AdminComplaintDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    // Fetch complaint data
    useEffect(() => {
        const loadComplaint = async () => {
            setLoading(true);
            try {
                // Fetch complaint with reporter details
                const { data, error } = await supabase
                    .from('complaints')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data) {
                    // Fetch reporter name manually to be safe
                    let reporterName = 'Anonymous';
                    let reporterPhone = 'N/A';
                    let reporterEmail = 'N/A';

                    if (data.user_id) {
                        const { data: profileData } = await supabase
                            .from('profiles')
                            .select('full_name, phone, email')
                            .eq('id', data.user_id)
                            .single();

                        if (profileData) {
                            reporterName = profileData.full_name || 'Anonymous';
                            reporterPhone = profileData.phone || 'N/A';
                            reporterEmail = profileData.email || 'N/A';
                        }
                    }

                    setComplaint({
                        ...data,
                        reporter: {
                            name: reporterName,
                            phone: reporterPhone,
                            email: reporterEmail
                        },
                        createdAt: new Date(data.created_at),
                        updatedAt: data.updated_at ? new Date(data.updated_at) : null
                    });
                    setNewStatus(data.status);
                }
            } catch (error) {
                console.error('Error loading complaint:', error);
                toast.error('Failed to load complaint details');
            } finally {
                setLoading(false);
            }
        };

        loadComplaint();
    }, [id]);

    const handleStatusUpdate = async () => {
        if (newStatus === complaint.status) return;

        setUpdating(true);
        try {
            const { error } = await supabase
                .from('complaints')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;

            setComplaint(prev => ({ ...prev, status: newStatus, updatedAt: new Date() }));
            toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
            case 'in_progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
            case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Complaint Not Found</h2>
                <button onClick={() => navigate('/admin')} className="btn-primary">Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
            {/* Header */}
            <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admin')}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Complaint Management
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    ID: {complaint.id}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image & Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card dark:card-dark overflow-hidden"
                        >
                            <div className="relative h-64 sm:h-80 -mx-6 -mt-6 mb-6">
                                <img
                                    src={complaint.image_url || 'https://via.placeholder.com/800x400'}
                                    alt={complaint.category}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getStatusColor(complaint.status)}`}>
                                        {complaint.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getPriorityColor(complaint.priority)}`}>
                                        {complaint.priority.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {complaint.category}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                        {complaint.description}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                                    <MapPin className="w-5 h-5" />
                                    <span>{complaint.address || 'No address provided'}</span>
                                </div>

                                {complaint.ai_prediction && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                                            AI Analysis
                                        </h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-400">
                                            Detected <strong>{complaint.ai_prediction.className}</strong> with {Math.round(complaint.ai_prediction.probability * 100)}% confidence.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Admin Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card dark:card-dark"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Save className="w-5 h-5 mr-2" />
                                Update Status
                            </h3>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="flex-1 input-field dark:input-field-dark"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="rejected">Rejected</option>
                                </select>

                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={updating || newStatus === complaint.status}
                                    className="w-full sm:w-auto btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updating ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <CheckCircle className="w-5 h-5" />
                                    )}
                                    <span>Update Status</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Reporter Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="card dark:card-dark"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                Reporter Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{complaint.reporter.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Citizen</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-dark-700 space-y-3">
                                    <div className="flex items-center space-x-3 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">{complaint.reporter.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">{complaint.reporter.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Reported on {format(complaint.createdAt, 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Department Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card dark:card-dark"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Department
                            </h3>
                            <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600">
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {complaint.department || 'Unassigned'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Responsible for resolution
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminComplaintDetail;
