import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const GymProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, userDetails } = useContext(AuthContext);
    const [gym, setGym] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [membershipDuration, setMembershipDuration] = useState('1 month');

    useEffect(() => {
        const fetchGym = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/gym/${id}`);
                setGym(res.data);
            } catch (err) {
                setError('Failed to fetch gym details');
                toast.error('Failed to fetch gym details'+err, { position: 'top-right' });
            }
        };

        fetchGym();
    }, [id]);

    const handleJoinRequest = async () => {
        try {
            const token = localStorage.getItem('token');
            const body = user?.role === 'member' ? { membershipDuration } : {};
            await axios.post(`http://localhost:5000/api/gym/join/${id}`, body, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('Join request sent successfully');
            toast.success('Join request sent successfully', { position: 'top-right' });
            setTimeout(() => navigate('/gyms'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send join request');
            toast.error(err.response?.data?.message || 'Failed to send join request', { position: 'top-right' });
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

    if (!gym) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-gray-700 text-lg sm:text-xl"
                >
                    {error || 'Loading...'}
                </motion.p>
            </div>
        );
    }

    const canJoin = (user?.role === 'member' || user?.role === 'trainer') && !userDetails?.gym;
    const isMemberOrTrainer = (user?.role === 'member' || user?.role === 'trainer') && userDetails?.gym === id;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900 tracking-tight"
                >
                    {gym.gymName}
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
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                >
                    {isMemberOrTrainer && (
                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="text-green-600 mb-4 text-center text-sm sm:text-base font-semibold"
                        >
                            You are already a {user.role === 'member' ? 'member' : 'trainer'} of this gym.
                        </motion.p>
                    )}
                    <p className="text-gray-800 font-medium text-sm sm:text-base mb-2">
                        <strong>Address:</strong> {gym.address}
                    </p>
                    <p className="text-gray-800 font-medium text-sm sm:text-base mb-4">
                        <strong>Owner:</strong> {gym.ownerName} ({gym.ownerEmail})
                    </p>

                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">Photos</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {gym.photos.length > 0 ? (
                                gym.photos.map((photo, index) => (
                                    <motion.img
                                        key={index}
                                        src={photo}
                                        alt={`Gym ${index}`}
                                        className="w-full h-48 object-cover rounded-lg"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={zoomIn}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-700 text-sm sm:text-base">No photos available</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">Membership Plans</h2>
                        {gym.membershipPlans.length > 0 ? (
                            <ul className="space-y-2">
                                {gym.membershipPlans.map((plan, index) => (
                                    <motion.li
                                        key={index}
                                        className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={zoomIn}
                                    >
                                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                                            <strong>Duration:</strong> {plan.duration}
                                        </p>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            <strong>Price:</strong> ${plan.price}
                                        </p>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 text-sm sm:text-base">No membership plans available</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">Members</h2>
                        {gym.members.length > 0 ? (
                            <ul className="space-y-2">
                                {gym.members.map((member) => (
                                    <motion.li
                                        key={member._id}
                                        className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
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
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 text-sm sm:text-base">No members yet</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">Trainers</h2>
                        {gym.trainers.length > 0 ? (
                            <ul className="space-y-2">
                                {gym.trainers.map((trainer) => (
                                    <motion.li
                                        key={trainer._id}
                                        className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
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
                            <p className="text-gray-700 text-sm sm:text-base">No trainers yet</p>
                        )}
                    </div>

                    {canJoin && (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="mt-6"
                        >
                            {user.role === 'member' && (
                                <motion.div variants={fadeIn} className="mb-4">
                                    <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                        Membership Duration
                                    </label>
                                    <select
                                        value={membershipDuration}
                                        onChange={(e) => setMembershipDuration(e.target.value)}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                    >
                                        <option value="1 week">1 Week</option>
                                        <option value="1 month">1 Month</option>
                                        <option value="3 months">3 Months</option>
                                        <option value="6 months">6 Months</option>
                                        <option value="1 year">1 Year</option>
                                    </select>
                                </motion.div>
                            )}
                            <motion.button
                                onClick={handleJoinRequest}
                                whileHover="hover"
                                variants={buttonHover}
                                className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
                                aria-label="Send Join Request"
                            >
                                Send Join Request
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default GymProfile;