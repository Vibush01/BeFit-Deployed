import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const Chat = () => {
    const { user, userDetails } = useContext(AuthContext);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [receivers, setReceivers] = useState([]);
    const [selectedReceiver, setSelectedReceiver] = useState(null);
    const [error, setError] = useState('');
    const socketRef = useRef(null);

    useEffect(() => {
        // Determine the gym ID based on user role
        let gymId;
        if (user.role === 'gym') {
            gymId = user.id; // Gym Profiles use their own ID as the gym ID
        } else {
            if (!userDetails || !userDetails.gym) {
                setError('You must be in a gym to chat');
                return;
            }
            gymId = userDetails.gym;
        }

        // Initialize Socket.IO
        socketRef.current = io(`${API_URL}`);
        socketRef.current.on('connect', () => {
            socketRef.current.emit('joinGym', gymId);
        });

        socketRef.current.on('message', (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        // Fetch gym members and trainers based on role restrictions
        const fetchReceivers = async () => {
            try {
                const res = await axios.get(`${API_URL}/gym/${gymId}`);
                const gym = res.data;
                const receiversList = [];

                if (user.role === 'gym') {
                    // Gym Profiles can only chat with Trainers
                    gym.trainers.forEach((trainer) =>
                        receiversList.push({ _id: trainer._id, name: trainer.name, role: 'trainer' })
                    );
                } else if (user.role === 'trainer') {
                    // Trainers can chat with Members and the Gym Profile
                    receiversList.push({ _id: gym._id, name: gym.gymName, role: 'gym' });
                    gym.members.forEach((member) =>
                        receiversList.push({ _id: member._id, name: member.name, role: 'member' })
                    );
                } else if (user.role === 'member') {
                    // Members can only chat with Trainers
                    gym.trainers.forEach((trainer) =>
                        receiversList.push({ _id: trainer._id, name: trainer.name, role: 'trainer' })
                    );
                }

                setReceivers(receiversList);
            } catch (err) {
                setError('Failed to fetch receivers');
                toast.error('Failed to fetch receivers'+err, { position: 'top-right' });
            }
        };

        fetchReceivers();

        return () => {
            socketRef.current.disconnect();
        };
    }, [user, userDetails]);

    const fetchMessages = async (receiverId) => {
        try {
            const gymId = user.role === 'gym' ? user.id : userDetails.gym;
            const res = await axios.get(`${API_URL}/chat/messages/${gymId}/${receiverId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setMessages(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch messages');
            toast.error(err.response?.data?.message || 'Failed to fetch messages', { position: 'top-right' });
        }
    };

    const handleReceiverSelect = (receiver) => {
        setSelectedReceiver(receiver);
        fetchMessages(receiver._id);
    };

    const handleSendMessage = () => {
        if (!message.trim() || !selectedReceiver) return;

        const senderModel = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        const receiverModel = selectedReceiver.role.charAt(0).toUpperCase() + selectedReceiver.role.slice(1);
        const gymId = user.role === 'gym' ? user.id : userDetails.gym;

        const messageData = {
            senderId: user.id,
            senderModel,
            receiverId: selectedReceiver._id,
            receiverModel,
            gymId,
            message,
        };

        socketRef.current.emit('sendMessage', messageData);
        setMessage('');
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

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    You must be logged in to access chat
                </motion.p>
            </div>
        );
    }

    if ((user.role !== 'gym' && (!userDetails || !userDetails.gym)) || error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    {error || 'You must be in a gym to access chat'}
                </motion.p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
                {/* Receivers List */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="w-full lg:w-1/4 bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Chat With</h2>
                    {error && (
                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="text-red-500 mb-6 text-sm sm:text-base"
                        >
                            {error}
                        </motion.p>
                    )}
                    {receivers.length > 0 ? (
                        <ul className="space-y-3">
                            {receivers.map((receiver) => (
                                <motion.li
                                    key={receiver._id}
                                    onClick={() => handleReceiverSelect(receiver)}
                                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 text-sm sm:text-base ${
                                        selectedReceiver?._id === receiver._id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={zoomIn}
                                >
                                    {receiver.name} ({receiver.role})
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700 text-sm sm:text-base">No users to chat with</p>
                    )}
                </motion.div>

                {/* Chat Messages */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="w-full lg:w-3/4 bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Chat</h2>
                    {selectedReceiver ? (
                        <>
                            <div className="h-96 overflow-y-auto mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        className={`mb-4 ${
                                            msg.sender.toString() === user.id ? 'text-right' : 'text-left'
                                        }`}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={zoomIn}
                                    >
                                        <p
                                            className={`inline-block p-3 rounded-lg text-sm sm:text-base ${
                                                msg.sender.toString() === user.id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-800'
                                            }`}
                                        >
                                            {msg.message}
                                        </p>
                                        <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                            {new Date(msg.timestamp).toLocaleString()}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                                    placeholder="Type a message..."
                                />
                                <motion.button
                                    onClick={handleSendMessage}
                                    whileHover="hover"
                                    variants={buttonHover}
                                    className="bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
                                >
                                    Send
                                </motion.button>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">
                            Select a user to start chatting
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Chat;