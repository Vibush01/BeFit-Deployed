import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const ManageSchedule = () => {
    const { user } = useContext(AuthContext);
    const [schedules, setSchedules] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        startTime: '',
        endTime: '',
    });

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/trainer/trainer-schedules', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSchedules(res.data);
            } catch (err) {
                setError('Failed to fetch schedules');
                toast.error('Failed to fetch schedules', { position: 'top-right' });
            }
        };

        if (user?.role === 'trainer') {
            fetchSchedules();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = {
                startTime: formData.startTime,
                endTime: formData.endTime,
            };

            const res = await axios.post('http://localhost:5000/api/trainer/trainer-schedules', data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSchedules([res.data.trainerSchedule, ...schedules]);
            setSuccess('Schedule slot posted');
            toast.success('Schedule slot posted', { position: 'top-right' });
            setFormData({
                startTime: '',
                endTime: '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post schedule slot');
            toast.error(err.response?.data?.message || 'Failed to post schedule slot', { position: 'top-right' });
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/trainer/trainer-schedules/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSchedules(schedules.filter((schedule) => schedule._id !== id));
            setSuccess('Schedule slot deleted');
            toast.success('Schedule slot deleted', { position: 'top-right' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete schedule slot');
            toast.error(err.response?.data?.message || 'Failed to delete schedule slot', { position: 'top-right' });
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
                    Manage Schedule
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

                {/* Post Schedule Slot Form */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Post Free Schedule Slot</h2>
                    <form onSubmit={handleSubmit}>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Start Time
                            </label>
                            <input
                                type="datetime-local"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                required
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                End Time
                            </label>
                            <input
                                type="datetime-local"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                required
                            />
                        </motion.div>
                        <motion.button
                            type="submit"
                            whileHover="hover"
                            variants={buttonHover}
                            className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
                        >
                            Post Slot
                        </motion.button>
                    </form>
                </motion.div>

                {/* Schedule Slots List */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Your Schedule Slots</h2>
                    {schedules.length > 0 ? (
                        <ul className="space-y-4">
                            {schedules.map((schedule) => (
                                <motion.li
                                    key={schedule._id}
                                    className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={zoomIn}
                                >
                                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                                        <strong>Start Time:</strong> {new Date(schedule.startTime).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>End Time:</strong> {new Date(schedule.endTime).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Status:</strong> {schedule.status}
                                    </p>
                                    {schedule.bookedBy && (
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            <strong>Booked By:</strong> {schedule.bookedBy.name} ({schedule.bookedBy.email})
                                        </p>
                                    )}
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Created:</strong> {new Date(schedule.createdAt).toLocaleString()}
                                    </p>
                                    {schedule.status === 'available' && (
                                        <motion.div className="mt-3">
                                            <motion.button
                                                onClick={() => handleDelete(schedule._id)}
                                                whileHover="hover"
                                                variants={buttonHover}
                                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                            >
                                                Delete
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No schedule slots posted yet</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ManageSchedule;