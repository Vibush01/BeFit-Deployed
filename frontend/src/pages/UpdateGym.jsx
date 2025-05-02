import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const UpdateGym = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        gymName: '',
        address: '',
        ownerName: '',
        ownerEmail: '',
        membershipPlans: [],
        photos: [],
        deletePhotos: [],
    });
    const [newMembershipPlan, setNewMembershipPlan] = useState({ duration: '', price: '' });
    const [previewImages, setPreviewImages] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchGym = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFormData({
                    gymName: res.data.gymName || '',
                    address: res.data.address || '',
                    ownerName: res.data.ownerName || '',
                    ownerEmail: res.data.ownerEmail || '',
                    membershipPlans: res.data.membershipPlans || [],
                    photos: res.data.photos || [],
                    deletePhotos: [],
                });
                setPreviewImages(res.data.photos || []);
            } catch (err) {
                setError('Failed to fetch gym details');
                toast.error('Failed to fetch gym details'+err, { position: 'top-right' });
            }
        };

        if (user?.role === 'gym') {
            fetchGym();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMembershipChange = (e) => {
        setNewMembershipPlan({ ...newMembershipPlan, [e.target.name]: e.target.value });
    };

    const addMembershipPlan = () => {
        if (!newMembershipPlan.duration || !newMembershipPlan.price) {
            toast.error('Please fill in both duration and price for the membership plan', { position: 'top-right' });
            return;
        }
        setFormData({
            ...formData,
            membershipPlans: [...formData.membershipPlans, newMembershipPlan],
        });
        setNewMembershipPlan({ duration: '', price: '' });
    };

    const removeMembershipPlan = (index) => {
        setFormData({
            ...formData,
            membershipPlans: formData.membershipPlans.filter((_, i) => i !== index),
        });
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, photos: files });
        setPreviewImages([...previewImages, ...files.map((file) => URL.createObjectURL(file))]);
    };

    const handleDeletePhoto = (photoUrl) => {
        setFormData({
            ...formData,
            deletePhotos: [...formData.deletePhotos, photoUrl],
            photos: formData.photos.filter((_, index) => previewImages[index] !== photoUrl),
        });
        setPreviewImages(previewImages.filter((url) => url !== photoUrl));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            if (formData.gymName) data.append('gymName', formData.gymName);
            if (formData.address) data.append('address', formData.address);
            if (formData.ownerName) data.append('ownerName', formData.ownerName);
            if (formData.ownerEmail) data.append('ownerEmail', formData.ownerEmail);
            data.append('membershipPlans', JSON.stringify(formData.membershipPlans));
            if (formData.deletePhotos.length > 0) {
                data.append('deletePhotos', JSON.stringify(formData.deletePhotos));
            }
            formData.photos.forEach((photo) => {
                data.append('photos', photo);
            });

            const res = await axios.put('http://localhost:5000/api/gym/update', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFormData({
                ...formData,
                photos: [],
                deletePhotos: [],
            });
            setPreviewImages(res.data.gym.photos || []);
            setSuccess('Gym details updated successfully');
            toast.success('Gym details updated successfully', { position: 'top-right' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update gym details');
            toast.error(err.response?.data?.message || 'Failed to update gym details', { position: 'top-right' });
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

    if (user?.role !== 'gym') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    Access denied. This page is only for Gym Profiles.
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
                    Update Gym Details
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
                    <form onSubmit={handleSubmit}>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Gym Name
                            </label>
                            <input
                                type="text"
                                name="gymName"
                                value={formData.gymName}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Owner Name
                            </label>
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Owner Email
                            </label>
                            <input
                                type="email"
                                name="ownerEmail"
                                value={formData.ownerEmail}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                            />
                        </motion.div>
                        <div className="mb-6">
                            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">Membership Plans</h3>
                            {formData.membershipPlans.length > 0 ? (
                                <ul className="space-y-2">
                                    {formData.membershipPlans.map((plan, index) => (
                                        <motion.li
                                            key={index}
                                            className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-between"
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            variants={zoomIn}
                                        >
                                            <div>
                                                <p className="text-gray-800 font-medium text-sm sm:text-base">
                                                    <strong>Duration:</strong> {plan.duration}
                                                </p>
                                                <p className="text-gray-600 text-sm sm:text-base">
                                                    <strong>Price:</strong> ${plan.price}
                                                </p>
                                            </div>
                                            <motion.button
                                                type="button"
                                                onClick={() => removeMembershipPlan(index)}
                                                whileHover="hover"
                                                variants={buttonHover}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                                aria-label={`Remove Membership Plan ${index + 1}`}
                                            >
                                                Remove
                                            </motion.button>
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-700 text-sm sm:text-base mb-4">No membership plans added yet</p>
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 mt-4">
                                <motion.div variants={fadeIn} className="flex-1 mb-4 sm:mb-0">
                                    <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={newMembershipPlan.duration}
                                        onChange={handleMembershipChange}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                        placeholder="e.g., 1 month"
                                    />
                                </motion.div>
                                <motion.div variants={fadeIn} className="flex-1 mb-4 sm:mb-0">
                                    <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newMembershipPlan.price}
                                        onChange={handleMembershipChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                    />
                                </motion.div>
                                <motion.button
                                    type="button"
                                    onClick={addMembershipPlan}
                                    whileHover="hover"
                                    variants={buttonHover}
                                    className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base font-semibold"
                                    aria-label="Add Membership Plan"
                                >
                                    Add Plan
                                </motion.button>
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">Gym Photos</h3>
                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                    {previewImages.map((photo, index) => (
                                        <motion.div
                                            key={index}
                                            className="relative"
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            variants={zoomIn}
                                        >
                                            <img
                                                src={photo}
                                                alt={`Gym ${index}`}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <motion.button
                                                type="button"
                                                onClick={() => handleDeletePhoto(photo)}
                                                whileHover={{ scale: 1.1 }}
                                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs"
                                                aria-label={`Delete Photo ${index + 1}`}
                                            >
                                                X
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                            <motion.div variants={fadeIn}>
                                <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                    Upload New Photos (up to 5)
                                </label>
                                <input
                                    type="file"
                                    name="photos"
                                    onChange={handlePhotoChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg text-sm sm:text-base transition-all duration-300"
                                    multiple
                                    accept="image/*"
                                />
                            </motion.div>
                        </div>
                        <motion.button
                            type="submit"
                            whileHover="hover"
                            variants={buttonHover}
                            className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
                            aria-label="Update Gym Details"
                        >
                            Update Gym
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default UpdateGym;