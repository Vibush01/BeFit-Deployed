import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Announcements = () => {
    const { user, userDetails } = useContext(AuthContext);
    const [announcements, setAnnouncements] = useState([]);
    const [error, setError] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!user || !userDetails || !userDetails.gym) {
            setError('You must be in a gym to view announcements');
            return;
        }

        // Initialize Socket.IO
        const socketInstance = io('http://localhost:5000');
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            socketInstance.emit('joinGym', userDetails.gym);
        });

        socketInstance.on('announcement', (announcement) => {
            setAnnouncements((prev) => [announcement, ...prev]);
        });

        socketInstance.on('announcementUpdate', (updatedAnnouncement) => {
            setAnnouncements((prev) =>
                prev.map((ann) => (ann._id === updatedAnnouncement._id ? updatedAnnouncement : ann))
            );
        });

        socketInstance.on('announcementDelete', (announcementId) => {
            setAnnouncements((prev) => prev.filter((ann) => ann._id !== announcementId));
        });

        // Fetch announcements
        const fetchAnnouncements = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/chat/announcements', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAnnouncements(res.data);
            } catch (err) {
                setError('Failed to fetch announcements');
                toast.error('Failed to fetch announcements'+err, { position: "top-right" });
            }
        };

        fetchAnnouncements();

        return () => {
            socketInstance.disconnect();
        };
    }, [user, userDetails]);

    // Animation Variants
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const zoomIn = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
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

    if (!userDetails?.gym) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    {error}
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
                    Announcements
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
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                >
                    {announcements.length > 0 ? (
                        <ul className="space-y-4">
                            {announcements.map((announcement) => (
                                <motion.li
                                    key={announcement._id}
                                    className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={zoomIn}
                                >
                                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                                        <strong>{announcement.senderModel} ({announcement.sender.name}):</strong>{' '}
                                        {announcement.message}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                                        <strong>Posted:</strong> {new Date(announcement.timestamp).toLocaleString()}
                                    </p>
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No announcements yet</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Announcements;