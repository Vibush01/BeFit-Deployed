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
        setIsOpen(false);
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
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    };

    const linkHover = {
        hover: { scale: 1.1, transition: { duration: 0.3 } },
    };

    return (
        <nav className="bg-blue-600 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
                    BeFit
                </Link>

                {/* Hamburger Menu for Mobile */}
                <div className="md:hidden">
                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white focus:outline-none"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Toggle Menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </motion.button>
                </div>

                {/* Links (Desktop) */}
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <>
                            {(user.role === 'gym' || user.role === 'trainer') && (
                                <>
                                    <motion.div whileHover="hover" variants={linkHover}>
                                        <Link to="/gym-dashboard" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                            Dashboard
                                        </Link>
                                    </motion.div>
                                    {/* <motion.div whileHover="hover" variants={linkHover}>
                                        <Link to="/membership-management" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                            Membership Management
                                        </Link>
                                    </motion.div> */}
                                </>
                            )}
                            {(user.role === 'member' || user.role === 'trainer') && (
                                userDetails?.gym ? (
                                    <motion.div whileHover="hover" variants={linkHover}>
                                        <Link to={`/gym/${userDetails.gym}`} className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                            My Gym
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <motion.div whileHover="hover" variants={linkHover}>
                                        <Link to="/gyms" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                            Find a Gym
                                        </Link>
                                    </motion.div>
                                )
                            )}
                            {canAccessChat() && (
                                <motion.div whileHover="hover" variants={linkHover}>
                                    <Link to="/chat" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                        Chat
                                    </Link>
                                </motion.div>
                            )}
                            {user.role === 'member' && userDetails?.gym && (
                                <motion.div whileHover="hover" variants={linkHover}>
                                    <Link to="/announcements" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                        Announcements
                                    </Link>
                                </motion.div>
                            )}
                            {user.role === 'member' && (
                                <>
                                    <motion.div whileHover="hover" variants={linkHover}>
                                        <Link to="/member-dashboard" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                            Dashboard
                                        </Link>
                                    </motion.div>
                                    {canAccessGymFeatures() && (
                                        <>
                                            <motion.div whileHover="hover" variants={linkHover}>
                                                <Link to="/request-plan" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                                    Request Plan
                                                </Link>
                                            </motion.div>
                                            <motion.div whileHover="hover" variants={linkHover}>
                                                <Link to="/book-session" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                                    Book a Session
                                                </Link>
                                            </motion.div>
                                            <motion.div whileHover="hover" variants={linkHover}>
                                                <Link to="/membership-update" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                                    Membership Update
                                                </Link>
                                            </motion.div>
                                        </>
                                    )}
                                    <motion.div whileHover="hover" variants={linkHover}>
                                        <Link to="/macro-calculator" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                            Macro Calculator
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover="hover" variants={linkHover}>
                                        <Link to="/progress-tracker" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                            Progress Tracker
                                        </Link>
                                    </motion.div>
                                </>
                            )}
                            {user.role === 'trainer' && userDetails?.gym && (
                                <>
                                    <motion.div whileHover="hover" variants={linkHover}>
                                        <Link to="/membership-management" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                            Membership Management
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover="hover" variants={linkHover}>
                                        <Link to="/workout-plans" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                            Workout Plans
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover="hover" variants={linkHover}>
                                        <Link to="/manage-schedule" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                            Manage Schedule
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover="hover" variants={linkHover}>
                                        <Link to="/view-bookings" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                            View Bookings
                                        </Link>
                                    </motion.div>
                                    {/* <motion.div whileHover="hover" variants={linkHover}>
                                        <Link to="/scheduling" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                            Scheduling
                                        </Link>
                                    </motion.div> */}
                                </>
                            )}
                            {user.role === 'gym' && (
                                <>
                                <motion.div whileHover="hover" variants={linkHover}>
                                <Link to="/membership-management" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                    Membership Management
                                </Link>
                                </motion.div>
                                <motion.div whileHover="hover" variants={linkHover}>
                                    <Link to="/update-gym" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                        Update Gym
                                    </Link>
                                </motion.div>
                                </>
                            )}
                            {user.role === 'admin' && (
                                <motion.div whileHover="hover" variants={linkHover}>
                                    <Link to="/admin-dashboard" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                        Dashboard
                                    </Link>
                                </motion.div>
                            )}
                            <motion.div whileHover="hover" variants={linkHover}>
                                <Link to="/profile" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                    Profile
                                </Link>
                            </motion.div>
                            <motion.button
                                onClick={handleLogout}
                                whileHover="hover"
                                variants={linkHover}
                                className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300"
                                aria-label="Logout"
                            >
                                Logout
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <motion.div whileHover="hover" variants={linkHover}>
                                <Link to="/signup" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                    Signup
                                </Link>
                            </motion.div>
                            <motion.div whileHover="hover" variants={linkHover}>
                                <Link to="/login" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300">
                                    Login
                                </Link>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="md:hidden mt-4 bg-blue-700 p-4 rounded-b-lg"
                >
                    <div className="flex flex-col space-y-3">
                        {user ? (
                            <>
                                {(user.role === 'gym' || user.role === 'trainer') && (
                                    <>
                                        <Link to="/gym-dashboard" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                            Dashboard
                                        </Link>
                                        <Link to="/membership-management" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                            Membership Management
                                        </Link>
                                    </>
                                )}
                                {(user.role === 'member' || user.role === 'trainer') && (
                                    userDetails?.gym ? (
                                        <Link to={`/gym/${userDetails.gym}`} className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                            My Gym
                                        </Link>
                                    ) : (
                                        <Link to="/gyms" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                            Find a Gym
                                        </Link>
                                    )
                                )}
                                {canAccessChat() && (
                                    <Link to="/chat" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                        Chat
                                    </Link>
                                )}
                                {user.role === 'member' && userDetails?.gym && (
                                    <Link to="/announcements" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                        Announcements
                                    </Link>
                                )}
                                {user.role === 'member' && (
                                    <>
                                        <Link to="/member-dashboard" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                            Dashboard
                                        </Link>
                                        {canAccessGymFeatures() && (
                                            <>
                                                <Link to="/request-plan" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                                    Request Plan
                                                </Link>
                                                <Link to="/book-session" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                                    Book a Session
                                                </Link>
                                                <Link to="/membership-update" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                                    Membership Update
                                                </Link>
                                            </>
                                        )}
                                        <Link to="/macro-calculator" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                            Macro Calculator
                                        </Link>
                                        <Link to="/progress-tracker" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                            Progress Tracker
                                        </Link>
                                    </>
                                )}
                                {user.role === 'trainer' && userDetails?.gym && (
                                    <>
                                        <Link to="/workout-plans" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                            Workout Plans
                                        </Link>
                                        <Link to="/manage-schedule" className="text-white hover:text-gray-200 text-sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                            Manage Schedule
                                        </Link>
                                        <Link to="/view-bookings" className="text-white hover:text-gray-200 text.sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                            View Bookings
                                        </Link>
                                        {/* <Link to="/scheduling" className="text-white hover:text-gray-200 text.sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                            Scheduling
                                        </Link> */}
                                    </>
                                )}
                                {user.role === 'gym' && (
                                    <Link to="/update-gym" className="text-white hover:text-gray-200 text.sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                        Update Gym
                                    </Link>
                                )}
                                {user.role === 'admin' && (
                                    <Link to="/admin-dashboard" className="text-white hover:text-gray-200 text.sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                        Dashboard
                                    </Link>
                                )}
                                <Link to="/profile" className="text-white hover:text-gray-200 text.sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                    Profile
                                </Link>
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-white hover:text-gray-200 text.sm sm:text-base font-medium transition-colors duration-300 text-left">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/signup" className="text-white hover:text-gray-200 text.sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                    Signup
                                </Link>
                                <Link to="/login" className="text-white hover:text-gray-200 text.sm sm:text-base font-medium transition-colors duration-300" onClick={() => setIsOpen(false)}>
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;