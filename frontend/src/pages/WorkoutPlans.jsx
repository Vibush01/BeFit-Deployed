import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const WorkoutPlans = () => {
    const { user } = useContext(AuthContext);
    const [plans, setPlans] = useState([]);
    const [dietPlans, setDietPlans] = useState([]);
    const [requests, setRequests] = useState([]);
    const [members, setMembers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('workout');
    const [workoutForm, setWorkoutForm] = useState({
        memberId: '',
        title: '',
        description: '',
        exercises: [{ name: '', sets: '', reps: '', rest: '' }],
    });
    const [dietForm, setDietForm] = useState({
        memberId: '',
        title: '',
        description: '',
        meals: [{ name: '', calories: '', protein: '', carbs: '', fats: '', time: '' }],
    });
    const [editWorkoutId, setEditWorkoutId] = useState(null);
    const [editDietId, setEditDietId] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = localStorage.getItem('token');
                const workoutRes = await axios.get('http://localhost:5000/api/trainer/workout-plans', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPlans(workoutRes.data);

                const dietRes = await axios.get('http://localhost:5000/api/trainer/diet-plans', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDietPlans(dietRes.data);
            } catch (err) {
                setError('Failed to fetch plans');
                toast.error('Failed to fetch plans', { position: 'top-right' });
            }
        };

        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/trainer/plan-requests', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRequests(res.data);
            } catch (err) {
                setError('Failed to fetch plan requests');
                toast.error('Failed to fetch plan requests', { position: 'top-right' });
            }
        };

        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem('token');
                const trainerRes = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const gymId = trainerRes.data.gym;
                const gymRes = await axios.get(`http://localhost:5000/api/gym/${gymId}`);
                setMembers(gymRes.data.members);
            } catch (err) {
                setError('Failed to fetch members');
                toast.error('Failed to fetch members', { position: 'top-right' });
            }
        };

        if (user?.role === 'trainer') {
            fetchPlans();
            fetchRequests();
            fetchMembers();
        }
    }, [user]);

    const handleWorkoutChange = (e, index) => {
        if (e.target.name.startsWith('exercise')) {
            const exercises = [...workoutForm.exercises];
            const field = e.target.name.split('.')[1];
            exercises[index][field] = e.target.value;
            setWorkoutForm({ ...workoutForm, exercises });
        } else {
            setWorkoutForm({ ...workoutForm, [e.target.name]: e.target.value });
        }
    };

    const handleDietChange = (e, index) => {
        if (e.target.name.startsWith('meal')) {
            const meals = [...dietForm.meals];
            const field = e.target.name.split('.')[1];
            meals[index][field] = e.target.value;
            setDietForm({ ...dietForm, meals });
        } else {
            setDietForm({ ...dietForm, [e.target.name]: e.target.value });
        }
    };

    const addExercise = () => {
        setWorkoutForm({
            ...workoutForm,
            exercises: [...workoutForm.exercises, { name: '', sets: '', reps: '', rest: '' }],
        });
    };

    const removeExercise = (index) => {
        setWorkoutForm({
            ...workoutForm,
            exercises: workoutForm.exercises.filter((_, i) => i !== index),
        });
    };

    const addMeal = () => {
        setDietForm({
            ...dietForm,
            meals: [...dietForm.meals, { name: '', calories: '', protein: '', carbs: '', fats: '', time: '' }],
        });
    };

    const removeMeal = (index) => {
        setDietForm({
            ...dietForm,
            meals: dietForm.meals.filter((_, i) => i !== index),
        });
    };

    const handleWorkoutSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = {
                memberId: workoutForm.memberId,
                title: workoutForm.title,
                description: workoutForm.description,
                exercises: workoutForm.exercises,
            };

            if (editWorkoutId) {
                const res = await axios.put(`http://localhost:5000/api/trainer/workout-plans/${editWorkoutId}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPlans(plans.map((plan) => (plan._id === editWorkoutId ? res.data.workoutPlan : plan)));
                setSuccess('Workout plan updated');
                toast.success('Workout plan updated', { position: 'top-right' });
                setEditWorkoutId(null);
            } else {
                const res = await axios.post('http://localhost:5000/api/trainer/workout-plans', data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPlans([res.data.workoutPlan, ...plans]);
                setSuccess('Workout plan created');
                toast.success('Workout plan created', { position: 'top-right' });
            }

            setWorkoutForm({
                memberId: '',
                title: '',
                description: '',
                exercises: [{ name: '', sets: '', reps: '', rest: '' }],
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save workout plan');
            toast.error(err.response?.data?.message || 'Failed to save workout plan', { position: 'top-right' });
        }
    };

    const handleDietSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = {
                memberId: dietForm.memberId,
                title: dietForm.title,
                description: dietForm.description,
                meals: dietForm.meals,
            };

            if (editDietId) {
                const res = await axios.put(`http://localhost:5000/api/trainer/diet-plans/${editDietId}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDietPlans(dietPlans.map((plan) => (plan._id === editDietId ? res.data.dietPlan : plan)));
                setSuccess('Diet plan updated');
                toast.success('Diet plan updated', { position: 'top-right' });
                setEditDietId(null);
            } else {
                const res = await axios.post('http://localhost:5000/api/trainer/diet-plans', data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDietPlans([res.data.dietPlan, ...dietPlans]);
                setSuccess('Diet plan created');
                toast.success('Diet plan created', { position: 'top-right' });
            }

            setDietForm({
                memberId: '',
                title: '',
                description: '',
                meals: [{ name: '', calories: '', protein: '', carbs: '', fats: '', time: '' }],
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save diet plan');
            toast.error(err.response?.data?.message || 'Failed to save diet plan', { position: 'top-right' });
        }
    };

    const handleWorkoutEdit = (plan) => {
        setWorkoutForm({
            memberId: plan.member._id,
            title: plan.title,
            description: plan.description,
            exercises: plan.exercises,
        });
        setEditWorkoutId(plan._id);
        setActiveTab('workout');
    };

    const handleDietEdit = (plan) => {
        setDietForm({
            memberId: plan.member._id,
            title: plan.title,
            description: plan.description,
            meals: plan.meals,
        });
        setEditDietId(plan._id);
        setActiveTab('diet');
    };

    const handleWorkoutDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/trainer/workout-plans/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPlans(plans.filter((plan) => plan._id !== id));
            setSuccess('Workout plan deleted');
            toast.success('Workout plan deleted', { position: 'top-right' });
        } catch (err) {
            setError('Failed to delete workout plan');
            toast.error('Failed to delete workout plan', { position: 'top-right' });
        }
    };

    const handleDietDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/trainer/diet-plans/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDietPlans(dietPlans.filter((plan) => plan._id !== id));
            setSuccess('Diet plan deleted');
            toast.success('Diet plan deleted', { position: 'top-right' });
        } catch (err) {
            setError('Failed to delete diet plan');
            toast.error('Failed to delete diet plan', { position: 'top-right' });
        }
    };

    const handleRequestAction = async (requestId, action) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/api/trainer/plan-requests/${requestId}/action`, { action }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(requests.map((req) => (req._id === requestId ? res.data.planRequest : req)));
            setSuccess(`Request ${action}d`);
            toast.success(`Request ${action}d`, { position: 'top-right' });
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${action} request`);
            toast.error(err.response?.data?.message || `Failed to ${action} request`, { position: 'top-right' });
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

    if (user?.role !== 'trainer') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    Access denied. This page is only for Trainers.
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
                    Workout & Diet Plans
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

                {/* Plan Requests */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Plan Requests</h2>
                    {requests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-3 sm:p-4">Member</th>
                                        <th className="p-3 sm:p-4">Gym</th>
                                        <th className="p-3 sm:p-4">Request Type</th>
                                        <th className="p-3 sm:p-4">Status</th>
                                        <th className="p-3 sm:p-4">Requested On</th>
                                        <th className="p-3 sm:p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request) => (
                                        <motion.tr
                                            key={request._id}
                                            className="border-b hover:bg-gray-50 transition-all duration-300"
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            variants={zoomIn}
                                        >
                                            <td className="p-3 sm:p-4 font-medium text-gray-800">
                                                {request.member.name} ({request.member.email})
                                            </td>
                                            <td className="p-3 sm:p-4 text-gray-600">{request.gym.gymName}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)} Plan</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{request.status}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{new Date(request.createdAt).toLocaleString()}</td>
                                            <td className="p-3 sm:p-4 flex space-x-2">
                                                {request.status === 'pending' && (
                                                    <>
                                                        <motion.button
                                                            onClick={() => handleRequestAction(request._id, 'approve')}
                                                            whileHover="hover"
                                                            variants={buttonHover}
                                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 text-sm sm:text-base"
                                                            aria-label="Approve Request"
                                                        >
                                                            Approve
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => handleRequestAction(request._id, 'deny')}
                                                            whileHover="hover"
                                                            variants={buttonHover}
                                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                                            aria-label="Deny Request"
                                                        >
                                                            Deny
                                                        </motion.button>
                                                    </>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No plan requests yet</p>
                    )}
                </motion.div>

                {/* Tabs for Workout and Diet Plans */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="mb-6 flex space-x-2"
                >
                    <motion.button
                        onClick={() => setActiveTab('workout')}
                        whileHover="hover"
                        variants={buttonHover}
                        className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold ${activeTab === 'workout' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        aria-label="Show Workout Plans"
                    >
                        Workout Plans
                    </motion.button>
                    <motion.button
                        onClick={() => setActiveTab('diet')}
                        whileHover="hover"
                        variants={buttonHover}
                        className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold ${activeTab === 'diet' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        aria-label="Show Diet Plans"
                    >
                        Diet Plans
                    </motion.button>
                </motion.div>

                {/* Workout Plan Form */}
                {activeTab === 'workout' && (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
                            {editWorkoutId ? 'Edit Workout Plan' : 'Create Workout Plan'}
                        </h2>
                        <form onSubmit={handleWorkoutSubmit}>
                            <motion.div variants={fadeIn} className="mb-6">
                                <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                    Member
                                </label>
                                <select
                                    name="memberId"
                                    value={workoutForm.memberId}
                                    onChange={handleWorkoutChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                    required
                                >
                                    <option value="">Select a member</option>
                                    {members.map((member) => (
                                        <option key={member._id} value={member._id}>
                                            {member.name} ({member.email})
                                        </option>
                                    ))}
                                </select>
                            </motion.div>
                            <motion.div variants={fadeIn} className="mb-6">
                                <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={workoutForm.title}
                                    onChange={handleWorkoutChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                    required
                                />
                            </motion.div>
                            <motion.div variants={fadeIn} className="mb-6">
                                <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={workoutForm.description}
                                    onChange={handleWorkoutChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                    rows="3"
                                />
                            </motion.div>
                            <div className="mb-6">
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">Exercises</h3>
                                {workoutForm.exercises.map((exercise, index) => (
                                    <motion.div
                                        key={index}
                                        className="mb-4 p-4 border border-gray-200 rounded-lg"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={zoomIn}
                                    >
                                        <motion.div variants={fadeIn} className="mb-4">
                                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                                Exercise Name
                                            </label>
                                            <input
                                                type="text"
                                                name={`exercise.name.${index}`}
                                                value={exercise.name}
                                                onChange={(e) => handleWorkoutChange(e, index)}
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                                required
                                            />
                                        </motion.div>
                                        <motion.div variants={fadeIn} className="mb-4">
                                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                                Sets
                                            </label>
                                            <input
                                                type="number"
                                                name={`exercise.sets.${index}`}
                                                value={exercise.sets}
                                                onChange={(e) => handleWorkoutChange(e, index)}
                                                min="1"
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                                required
                                            />
                                        </motion.div>
                                        <motion.div variants={fadeIn} className="mb-4">
                                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                                Reps
                                            </label>
                                            <input
                                                type="number"
                                                name={`exercise.reps.${index}`}
                                                value={exercise.reps}
                                                onChange={(e) => handleWorkoutChange(e, index)}
                                                min="1"
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                                required
                                            />
                                        </motion.div>
                                        <motion.div variants={fadeIn} className="mb-4">
                                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                                Rest (e.g., 30 seconds)
                                            </label>
                                            <input
                                                type="text"
                                                name={`exercise.rest.${index}`}
                                                value={exercise.rest}
                                                onChange={(e) => handleWorkoutChange(e, index)}
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                            />
                                        </motion.div>
                                        {workoutForm.exercises.length > 1 && (
                                            <motion.button
                                                type="button"
                                                onClick={() => removeExercise(index)}
                                                whileHover="hover"
                                                variants={buttonHover}
                                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                                aria-label={`Remove Exercise ${index + 1}`}
                                            >
                                                Remove Exercise
                                            </motion.button>
                                        )}
                                    </motion.div>
                                ))}
                                <motion.button
                                    type="button"
                                    onClick={addExercise}
                                    whileHover="hover"
                                    variants={buttonHover}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base mt-2"
                                    aria-label="Add Exercise"
                                >
                                    Add Exercise
                                </motion.button>
                            </div>
                            <motion.button
                                type="submit"
                                whileHover="hover"
                                variants={buttonHover}
                                className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
                                aria-label={editWorkoutId ? 'Update Workout Plan' : 'Create Workout Plan'}
                            >
                                {editWorkoutId ? 'Update Plan' : 'Create Plan'}
                            </motion.button>
                            {editWorkoutId && (
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        setEditWorkoutId(null);
                                        setWorkoutForm({
                                            memberId: '',
                                            title: '',
                                            description: '',
                                            exercises: [{ name: '', sets: '', reps: '', rest: '' }],
                                        });
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
                )}

                {/* Diet Plan Form */}
                {activeTab === 'diet' && (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
                            {editDietId ? 'Edit Diet Plan' : 'Create Diet Plan'}
                        </h2>
                        <form onSubmit={handleDietSubmit}>
                            <motion.div variants={fadeIn} className="mb-6">
                                <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                    Member
                                </label>
                                <select
                                    name="memberId"
                                    value={dietForm.memberId}
                                    onChange={handleDietChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                    required
                                >
                                    <option value="">Select a member</option>
                                    {members.map((member) => (
                                        <option key={member._id} value={member._id}>
                                            {member.name} ({member.email})
                                        </option>
                                    ))}
                                </select>
                            </motion.div>
                            <motion.div variants={fadeIn} className="mb-6">
                                <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={dietForm.title}
                                    onChange={handleDietChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                    required
                                />
                            </motion.div>
                            <motion.div variants={fadeIn} className="mb-6">
                                <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={dietForm.description}
                                    onChange={handleDietChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                    rows="3"
                                />
                            </motion.div>
                            <div className="mb-6">
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">Meals</h3>
                                {dietForm.meals.map((meal, index) => (
                                    <motion.div
                                        key={index}
                                        className="mb-4 p-4 border border-gray-200 rounded-lg"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={zoomIn}
                                    >
                                        <motion.div variants={fadeIn} className="mb-4">
                                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                                Meal Name
                                            </label>
                                            <input
                                                type="text"
                                                name={`meal.name.${index}`}
                                                value={meal.name}
                                                onChange={(e) => handleDietChange(e, index)}
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                                required
                                            />
                                        </motion.div>
                                        <motion.div variants={fadeIn} className="mb-4">
                                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                                Calories (kcal)
                                            </label>
                                            <input
                                                type="number"
                                                name={`meal.calories.${index}`}
                                                value={meal.calories}
                                                onChange={(e) => handleDietChange(e, index)}
                                                min="0"
                                                step="0.1"
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                                required
                                            />
                                        </motion.div>
                                        <motion.div variants={fadeIn} className="mb-4">
                                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                                Protein (g)
                                            </label>
                                            <input
                                                type="number"
                                                name={`meal.protein.${index}`}
                                                value={meal.protein}
                                                onChange={(e) => handleDietChange(e, index)}
                                                min="0"
                                                step="0.1"
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                                required
                                            />
                                        </motion.div>
                                        <motion.div variants={fadeIn} className="mb-4">
                                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                                Carbs (g)
                                            </label>
                                            <input
                                                type="number"
                                                name={`meal.carbs.${index}`}
                                                value={meal.carbs}
                                                onChange={(e) => handleDietChange(e, index)}
                                                min="0"
                                                step="0.1"
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                                required
                                            />
                                        </motion.div>
                                        <motion.div variants={fadeIn} className="mb-4">
                                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                                Fats (g)
                                            </label>
                                            <input
                                                type="number"
                                                name={`meal.fats.${index}`}
                                                value={meal.fats}
                                                onChange={(e) => handleDietChange(e, index)}
                                                min="0"
                                                step="0.1"
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text.sm sm:text-base transition-all duration-300"
                                                required
                                            />
                                        </motion.div>
                                        <motion.div variants={fadeIn} className="mb-4">
                                            <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                                                Time (e.g., 8:00 AM)
                                            </label>
                                            <input
                                                type="text"
                                                name={`meal.time.${index}`}
                                                value={meal.time}
                                                onChange={(e) => handleDietChange(e, index)}
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                            />
                                        </motion.div>
                                        {dietForm.meals.length > 1 && (
                                            <motion.button
                                                type="button"
                                                onClick={() => removeMeal(index)}
                                                whileHover="hover"
                                                variants={buttonHover}
                                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                                aria-label={`Remove Meal ${index + 1}`}
                                            >
                                                Remove Meal
                                            </motion.button>
                                        )}
                                    </motion.div>
                                ))}
                                <motion.button
                                    type="button"
                                    onClick={addMeal}
                                    whileHover="hover"
                                    variants={buttonHover}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base mt-2"
                                    aria-label="Add Meal"
                                >
                                    Add Meal
                                </motion.button>
                            </div>
                            <motion.button
                                type="submit"
                                whileHover="hover"
                                variants={buttonHover}
                                className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
                                aria-label={editDietId ? 'Update Diet Plan' : 'Create Diet Plan'}
                            >
                                {editDietId ? 'Update Plan' : 'Create Plan'}
                            </motion.button>
                            {editDietId && (
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        setEditDietId(null);
                                        setDietForm({
                                            memberId: '',
                                            title: '',
                                            description: '',
                                            meals: [{ name: '', calories: '', protein: '', carbs: '', fats: '', time: '' }],
                                        });
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
                )}

                {/* Workout Plans List */}
                {activeTab === 'workout' && (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Workout Plans</h2>
                        {plans.length > 0 ? (
                            <ul className="space-y-4">
                                {plans.map((plan) => (
                                    <motion.li
                                        key={plan._id}
                                        className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={zoomIn}
                                    >
                                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                                            <strong>Member:</strong> {plan.member.name} ({plan.member.email})
                                        </p>
                                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                                            <strong>Title:</strong> {plan.title}
                                        </p>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            <strong>Description:</strong> {plan.description || 'N/A'}
                                        </p>
                                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                                            <strong>Exercises:</strong>
                                        </p>
                                        <ul className="space-y-2 mt-2">
                                            {plan.exercises.map((exercise, index) => (
                                                <motion.li
                                                    key={index}
                                                    className="border border-gray-200 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                                    initial="hidden"
                                                    whileInView="visible"
                                                    viewport={{ once: true }}
                                                    variants={zoomIn}
                                                >
                                                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                                                        <strong>Exercise {index + 1}:</strong> {exercise.name}
                                                    </p>
                                                    <p className="text-gray-600 text-sm sm:text-base">
                                                        <strong>Sets:</strong> {exercise.sets}, <strong>Reps:</strong> {exercise.reps}, <strong>Rest:</strong> {exercise.rest || 'N/A'}
                                                    </p>
                                                </motion.li>
                                            ))}
                                        </ul>
                                        <p className="text-gray-600 text-sm sm:text-base mt-2">
                                            <strong>Created:</strong> {new Date(plan.createdAt).toLocaleString()}
                                        </p>
                                        <div className="mt-3 flex space-x-2">
                                            <motion.button
                                                onClick={() => handleWorkoutEdit(plan)}
                                                whileHover="hover"
                                                variants={buttonHover}
                                                className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300 text-sm sm:text-base"
                                                aria-label="Edit Workout Plan"
                                            >
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleWorkoutDelete(plan._id)}
                                                whileHover="hover"
                                                variants={buttonHover}
                                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                                aria-label="Delete Workout Plan"
                                            >
                                                Delete
                                            </motion.button>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 text-center text-sm sm:text-base">No workout plans yet</p>
                        )}
                    </motion.div>
                )}

                {/* Diet Plans List */}
                {activeTab === 'diet' && (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Diet Plans</h2>
                        {dietPlans.length > 0 ? (
                            <ul className="space-y-4">
                                {dietPlans.map((plan) => (
                                    <motion.li
                                        key={plan._id}
                                        className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={zoomIn}
                                    >
                                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                                            <strong>Member:</strong> {plan.member.name} ({plan.member.email})
                                        </p>
                                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                                            <strong>Title:</strong> {plan.title}
                                        </p>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            <strong>Description:</strong> {plan.description || 'N/A'}
                                        </p>
                                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                                            <strong>Meals:</strong>
                                        </p>
                                        <ul className="space-y-2 mt-2">
                                            {plan.meals.map((meal, index) => (
                                                <motion.li
                                                    key={index}
                                                    className="border border-gray-200 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                                    initial="hidden"
                                                    whileInView="visible"
                                                    viewport={{ once: true }}
                                                    variants={zoomIn}
                                                >
                                                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                                                        <strong>Meal {index + 1}:</strong> {meal.name}
                                                    </p>
                                                    <p className="text-gray-600 text-sm sm:text-base">
                                                        <strong>Calories:</strong> {meal.calories} kcal, <strong>Protein:</strong> {meal.protein}g, <strong>Carbs:</strong> {meal.carbs}g, <strong>Fats:</strong> {meal.fats}g, <strong>Time:</strong> {meal.time || 'N/A'}
                                                    </p>
                                                </motion.li>
                                            ))}
                                        </ul>
                                        <p className="text-gray-600 text-sm sm:text-base mt-2">
                                            <strong>Created:</strong> {new Date(plan.createdAt).toLocaleString()}
                                        </p>
                                        <div className="mt-3 flex space-x-2">
                                            <motion.button
                                                onClick={() => handleDietEdit(plan)}
                                                whileHover="hover"
                                                variants={buttonHover}
                                                className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300 text-sm sm:text-base"
                                                aria-label="Edit Diet Plan"
                                            >
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDietDelete(plan._id)}
                                                whileHover="hover"
                                                variants={buttonHover}
                                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                                aria-label="Delete Diet Plan"
                                            >
                                                Delete
                                            </motion.button>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 text-center text-sm sm:text-base">No diet plans yet</p>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WorkoutPlans;