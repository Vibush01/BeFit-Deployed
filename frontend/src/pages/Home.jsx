import { useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/contact/messages', formData);
            setSuccess(res.data.message);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit contact form');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-16">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">Welcome to BeFit</h1>
                    <p className="text-xl mb-8">Your ultimate platform for fitness and wellness.</p>
                    <a href="#contact" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200">
                        Get Started
                    </a>
                </div>
            </div>

            {/* About Section */}
            <div className="py-16">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">About BeFit</h2>
                    <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
                        <div className="flex-1">
                            <img
                                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                                alt="Fitness"
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-700 text-lg">
                                BeFit is a comprehensive fitness platform designed to connect gym owners, trainers, and members in a seamless ecosystem. Whether you're looking to join a gym, find a personal trainer, or manage your fitness journey, BeFit has you covered. Our platform offers tools for workout planning, scheduling, macro tracking, progress monitoring, and real-time communication, ensuring you achieve your fitness goals efficiently.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-200 py-16">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">Our Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <h3 className="text-xl font-semibold mb-4">Gym Management</h3>
                            <p className="text-gray-700">
                                Gym owners can manage their gyms, trainers, and members with ease, including membership plans and join requests.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <h3 className="text-xl font-semibold mb-4">Trainer Support</h3>
                            <p className="text-gray-700">
                                Trainers can create workout and diet plans, schedule sessions, and communicate with members in real-time.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <h3 className="text-xl font-semibold mb-4">Member Tools</h3>
                            <p className="text-gray-700">
                                Members can track their progress, calculate macros, book sessions, and request personalized plans.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div id="contact" className="py-16">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
                    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    rows="5"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;