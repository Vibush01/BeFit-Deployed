import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const ProgressTracker = () => {
    const { user } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        weight: '',
        muscleMass: '',
        fatPercentage: '',
        images: [],
        deleteImages: [],
    });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/member/progress', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLogs(res.data);
            } catch (err) {
                setError('Failed to fetch progress logs');
                toast.error('Failed to fetch progress logs'+err, { position: 'top-right' });
            }
        };
        if (user?.role === 'member') {
            fetchLogs();
        }
    }, [user]);

    const handleChange = (e) => {
        if (e.target.name === 'images') {
            setFormData({ ...formData, images: Array.from(e.target.files) });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleDeleteImage = (imageUrl) => {
        setFormData({
            ...formData,
            deleteImages: [...formData.deleteImages, imageUrl],
            images: formData.images.filter((_, index) => formData.images[index] !== imageUrl),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            formDataToSend.append('weight', formData.weight);
            formDataToSend.append('muscleMass', formData.muscleMass);
            formDataToSend.append('fatPercentage', formData.fatPercentage);
            formData.images.forEach((image) => formDataToSend.append('images', image));
            if (editId && formData.deleteImages.length > 0) {
                formDataToSend.append('deleteImages', JSON.stringify(formData.deleteImages));
            }

            let res;
            if (editId) {
                res = await axios.put(`http://localhost:5000/api/member/progress/${editId}`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setLogs(logs.map((log) => (log._id === editId ? res.data.progressLog : log)));
                setSuccess('Progress log updated');
                toast.success('Progress log updated', { position: 'top-right' });
                setEditId(null);
            } else {
                res = await axios.post('http://localhost:5000/api/member/progress', formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setLogs([res.data.progressLog, ...logs]);
                setSuccess('Progress logged');
                toast.success('Progress logged', { position: 'top-right' });
            }

            setFormData({ weight: '', muscleMass: '', fatPercentage: '', images: [], deleteImages: [] });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to log progress');
            toast.error(err.response?.data?.message || 'Failed to log progress', { position: 'top-right' });
        }
    };

    const handleEdit = (log) => {
        setFormData({
            weight: log.weight,
            muscleMass: log.muscleMass,
            fatPercentage: log.fatPercentage,
            images: [],
            deleteImages: [],
        });
        setEditId(log._id);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/member/progress/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLogs(logs.filter((log) => log._id !== id));
            setSuccess('Progress log deleted');
            toast.success('Progress log deleted', { position: 'top-right' });
        } catch (err) {
            setError('Failed to delete progress log');
            toast.error('Failed to delete progress log'+err, { position: 'top-right' });
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

    if (user?.role !== 'member') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    Access denied. This page is only for Members.
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
                    Progress Tracker
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

                {/* Progress Logging Form */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
                        {editId ? 'Edit Progress Log' : 'Log Progress'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                required
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Muscle Mass (kg)
                            </label>
                            <input
                                type="number"
                                name="muscleMass"
                                value={formData.muscleMass}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                required
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Fat Percentage (%)
                            </label>
                            <input
                                type="number"
                                name="fatPercentage"
                                value={formData.fatPercentage}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                required
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Images (up to 3)
                            </label>
                            <input
                                type="file"
                                name="images"
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-lg text-sm sm:text-base transition-all duration-300"
                                multiple
                                accept="image/*"
                            />
                            {editId && logs.find((log) => log._id === editId)?.images?.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-gray-800 font-medium text-sm sm:text-base">Existing Images:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                                        {logs
                                            .find((log) => log._id === editId)
                                            .images.map((image, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={image}
                                                        alt={`Progress ${index}`}
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => handleDeleteImage(image)}
                                                        whileHover={{ scale: 1.1 }}
                                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs"
                                                        aria-label="Delete Image"
                                                    >
                                                        X
                                                    </motion.button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                        <motion.button
                            type="submit"
                            whileHover="hover"
                            variants={buttonHover}
                            className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
                            aria-label={editId ? 'Update Progress Log' : 'Log Progress'}
                        >
                            {editId ? 'Update' : 'Log Progress'}
                        </motion.button>
                        {editId && (
                            <motion.button
                                type="button"
                                onClick={() => {
                                    setEditId(null);
                                    setFormData({ weight: '', muscleMass: '', fatPercentage: '', images: [], deleteImages: [] });
                                }}
                                whileHover="hover"
                                variants={buttonHover}
                                className="w-full bg-gray-500 text-white p-4 rounded-lg mt-2 hover:bg-gray-600 transition-all duration-300 text-sm sm:text-base font-semibold"
                                aria-label="Cancel Edit"
                            >
                                Cancel
                            </motion.button>
                        )}
                    </form>
                </motion.div>

                {/* Progress Logs */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Progress Logs</h2>
                    {logs.length > 0 ? (
                        <ul className="space-y-4">
                            {logs.map((log) => (
                                <motion.li
                                    key={log._id}
                                    className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={zoomIn}
                                >
                                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                                        <strong>Weight:</strong> {log.weight} kg
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Muscle Mass:</strong> {log.muscleMass} kg
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Fat Percentage:</strong> {log.fatPercentage}%
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Date:</strong> {new Date(log.date).toLocaleString()}
                                    </p>
                                    {log.images.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-gray-800 font-medium text-sm sm:text-base">
                                                <strong>Images:</strong>
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                                                {log.images.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt={`Progress ${index}`}
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="mt-3 flex space-x-2">
                                        <motion.button
                                            onClick={() => handleEdit(log)}
                                            whileHover="hover"
                                            variants={buttonHover}
                                            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300 text-sm sm:text-base"
                                            aria-label="Edit Progress Log"
                                        >
                                            Edit
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDelete(log._id)}
                                            whileHover="hover"
                                            variants={buttonHover}
                                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                            aria-label="Delete Progress Log"
                                        >
                                            Delete
                                        </motion.button>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No progress logs yet</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ProgressTracker;