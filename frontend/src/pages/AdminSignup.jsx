import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AdminSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                ...formData,
                role: 'admin',
            });
            login(res.data.user, res.data.token);
            toast.success('Signup successful', { position: "top-right" });

            // Redirect to the previous page if available, otherwise to the dashboard
            const from = location.state?.from?.pathname || '/admin-dashboard';
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed', { position: "top-right" });
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

    const linkHover = {
        hover: { color: '#1e40af', scale: 1.1, transition: { duration: 0.3 } },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md"
            >
                <motion.h1
                    variants={fadeIn}
                    className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900 tracking-tight"
                >
                    Admin Signup
                </motion.h1>
                <form onSubmit={handleSubmit}>
                    <motion.div variants={fadeIn} className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                            required
                        />
                    </motion.div>
                    <motion.div variants={fadeIn} className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                            required
                        />
                    </motion.div>
                    <motion.div variants={fadeIn} className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
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
                        Signup
                    </motion.button>
                </form>
                <motion.p
                    variants={fadeIn}
                    className="mt-6 text-center text-sm sm:text-base"
                >
                    Already have an account?{' '}
                    <motion.a
                        href="/login"
                        whileHover="hover"
                        variants={linkHover}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                        Login
                    </motion.a>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default AdminSignup;