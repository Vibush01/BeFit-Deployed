import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, userDetails, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Determine if the user can access the Chat page
    const canAccessChat = () => {
        if (!user) return false;
        if (user.role === 'gym') return true; // Gym Profiles can always access Chat
        return (user.role === 'member' || user.role === 'trainer') && userDetails?.gym; // Members and Trainers need to be in a gym
    };

    // Determine if the user can access gym-dependent features (Request Plan, Book a Session)
    const canAccessGymFeatures = () => {
        return user?.role === 'member' && userDetails?.gym;
    };

    // Animation Variants
    const fadeIn = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    const fadeInLink = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <motion.nav
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-4 shadow-lg sticky top-0 z-50"
        >
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-3xl font-extrabold tracking-tight hover:text-blue-200 transition-all duration-300">
                    BeFit
                </Link>

                {/* Hamburger Menu for Mobile */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                        <motion.svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </motion.svg>
                    </button>
                </div>

                {/* Links (Desktop) */}
                <motion.div
                    variants={fadeIn}
                    className="hidden md:flex items-center space-x-6"
                >
                    {user ? (
                        <>
                            {(user.role === 'gym' || user.role === 'trainer') && (
                                <Link to="/gym-dashboard" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Dashboard</Link>
                            )}
                            {(user.role === 'member' || user.role === 'trainer') && (
                                userDetails?.gym ? (
                                    <Link to={`/gym/${userDetails.gym}`} className="text-white hover:text-blue-200 transition-all duration-300 font-medium">My Gym</Link>
                                ) : (
                                    <Link to="/gyms" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Find a Gym</Link>
                                )
                            )}
                            {canAccessChat() && (
                                <Link to="/chat" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Chat</Link>
                            )}
                            {user.role === 'member' && userDetails?.gym && (
                                <Link to="/announcements" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Announcements</Link>
                            )}
                            {user.role === 'member' && (
                                <>
                                    <Link to="/member-dashboard" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Dashboard</Link>
                                    {canAccessGymFeatures() && (
                                        <>
                                            <Link to="/request-plan" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Request Plan</Link>
                                            <Link to="/book-session" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Book a Session</Link>
                                        </>
                                    )}
                                    <Link to="/macro-calculator" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Macro Calculator</Link>
                                    <Link to="/progress-tracker" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Progress Tracker</Link>
                                </>
                            )}
                            {user.role === 'trainer' && userDetails?.gym && (
                                <>
                                    <Link to="/workout-plans" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Workout Plans</Link>
                                    <Link to="/manage-schedule" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Manage Schedule</Link>
                                    <Link to="/view-bookings" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">View Bookings</Link>
                                    {/* <Link to="/scheduling" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Scheduling</Link> */}
                                </>
                            )}
                            {user.role === 'gym' && (
                                <Link to="/update-gym" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Update Gym</Link>
                            )}
                            {user.role === 'admin' && (
                                <Link to="/admin-dashboard" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Dashboard</Link>
                            )}
                            <Link to="/profile" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Profile</Link>
                            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Signup</Link>
                            <Link to="/login" className="text-white hover:text-blue-200 transition-all duration-300 font-medium">Login</Link>
                        </>
                    )}
                </motion.div>
            </div>

            {/* Mobile Menu */}
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden overflow-hidden"
            >
                <div className="flex flex-col space-y-4 mt-6">
                    {user ? (
                        <>
                            {(user.role === 'gym' || user.role === 'trainer') && (
                                <Link to="/gym-dashboard" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Dashboard</Link>
                            )}
                            {(user.role === 'member' || user.role === 'trainer') && (
                                userDetails?.gym ? (
                                    <Link to={`/gym/${userDetails.gym}`} className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>My Gym</Link>
                                ) : (
                                    <Link to="/gyms" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Find a Gym</Link>
                                )
                            )}
                            {canAccessChat() && (
                                <Link to="/chat" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Chat</Link>
                            )}
                            {user.role === 'member' && userDetails?.gym && (
                                <Link to="/announcements" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Announcements</Link>
                            )}
                            {user.role === 'member' && (
                                <>
                                    <Link to="/member-dashboard" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                    {canAccessGymFeatures() && (
                                        <>
                                            <Link to="/request-plan" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Request Plan</Link>
                                            <Link to="/book-session" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Book a Session</Link>
                                        </>
                                    )}
                                    <Link to="/macro-calculator" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Macro Calculator</Link>
                                    <Link to="/progress-tracker" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Progress Tracker</Link>
                                </>
                            )}
                            {user.role === 'trainer' && userDetails?.gym && (
                                <>
                                    <Link to="/workout-plans" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Workout Plans</Link>
                                    <Link to="/manage-schedule" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Manage Schedule</Link>
                                    <Link to="/view-bookings" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>View Bookings</Link>
                                    {/* <Link to="/scheduling" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Scheduling</Link> */}
                                </>
                            )}
                            {user.role === 'gym' && (
                                <Link to="/update-gym" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Update Gym</Link>
                            )}
                            {user.role === 'admin' && (
                                <Link to="/admin-dashboard" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Dashboard</Link>
                            )}
                            <Link to="/profile" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Profile</Link>
                            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-white hover:text-blue-200 transition-all duration-300 font-medium text-left">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Signup</Link>
                            <Link to="/login" className="text-white hover:text-blue-200 transition-all duration-300 font-medium" onClick={() => setIsOpen(false)}>Login</Link>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.nav>
    );
};

export default Navbar;