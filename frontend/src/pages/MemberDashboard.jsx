import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const MemberDashboard = () => {
    const { user, userDetails } = useContext(AuthContext);
    const [error, setError] = useState('');

    // Animation Variants
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const zoomIn = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const buttonHover = {
        hover: { scale: 1.05, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', transition: { duration: 0.3 } },
    };

    if (user?.role !== 'member') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    Access denied. This page is only for Members.
                </motion.p>
            </div>
        );
    }

    const isInGym = !!userDetails?.gym;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900 tracking-tight"
                >
                    Member Dashboard
                </motion.h1>
                {error && (
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="text-red-500 mb-6 text-center text-sm sm:text-base"
                    >
                        {error}
                    </motion.p>
                )}

                {/* Quick Links */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Quick Links</h2>
                    <div className="flex flex-col space-y-4">
                        {isInGym ? (
                            <>
                                <motion.div whileHover="hover" variants={buttonHover}>
                                    <Link
                                        to="/request-plan"
                                        className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 text-center text-sm sm:text-base font-semibold"
                                    >
                                        Request Workout & Diet Plans
                                    </Link>
                                </motion.div>
                                <motion.div whileHover="hover" variants={buttonHover}>
                                    <Link
                                        to="/book-session"
                                        className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 text-center text-sm sm:text-base font-semibold"
                                    >
                                        Book a Session
                                    </Link>
                                </motion.div>
                            </>
                        ) : (
                            <motion.div whileHover="hover" variants={buttonHover}>
                                <Link
                                    to="/gyms"
                                    className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 text-center text-sm sm:text-base font-semibold"
                                >
                                    Find Gym
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MemberDashboard;