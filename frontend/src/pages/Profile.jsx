import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profileImage: null,
    });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFormData({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    password: '',
                    profileImage: null,
                });
                setPreviewImage(res.data.profileImage || null);
            } catch (err) {
                toast.error('Failed to fetch profile', { position: "top-right" });
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    const handleChange = (e) => {
        if (e.target.name === 'profileImage') {
            const file = e.target.files[0];
            setFormData({ ...formData, profileImage: file });
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            if (formData.name) data.append('name', formData.name);
            if (formData.password) data.append('password', formData.password);
            if (formData.profileImage) data.append('profileImage', formData.profileImage);

            await axios.put('http://localhost:5000/api/auth/profile', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFormData({ ...formData, password: '' });
            toast.success('Profile updated successfully', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile', { position: "top-right" });
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
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
                    Profile
                </motion.h1>

                <motion.div
                    variants={fadeIn}
                    className="flex justify-center mb-6"
                >
                    <div className="relative">
                        <img
                            src={previewImage || 'https://via.placeholder.com/150'}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                        />
                        <input
                            type="file"
                            name="profileImage"
                            id="profileImage"
                            onChange={handleChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            aria-label="Upload Profile Image"
                        />
                        <motion.label
                            htmlFor="profileImage"
                            whileHover="hover"
                            variants={buttonHover}
                            className="absolute bottom-0 right-0 bg-blue-600 text-white px-2 py-1 rounded-full text-xs cursor-pointer"
                        >
                            Upload
                        </motion.label>
                    </div>
                </motion.div>

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
                            disabled
                            className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-sm sm:text-base"
                        />
                    </motion.div>
                    <motion.div variants={fadeIn} className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                            New Password (optional)
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                        />
                    </motion.div>
                    <motion.button
                        type="submit"
                        whileHover="hover"
                        variants={buttonHover}
                        className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base mb-2"
                        aria-label="Update Profile"
                    >
                        Update Profile
                    </motion.button>
                    <motion.button
                        onClick={handleLogout}
                        whileHover="hover"
                        variants={buttonHover}
                        className="w-full bg-red-600 text-white p-4 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                        aria-label="Logout"
                    >
                        Logout
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Profile;