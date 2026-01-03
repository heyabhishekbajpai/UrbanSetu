import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { supabase } from '../../supabaseClient';

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setEmailSent(true);
            toast.success('Password reset link sent to your email');
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error(error.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-dark-900 dark:to-dark-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <img src={isDark ? "https://raw.githubusercontent.com/heyabhishekbajpai/UrbanSetu/main/public/logodark.png" : "https://raw.githubusercontent.com/heyabhishekbajpai/UrbanSetu/main/public/logo.png"} alt="UrbanSetu Logo" className="w-10 h-10 object-contain" />
                        </div>
                        <span className="text-2xl font-bold text-gradient">UrbanSetu</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Reset Password
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Enter your email to receive a password reset link
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card dark:card-dark"
                >
                    {!emailSent ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                        className={`input-field dark:input-field-dark pl-16 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                                            }`}
                                        style={{ paddingLeft: '4rem' }}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Sending Link...
                                    </div>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Check your email
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                We have sent a password reset link to your email address.
                            </p>
                            <button
                                onClick={() => setEmailSent(false)}
                                className="text-primary-600 hover:text-primary-500 font-medium"
                            >
                                Try another email
                            </button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </Link>
                    </div>
                </motion.div>

                {/* Theme Toggle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 text-center"
                >
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg glass-effect dark:glass-effect-dark hover:bg-white/20 transition-colors"
                    >
                        {isDark ? '☀️' : '🌙'}
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
