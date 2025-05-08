import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ViewBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/trainer/bookings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookings(res.data);
            } catch (err) {
                setError('Failed to fetch bookings');
                toast.error('Failed to fetch bookings'+err, { position: 'top-right' });
            }
        };

        if (user?.role === 'trainer') {
            fetchBookings();
        }
    }, [user]);

    // Animation Variants
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const zoomIn = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    if (user?.role !== 'trainer') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    Access denied. This page is only for Trainers.
                </motion.p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900 tracking-tight"
                >
                    View Bookings
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

                {/* Bookings List */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Your Bookings</h2>
                    {bookings.length > 0 ? (
                        <ul className="space-y-4">
                            {bookings.map((booking) => (
                                <motion.li
                                    key={booking._id}
                                    className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={zoomIn}
                                >
                                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                                        <strong>Member:</strong> {booking.bookedBy.name} ({booking.bookedBy.email})
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Start Time:</strong> {new Date(booking.startTime).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>End Time:</strong> {new Date(booking.endTime).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Status:</strong> {booking.status}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()}
                                    </p>
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No bookings yet</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ViewBookings;