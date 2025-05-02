import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const RequestPlan = () => {
    const { user } = useContext(AuthContext);
    const [trainers, setTrainers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [plans, setPlans] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState('');
    const [requestType, setRequestType] = useState('workout');

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const token = localStorage.getItem('token');
                const memberRes = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const gymId = memberRes.data.gym;
                const gymRes = await axios.get(`http://localhost:5000/api/gym/${gymId}`);
                setTrainers(gymRes.data.trainers);
            } catch (err) {
                toast.error('Failed to fetch trainers'+err, { position: "top-right" });
            }
        };

        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/trainer/member/plan-requests', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRequests(res.data);
            } catch (err) {
                toast.error('Failed to fetch plan requests'+err, { position: "top-right" });
            }
        };

        const fetchPlans = async () => {
            try {
                const token = localStorage.getItem('token');
                const workoutPlansRes = await axios.get('http://localhost:5000/api/trainer/member/workout-plans', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const dietPlansRes = await axios.get('http://localhost:5000/api/trainer/member/diet-plans', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const combinedPlans = [
                    ...workoutPlansRes.data.map((plan) => ({
                        type: 'Workout Plan',
                        title: plan.title,
                        description: plan.exercises.map((ex) => `${ex.name}: ${ex.sets} sets, ${ex.reps} reps, Rest: ${ex.rest || 'N/A'}`).join('; '),
                        trainer: plan.trainer,
                        gym: plan.gym,
                        receivedOn: plan.createdAt,
                    })),
                    ...dietPlansRes.data.map((plan) => ({
                        type: 'Diet Plan',
                        title: plan.title,
                        description: plan.meals.map((meal) => `${meal.name}: ${meal.calories} kcal, Protein: ${meal.protein}g, Carbs: ${meal.carbs}g, Fats: ${meal.fats}g, Time: ${meal.time || 'N/A'}`).join('; '),
                        trainer: plan.trainer,
                        gym: plan.gym,
                        receivedOn: plan.createdAt,
                    })),
                ].sort((a, b) => new Date(b.receivedOn) - new Date(a.receivedOn));

                setPlans(combinedPlans);
            } catch (err) {
                toast.error('Failed to fetch plans'+err, { position: "top-right" });
            }
        };

        if (user?.role === 'member') {
            fetchTrainers();
            fetchRequests();
            fetchPlans();
        }
    }, [user]);

    const handleRequest = async () => {
        if (!selectedTrainer) {
            toast.error('Please select a trainer', { position: "top-right" });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/trainer/plan-requests', {
                trainerId: selectedTrainer,
                requestType,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests([res.data.planRequest, ...requests]);
            setSelectedTrainer('');
            toast.success('Request sent successfully', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send request', { position: "top-right" });
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
                    Request Workout & Diet Plan
                </motion.h1>

                {/* Request a Plan */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Request a Plan</h2>
                    <motion.div variants={fadeIn} className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                            Select Trainer
                        </label>
                        <select
                            value={selectedTrainer}
                            onChange={(e) => setSelectedTrainer(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                        >
                            <option value="">Select a trainer</option>
                            {trainers.map((trainer) => (
                                <option key={trainer._id} value={trainer._id}>
                                    {trainer.name} ({trainer.email})
                                </option>
                            ))}
                        </select>
                    </motion.div>
                    <motion.div variants={fadeIn} className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                            Request Type
                        </label>
                        <select
                            value={requestType}
                            onChange={(e) => setRequestType(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                        >
                            <option value="workout">Workout Plan</option>
                            <option value="diet">Diet Plan</option>
                        </select>
                    </motion.div>
                    <motion.button
                        onClick={handleRequest}
                        whileHover="hover"
                        variants={buttonHover}
                        className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
                        aria-label="Send Plan Request"
                    >
                        Send Request
                    </motion.button>
                </motion.div>

                {/* Your Plan Requests */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Your Plan Requests</h2>
                    {requests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-3 sm:p-4">Trainer</th>
                                        <th className="p-3 sm:p-4">Gym</th>
                                        <th className="p-3 sm:p-4">Request Type</th>
                                        <th className="p-3 sm:p-4">Status</th>
                                        <th className="p-3 sm:p-4">Requested On</th>
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
                                                {request.trainer.name} ({request.trainer.email})
                                            </td>
                                            <td className="p-3 sm:p-4 text-gray-600">{request.gym.gymName}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)} Plan</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{request.status}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{new Date(request.createdAt).toLocaleString()}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No plan requests yet</p>
                    )}
                </motion.div>

                {/* Your Plans */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Your Plans</h2>
                    {plans.length > 0 ? (
                        <ul className="space-y-4">
                            {plans.map((plan, index) => (
                                <motion.li
                                    key={index}
                                    className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={zoomIn}
                                >
                                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                                        <strong>Trainer:</strong> {plan.trainer.name} ({plan.trainer.email})
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Gym:</strong> {plan.gym.gymName}
                                    </p>
                                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                                        <strong>{plan.type}:</strong> {plan.title}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Details:</strong> {plan.description}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        <strong>Received On:</strong> {new Date(plan.receivedOn).toLocaleString()}
                                    </p>
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No plans received yet</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default RequestPlan;