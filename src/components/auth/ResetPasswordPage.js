import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { supabase } from '../../supabaseClient';

const ResetPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password');

    useEffect(() => {
        // Check if we have a session (user clicked the email link)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast.error('Invalid or expired reset link. Please try again.');
                navigate('/forgot-password');
            }
        };
        checkSession();
    }, [navigate]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: data.password,
            });

            if (error) throw error;

            toast.success('Password updated successfully! You can now login.');
            navigate('/login');
        } catch (error) {
            console.error('Update password error:', error);
            toast.error(error.message || 'Failed to update password');
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
                        Set New Password
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please enter your new password below
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card dark:card-dark"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters',
                                        },
                                    })}
                                    className={`input-field dark:input-field-dark pl-16 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                                        }`}
                                    style={{ paddingLeft: '4rem' }}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (value) => value === password || 'Passwords do not match',
                                    })}
                                    className={`input-field dark:input-field-dark pl-16 pr-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                                        }`}
                                    style={{ paddingLeft: '4rem' }}
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
                                    Updating...
                                </div>
                            ) : (
                                'Update Password'
                            )}
                        </button>
                    </form>
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

export default ResetPasswordPage;
