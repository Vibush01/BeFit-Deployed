import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const BookSession = () => {
    const { user } = useContext(AuthContext);
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [bookedSessions, setBookedSessions] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchAvailableSchedules = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/trainer/member/available-schedules', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAvailableSchedules(res.data);
            } catch (err) {
                setError('Failed to fetch available schedules');
                toast.error('Failed to fetch available schedules', { position: 'top-right' });
            }
        };

        const fetchBookedSessions = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/trainer/member/booked-sessions', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookedSessions(res.data);
            } catch (err) {
                setError('Failed to fetch booked sessions');
                toast.error('Failed to fetch booked sessions', { position: 'top-right' });
            }
        };

        if (user?.role === 'member') {
            fetchAvailableSchedules();
            fetchBookedSessions();
        }
    }, [user]);

    const handleBookSession = async (scheduleId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/api/trainer/book-session/${scheduleId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvailableSchedules(availableSchedules.filter((schedule) => schedule._id !== scheduleId));
            setBookedSessions([res.data.schedule, ...bookedSessions]);
            setSuccess('Session booked successfully');
            toast.success('Session booked successfully', { position: 'top-right' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book session');
            toast.error(err.response?.data?.message || 'Failed to book session', { position: 'top-right' });
        }
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900 tracking-tight"
                >
                    Book a Session
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
                {success && (
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="text-green-500 mb-6 text-center text-sm sm:text-base"
                    >
                        {success}
                    </motion.p>
                )}

                {/* Available Schedules */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Available Schedules</h2>
                    {availableSchedules.length > 0 ? (
                        <ul className="space-y-4">
                            {availableSchedules.map((schedule) => (
                                <motion.li
                                    key={schedule._id}
                                    className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={zoomIn}
                                >
                                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                                        <strong>Trainer:</strong> {schedule.trainer.name} ({schedule.trainer.email})
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Start Time:</strong> {new Date(schedule.startTime).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>End Time:</strong> {new Date(schedule.endTime).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Status:</strong> {schedule.status}
                                    </p>
                                    <motion.div className="mt-3">
                                        <motion.button
                                            onClick={() => handleBookSession(schedule._id)}
                                            whileHover="hover"
                                            variants={buttonHover}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
                                        >
                                            Book Session
                                        </motion.button>
                                    </motion.div>
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">
                            No available schedules at the moment
                        </p>
                    )}
                </motion.div>

                {/* Booked Sessions */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Your Booked Sessions</h2>
                    {bookedSessions.length > 0 ? (
                        <ul className="space-y-4">
                            {bookedSessions.map((session) => (
                                <motion.li
                                    key={session._id}
                                    className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={zoomIn}
                                >
                                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                                        <strong>Trainer:</strong> {session.trainer.name} ({session.trainer.email})
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Start Time:</strong> {new Date(session.startTime).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>End Time:</strong> {new Date(session.endTime).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Status:</strong> {session.status}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Created:</strong> {new Date(session.createdAt).toLocaleString()}
                                    </p>
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No booked sessions yet</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default BookSession;