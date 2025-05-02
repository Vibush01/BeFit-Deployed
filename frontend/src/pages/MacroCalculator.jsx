import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const MacroCalculator = () => {
    const { user } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        food: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
    });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/member/macros', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLogs(res.data);
            } catch (err) {
                setError('Failed to fetch macro logs');
                toast.error('Failed to fetch macro logs'+err, { position: 'top-right' });
            }
        };
        if (user?.role === 'member') {
            fetchLogs();
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
                food: formData.food,
                macros: {
                    calories: parseFloat(formData.calories),
                    protein: parseFloat(formData.protein),
                    carbs: parseFloat(formData.carbs),
                    fats: parseFloat(formData.fats),
                },
            };

            if (editId) {
                const res = await axios.put(`http://localhost:5000/api/member/macros/${editId}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLogs(logs.map((log) => (log._id === editId ? res.data.macroLog : log)));
                setSuccess('Macro log updated');
                toast.success('Macro log updated', { position: 'top-right' });
                setEditId(null);
            } else {
                const res = await axios.post('http://localhost:5000/api/member/macros', data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLogs([res.data.macroLog, ...logs]);
                setSuccess('Macro logged');
                toast.success('Macro logged', { position: 'top-right' });
            }

            setFormData({ food: '', calories: '', protein: '', carbs: '', fats: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to log macro');
            toast.error(err.response?.data?.message || 'Failed to log macro', { position: 'top-right' });
        }
    };

    const handleEdit = (log) => {
        setFormData({
            food: log.food,
            calories: log.macros.calories,
            protein: log.macros.protein,
            carbs: log.macros.carbs,
            fats: log.macros.fats,
        });
        setEditId(log._id);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/member/macros/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLogs(logs.filter((log) => log._id !== id));
            setSuccess('Macro log deleted');
            toast.success('Macro log deleted', { position: 'top-right' });
        } catch (err) {
            setError('Failed to delete macro log');
            toast.error('Failed to delete macro log'+err, { position: 'top-right' });
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
                    Macro Calculator
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

                {/* Macro Logging Form */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
                        {editId ? 'Edit Macro Log' : 'Log a Meal'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Food
                            </label>
                            <input
                                type="text"
                                name="food"
                                value={formData.food}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                required
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Calories (kcal)
                            </label>
                            <input
                                type="number"
                                name="calories"
                                value={formData.calories}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                required
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Protein (g)
                            </label>
                            <input
                                type="number"
                                name="protein"
                                value={formData.protein}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                required
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Carbs (g)
                            </label>
                            <input
                                type="number"
                                name="carbs"
                                value={formData.carbs}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                required
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} className="mb-6">
                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                Fats (g)
                            </label>
                            <input
                                type="number"
                                name="fats"
                                value={formData.fats}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                required
                            />
                        </motion.div>
                        <motion.button
                            type="submit"
                            whileHover="hover"
                            variants={buttonHover}
                            className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
                            aria-label={editId ? 'Update Macro Log' : 'Log Meal'}
                        >
                            {editId ? 'Update' : 'Log Meal'}
                        </motion.button>
                        {editId && (
                            <motion.button
                                type="button"
                                onClick={() => {
                                    setEditId(null);
                                    setFormData({ food: '', calories: '', protein: '', carbs: '', fats: '' });
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

                {/* Macro Logs */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Macro Logs</h2>
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
                                        <strong>Food:</strong> {log.food}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Calories:</strong> {log.macros.calories} kcal
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Protein:</strong> {log.macros.protein} g
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Carbs:</strong> {log.macros.carbs} g
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Fats:</strong> {log.macros.fats} g
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Date:</strong> {new Date(log.date).toLocaleString()}
                                    </p>
                                    <div className="mt-3 flex space-x-2">
                                        <motion.button
                                            onClick={() => handleEdit(log)}
                                            whileHover="hover"
                                            variants={buttonHover}
                                            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300 text-sm sm:text-base"
                                            aria-label="Edit Macro Log"
                                        >
                                            Edit
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDelete(log._id)}
                                            whileHover="hover"
                                            variants={buttonHover}
                                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                            aria-label="Delete Macro Log"
                                        >
                                            Delete
                                        </motion.button>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No macro logs yet</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default MacroCalculator;