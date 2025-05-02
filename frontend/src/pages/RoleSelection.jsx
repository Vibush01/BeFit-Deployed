import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RoleSelection = () => {
    // Animation Variants
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const zoomIn = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 } },
    };

    const zoomInChild = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center py-12 px-4"
        >
            <div className="max-w-4xl w-full bg-white p-10 rounded-2xl shadow-2xl">
                <motion.h1
                    variants={fadeIn}
                    className="text-4xl font-bold text-center mb-12 text-gray-900"
                >
                    Choose Your Role
                </motion.h1>
                <motion.div
                    variants={zoomIn}
                    className="grid grid-cols-1 md:grid-cols-4 gap-8"
                >
                    <motion.div variants={zoomInChild}>
                        <Link
                            to="/signup/admin"
                            className="block bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="text-center">
                                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <h2 className="text-xl font-semibold">Admin</h2>
                            </div>
                        </Link>
                    </motion.div>
                    <motion.div variants={zoomInChild}>
                        <Link
                            to="/signup/gym"
                            className="block bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="text-center">
                                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4"></path>
                                </svg>
                                <h2 className="text-xl font-semibold">Gym Profile</h2>
                            </div>
                        </Link>
                    </motion.div>
                    <motion.div variants={zoomInChild}>
                        <Link
                            to="/signup/trainer"
                            className="block bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="text-center">
                                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                <h2 className="text-xl font-semibold">Trainer</h2>
                            </div>
                        </Link>
                    </motion.div>
                    <motion.div variants={zoomInChild}>
                        <Link
                            to="/signup/member"
                            className="block bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="text-center">
                                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                <h2 className="text-xl font-semibold">Member</h2>
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>
                <motion.p
                    variants={fadeIn}
                    className="text-center mt-12 text-gray-600"
                >
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                        Sign In
                    </Link>
                </motion.p>
            </div>
        </motion.div>
    );
};

export default RoleSelection;