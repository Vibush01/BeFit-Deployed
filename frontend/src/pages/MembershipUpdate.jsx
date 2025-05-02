import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const MembershipUpdate = () => {
    const { user, userDetails } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [requestedDuration, setRequestedDuration] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/member/membership-requests', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRequests(res.data);
            } catch (err) {
                toast.error('Failed to fetch membership requests'+err, { position: "top-right" });
            }
        };

        if (user?.role === 'member') {
            fetchRequests();
        }
    }, [user]);

    const handleRequest = async () => {
        if (!requestedDuration) {
            toast.error('Please select a duration', { position: "top-right" });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/member/membership-request', {
                requestedDuration,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests([res.data.membershipRequest, ...requests]);
            setRequestedDuration('');
            toast.success('Membership request sent successfully', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send membership request', { position: "top-right" });
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

    if (!userDetails?.gym) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    You must be in a gym to request a membership update.
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
                    Membership Update
                </motion.h1>

                {/* Current Membership */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Current Membership</h2>
                    <p className="text-gray-800 font-medium text-sm sm:text-base mb-2">
                        <strong>Duration:</strong> {userDetails?.membership?.duration || 'N/A'}
                    </p>
                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                        <strong>End Date:</strong> {userDetails?.membership?.endDate ? new Date(userDetails.membership.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                </motion.div>

                {/* Request Membership Update */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Request Membership Update</h2>
                    <motion.div variants={fadeIn} className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                            Requested Duration
                        </label>
                        <select
                            value={requestedDuration}
                            onChange={(e) => setRequestedDuration(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                        >
                            <option value="">Select duration</option>
                            <option value="1 week">1 Week</option>
                            <option value="1 month">1 Month</option>
                            <option value="3 months">3 Months</option>
                            <option value="6 months">6 Months</option>
                            <option value="1 year">1 Year</option>
                        </select>
                    </motion.div>
                    <motion.button
                        onClick={handleRequest}
                        whileHover="hover"
                        variants={buttonHover}
                        className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
                        aria-label="Send Membership Request"
                    >
                        Send Request
                    </motion.button>
                </motion.div>

                {/* Membership Requests */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Your Membership Requests</h2>
                    {requests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-3 sm:p-4">Gym</th>
                                        <th className="p-3 sm:p-4">Requested Duration</th>
                                        <th className="p-3 sm:p-4">Status</th>
                                        <th className="p-3 sm:p-4">Requested On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request) => (
                                        <motion.tr
                                            key={request._id}
                                            className="border-b hover:bg-gray-50 transition-all duration-300"
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            variants={zoomIn}
                                        >
                                            <td className="p-3 sm:p-4 font-medium text-gray-800">{request.gym.gymName}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{request.requestedDuration}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{request.status}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{new Date(request.createdAt).toLocaleString()}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No membership requests yet</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default MembershipUpdate;