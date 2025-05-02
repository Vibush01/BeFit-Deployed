import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const GymDashboard = () => {
    const { user, userDetails } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [announcementForm, setAnnouncementForm] = useState('');
    const [editAnnouncementId, setEditAnnouncementId] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/gym/requests', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRequests(res.data);
            } catch (err) {
                toast.error('Failed to fetch join requests'+err, { position: "top-right" });
            }
        };

        const fetchAnnouncements = async () => {
            if (user?.role === 'gym') {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get('http://localhost:5000/api/chat/announcements/gym', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setAnnouncements(res.data);
                } catch (err) {
                    toast.error('Failed to fetch announcements'+err, { position: "top-right" });
                }
            }
        };

        if (user?.role === 'gym' || (user?.role === 'trainer' && userDetails?.gym)) {
            fetchRequests();
        }
        if (user?.role === 'gym') {
            fetchAnnouncements();
        }
    }, [user, userDetails]);

    const handleAccept = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/gym/requests/${requestId}/accept`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(requests.filter((req) => req._id !== requestId));
            toast.success('Request accepted', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to accept request', { position: "top-right" });
        }
    };

    const handleDeny = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/gym/requests/${requestId}/deny`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(requests.filter((req) => req._id !== requestId));
            toast.success('Request denied', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to deny request', { position: "top-right" });
        }
    };

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        if (!announcementForm.trim()) {
            toast.error('Announcement message is required', { position: "top-right" });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (editAnnouncementId) {
                const res = await axios.put(`http://localhost:5000/api/chat/announcements/${editAnnouncementId}`, { message: announcementForm }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAnnouncements(announcements.map((ann) => (ann._id === editAnnouncementId ? res.data.announcement : ann)));
                setEditAnnouncementId(null);
                toast.success('Announcement updated', { position: "top-right" });
            } else {
                const res = await axios.post('http://localhost:5000/api/chat/announcements', { message: announcementForm }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAnnouncements([res.data.announcement, ...announcements]);
                toast.success('Announcement posted', { position: "top-right" });
            }
            setAnnouncementForm('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post announcement', { position: "top-right" });
        }
    };

    const handleEditAnnouncement = (announcement) => {
        setAnnouncementForm(announcement.message);
        setEditAnnouncementId(announcement._id);
    };

    const handleDeleteAnnouncement = async (announcementId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/chat/announcements/${announcementId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAnnouncements(announcements.filter((ann) => ann._id !== announcementId));
            toast.success('Announcement deleted', { position: "top-right" });
        } catch (err) {
            toast.error('Failed to delete announcement'+err, { position: "top-right" });
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

    if (user?.role !== 'gym' && user?.role !== 'trainer') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    Access denied. This page is only for Gym Profiles and Trainers.
                </motion.p>
            </div>
        );
    }

    const isTrainerInGym = user?.role === 'trainer' && userDetails?.gym;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900 tracking-tight"
                >
                    {user.role === 'gym' ? 'Gym Dashboard' : 'Trainer Dashboard'}
                </motion.h1>

                {/* Quick Links for Trainers Not in a Gym */}
                {user.role === 'trainer' && !isTrainerInGym && (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Quick Links</h2>
                        <div className="flex flex-col space-y-4">
                            <motion.div whileHover="hover" variants={buttonHover}>
                                <Link
                                    to="/gyms"
                                    className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 text-center text-sm sm:text-base font-semibold"
                                >
                                    Find Gym
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* Announcements Section for Gym Profile */}
                {user.role === 'gym' && (
                    <div className="mb-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
                                {editAnnouncementId ? 'Edit Announcement' : 'Post Announcement'}
                            </h2>
                            <form onSubmit={handlePostAnnouncement}>
                                <motion.div variants={fadeIn} className="mb-6">
                                    <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                        Message
                                    </label>
                                    <textarea
                                        value={announcementForm}
                                        onChange={(e) => setAnnouncementForm(e.target.value)}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                        rows="3"
                                        required
                                    />
                                </motion.div>
                                <motion.button
                                    type="submit"
                                    whileHover="hover"
                                    variants={buttonHover}
                                    className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
                                >
                                    {editAnnouncementId ? 'Update Announcement' : 'Post Announcement'}
                                </motion.button>
                                {editAnnouncementId && (
                                    <motion.button
                                        type="button"
                                        onClick={() => {
                                            setEditAnnouncementId(null);
                                            setAnnouncementForm('');
                                        }}
                                        whileHover="hover"
                                        variants={buttonHover}
                                        className="w-full bg-gray-500 text-white p-4 rounded-lg mt-2 hover:bg-gray-600 transition-all duration-300 text-sm sm:text-base font-semibold"
                                    >
                                        Cancel
                                    </motion.button>
                                )}
                            </form>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Your Announcements</h2>
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
                                                <strong>Message:</strong> {announcement.message}
                                            </p>
                                            <p className="text-gray-600 text-sm sm:text-base">
                                                <strong>Posted:</strong> {new Date(announcement.timestamp).toLocaleString()}
                                            </p>
                                            <div className="mt-3 flex space-x-2">
                                                <motion.button
                                                    onClick={() => handleEditAnnouncement(announcement)}
                                                    whileHover="hover"
                                                    variants={buttonHover}
                                                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300 text-sm sm:text-base"
                                                >
                                                    Edit
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                                                    whileHover="hover"
                                                    variants={buttonHover}
                                                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                                >
                                                    Delete
                                                </motion.button>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-700 text-center text-sm sm:text-base">No announcements posted yet</p>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* Join Requests Section (Only for Gym or Trainer in a Gym) */}
                {(user.role === 'gym' || isTrainerInGym) && (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
                            {user.role === 'gym' ? 'Join Requests' : 'Member Join Requests'}
                        </h2>
                        {requests.length > 0 ? (
                            <ul className="space-y-4">
                                {requests.map((request) => (
                                    <motion.li
                                        key={request._id}
                                        className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={zoomIn}
                                    >
                                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                                            <strong>{request.userModel}:</strong> {request.user.name} ({request.user.email})
                                        </p>
                                        {request.userModel === 'Member' && (
                                            <p className="text-gray-600 text-sm sm:text-base">
                                                <strong>Membership Duration:</strong> {request.membershipDuration}
                                            </p>
                                        )}
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            <strong>Requested on:</strong> {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="mt-3 flex space-x-2">
                                            <motion.button
                                                onClick={() => handleAccept(request._id)}
                                                whileHover="hover"
                                                variants={buttonHover}
                                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 text-sm sm:text-base"
                                            >
                                                Accept
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDeny(request._id)}
                                                whileHover="hover"
                                                variants={buttonHover}
                                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                            >
                                                Deny
                                            </motion.button>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 text-center text-sm sm:text-base">No pending join requests</p>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default GymDashboard;