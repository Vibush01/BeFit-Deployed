import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [gyms, setGyms] = useState([]);
    const [selectedGym, setSelectedGym] = useState(null);
    const [contactMessages, setContactMessages] = useState([]);
    const [toggleview, setToggleView] = useState(false);
    const [analytics, setAnalytics] = useState({
        pageViews: [],
        userDistribution: [],
        events: [],
    });

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/admin/gyms', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setGyms(res.data);
            } catch (err) {
                toast.error('Failed to fetch gyms'+err, { position: "top-right" });
            }
        };

        const fetchContactMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/contact/messages', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setContactMessages(res.data);
            } catch (err) {
                toast.error('Failed to fetch contact messages'+err, { position: "top-right" });
            }
        };

        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/admin/analytics', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAnalytics(res.data);
            } catch (err) {
                toast.error('Failed to fetch analytics data'+err, { position: "top-right" });
            }
        };

        if (user?.role === 'admin') {
            fetchGyms();
            fetchContactMessages();
            fetchAnalytics();
        }
    }, [user]);

    const handleViewGym = (gym) => {
        setSelectedGym(gym);
        setToggleView(!toggleview);
    };

    const handleDeleteGym = async (gymId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/admin/gyms/${gymId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGyms(gyms.filter((gym) => gym._id !== gymId));
            setSelectedGym(null);
            toast.success('Gym deleted successfully', { position: "top-right" });
        } catch (err) {
            toast.error('Failed to delete gym'+err, { position: "top-right" });
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/contact/messages/${messageId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContactMessages(contactMessages.filter((message) => message._id !== messageId));
            toast.success('Contact message deleted successfully', { position: "top-right" });
        } catch (err) {
            toast.error('Failed to delete contact message'+err, { position: "top-right" });
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

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    Access denied. This page is only for Admins.
                </motion.p>
            </div>
        );
    }

    // Prepare chart data
    const pageViewsData = {
        labels: analytics.pageViews.map((pv) => pv._id),
        datasets: [
            {
                label: 'Page Views',
                data: analytics.pageViews.map((pv) => pv.count),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const userDistributionData = {
        labels: analytics.userDistribution.map((ud) => ud._id),
        datasets: [
            {
                label: 'User Distribution',
                data: analytics.userDistribution.map((ud) => ud.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900 tracking-tight"
                >
                    Admin Dashboard
                </motion.h1>

                {/* Gyms List */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Gyms</h2>
                    {gyms.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-3 sm:p-4">Gym Name</th>
                                        <th className="p-3 sm:p-4">Address</th>
                                        <th className="p-3 sm:p-4">Owner Name</th>
                                        <th className="p-3 sm:p-4">Owner Email</th>
                                        <th className="p-3 sm:p-4">Email</th>
                                        <th className="p-3 sm:p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gyms.map((gym) => (
                                        <motion.tr
                                            key={gym._id}
                                            className="border-b hover:bg-gray-50 transition-all duration-300"
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            variants={zoomIn}
                                        >
                                            <td className="p-3 sm:p-4 font-medium text-gray-800">{gym.gymName}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{gym.address}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{gym.ownerName}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{gym.ownerEmail}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{gym.email}</td>
                                            <td className="p-3 sm:p-4 flex space-x-2">
                                                <motion.button
                                                    onClick={() => handleViewGym(gym)}
                                                    whileHover="hover"
                                                    variants={buttonHover}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 text-sm sm:text-base"
                                                >
                                                    View
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleDeleteGym(gym._id)}
                                                    whileHover="hover"
                                                    variants={buttonHover}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                                >
                                                    Delete
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No gyms found</p>
                    )}
                </motion.div>

                {/* Gym Details (Members and Trainers) */}
                {selectedGym && toggleview && (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
                            Users in {selectedGym.gymName}
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:space-x-8">
                            <div className="flex-1 mb-6 sm:mb-0">
                                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Members</h3>
                                {selectedGym.members.length > 0 ? (
                                    <ul className="space-y-4">
                                        {selectedGym.members.map((member) => (
                                            <motion.li
                                                key={member._id}
                                                className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true }}
                                                variants={zoomIn}
                                            >
                                                <p className="text-gray-800 font-medium text-sm sm:text-base">
                                                    <strong>Name:</strong> {member.name}
                                                </p>
                                                <p className="text-gray-600 text-sm sm:text-base">
                                                    <strong>Email:</strong> {member.email}
                                                </p>
                                                <p className="text-gray-600 text-sm sm:text-base">
                                                    <strong>Membership:</strong> {member.membership?.duration || 'N/A'} (End: {member.membership?.endDate ? new Date(member.membership.endDate).toLocaleDateString() : 'N/A'})
                                                </p>
                                            </motion.li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-700 text-sm sm:text-base">No members</p>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Trainers</h3>
                                {selectedGym.trainers.length > 0 ? (
                                    <ul className="space-y-4">
                                        {selectedGym.trainers.map((trainer) => (
                                            <motion.li
                                                key={trainer._id}
                                                className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true }}
                                                variants={zoomIn}
                                            >
                                                <p className="text-gray-800 font-medium text-sm sm:text-base">
                                                    <strong>Name:</strong> {trainer.name}
                                                </p>
                                                <p className="text-gray-600 text-sm sm:text-base">
                                                    <strong>Email:</strong> {trainer.email}
                                                </p>
                                            </motion.li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-700 text-sm sm:text-base">No trainers</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Contact Messages */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Contact Messages</h2>
                    {contactMessages.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-3 sm:p-4">Name</th>
                                        <th className="p-3 sm:p-4">Email</th>
                                        <th className="p-3 sm:p-4">Phone</th>
                                        <th className="p-3 sm:p-4">Subject</th>
                                        <th className="p-3 sm:p-4">Message</th>
                                        <th className="p-3 sm:p-4">Received On</th>
                                        <th className="p-3 sm:p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contactMessages.map((message) => (
                                        <motion.tr
                                            key={message._id}
                                            className="border-b hover:bg-gray-50 transition-all duration-300"
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            variants={zoomIn}
                                        >
                                            <td className="p-3 sm:p-4 font-medium text-gray-800">{message.name}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{message.email}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{message.phone}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{message.subject}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{message.message}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{new Date(message.createdAt).toLocaleString()}</td>
                                            <td className="p-3 sm:p-4">
                                                <motion.button
                                                    onClick={() => handleDeleteMessage(message._id)}
                                                    whileHover="hover"
                                                    variants={buttonHover}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                                >
                                                    Delete
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No contact messages</p>
                    )}
                </motion.div>

                {/* Analytics Overview (Charts) */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Analytics Overview</h2>
                    <div className="flex flex-col lg:flex-row lg:space-x-8">
                        <motion.div
                            className="flex-1 mb-8 lg:mb-0"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={zoomIn}
                        >
                            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Page Views</h3>
                            <div className="h-64 sm:h-80">
                                <Bar
                                    data={pageViewsData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'top' },
                                            title: { display: true, text: 'Page Views', font: { size: 16 } },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    stepSize: 1,
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            className="flex-1"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={zoomIn}
                        >
                            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">User Distribution</h3>
                            <div className="h-64 sm:h-80">
                                <Pie
                                    data={userDistributionData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'top' },
                                            title: { display: true, text: 'User Distribution', font: { size: 16 } },
                                        },
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Analytics Events */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Analytics - All Events</h2>
                    {analytics.events.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-3 sm:p-4">Event</th>
                                        <th className="p-3 sm:p-4">Page</th>
                                        <th className="p-3 sm:p-4">User</th>
                                        <th className="p-3 sm:p-4">Role</th>
                                        <th className="p-3 sm:p-4">Details</th>
                                        <th className="p-3 sm:p-4">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.events.map((event) => (
                                        <motion.tr
                                            key={event._id}
                                            className="border-b hover:bg-gray-50 transition-all duration-300"
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            variants={zoomIn}
                                        >
                                            <td className="p-3 sm:p-4 font-medium text-gray-800">{event.event}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{event.page || 'N/A'}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{event.user?.name} ({event.user?.email})</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{event.userModel}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{event.details}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{new Date(event.createdAt).toLocaleString()}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No events recorded</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;