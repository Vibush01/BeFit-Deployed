import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const RoleSelection = () => {
    const [role, setRole] = useState('');
    const location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!role) {
            toast.error('Please select a role', { position: "top-right" });
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
                    Select Role
                </motion.h1>
                <form onSubmit={handleSubmit}>
                    <motion.div variants={fadeIn} className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                            Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="gym">Gym Profile</option>
                            <option value="trainer">Trainer</option>
                            <option value="member">Member</option>
                        </select>
                    </motion.div>
                    {role && (
                        <motion.div whileHover="hover" variants={buttonHover}>
                            <Link
                                to={`/signup/${role}`}
                                state={{ from: location.state?.from }}
                                className="block w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-all duration-300 text-center text-sm sm:text-base font-semibold"
                                aria-label="Continue to Signup"
                            >
                                Continue
                            </Link>
                        </motion.div>
                    )}
                </form>
                <motion.p
                    variants={fadeIn}
                    className="mt-6 text-center text-sm sm:text-base"
                >
                    Already have an account?{' '}
                    <motion.span whileHover="hover" variants={linkHover}>
                        <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                            Login
                        </a>
                    </motion.span>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default RoleSelection;