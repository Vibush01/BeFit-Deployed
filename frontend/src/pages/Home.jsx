import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Home = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/contact/messages', formData);
            toast.success(res.data.message, { position: "top-right" });
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit contact form', { position: "top-right" });
        }
    };

    // Animation Variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    const slideInLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    };

    const slideInRight = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    };

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20"
            >
                <div className="container mx-auto text-center px-4">
                    <motion.h1
                        variants={fadeIn}
                        className="text-5xl md:text-6xl font-extrabold mb-4"
                    >
                        Welcome to FitChat
                    </motion.h1>
                    <motion.p
                        variants={fadeIn}
                        className="text-xl md:text-2xl mb-8"
                    >
                        Empower Your Fitness Journey with FitChat – Connect, Train, and Thrive!
                    </motion.p>
                    <motion.a
                        href="#contact"
                        variants={fadeIn}
                        className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-200 transition duration-300"
                    >
                        Get Started
                    </motion.a>
                </div>
            </motion.section>

            {/* About Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="py-20 bg-white"
            >
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeIn}
                        className="text-4xl font-bold text-center mb-12 text-gray-800"
                    >
                        About FitChat
                    </motion.h2>
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <motion.div
                            variants={slideInLeft}
                            className="flex-1"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                                alt="Fitness"
                                className="w-full h-80 object-cover rounded-lg shadow-lg"
                            />
                        </motion.div>
                        <motion.div
                            variants={slideInRight}
                            className="flex-1"
                        >
                            <p className="text-lg text-gray-600 mb-6">
                            FitChat is more than just a fitness platform – it’s a community dedicated to helping you achieve your health and wellness goals. We bring together gym owners, personal trainers, and fitness enthusiasts in a seamless, technology-driven ecosystem designed to enhance your fitness experience.
                            </p>
                            <p className="text-lg text-gray-600 mb-6">
                                Our platform empowers gym owners to manage their facilities efficiently, allows trainers to create personalized workout and diet plans, and provides members with tools to track their progress, book sessions, and connect with their fitness community in real-time. Whether you’re a beginner or a seasoned athlete, FitChat offers everything you need to succeed.
                            </p>
                            <p className="text-lg text-gray-600">
                                Join FitChat today and take the first step towards a healthier, stronger you. With features like real-time chat, progress tracking, macro calculators, and more, we’re here to support you every step of the way.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="py-20 bg-gray-100"
            >
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeIn}
                        className="text-4xl font-bold text-center mb-12 text-gray-800"
                    >
                        Why Choose FitChat?
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            variants={fadeIn}
                            className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300"
                        >
                            <div className="text-blue-600 mb-4">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Gym Management</h3>
                            <p className="text-gray-600">
                                Gym owners can effortlessly manage their facilities, oversee trainers and members, set membership plans, and handle join requests with our intuitive tools.
                            </p>
                        </motion.div>
                        <motion.div
                            variants={fadeIn}
                            className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300"
                        >
                            <div className="text-blue-600 mb-4">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Trainer Support</h3>
                            <p className="text-gray-600">
                                Trainers can create customized workout and diet plans, schedule sessions, and communicate with members in real-time to ensure optimal results.
                            </p>
                        </motion.div>
                        <motion.div
                            variants={fadeIn}
                            className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300"
                        >
                            <div className="text-blue-600 mb-4">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Member Tools</h3>
                            <p className="text-gray-600">
                                Members can track their fitness progress, calculate macros, book training sessions, request personalized plans, and stay connected with their gym community.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Mission Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="py-20 bg-white"
            >
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeIn}
                        className="text-4xl font-bold text-center mb-12 text-gray-800"
                    >
                        Our Mission
                    </motion.h2>
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <motion.div
                            variants={slideInLeft}
                            className="flex-1"
                        >
                            <p className="text-lg text-gray-600 mb-6">
                                At FitChat, our mission is to revolutionize the fitness industry by providing a platform that fosters collaboration, motivation, and success. We aim to empower every individual—whether a gym owner, trainer, or member—to take control of their fitness journey with the best tools and resources available.
                            </p>
                            <p className="text-lg text-gray-600">
                                We believe fitness is not just about physical strength but also about building a supportive community. FitChat is here to bridge the gap between fitness professionals and enthusiasts, ensuring everyone has access to the guidance and support they need to thrive.
                            </p>
                        </motion.div>
                        <motion.div
                            variants={slideInRight}
                            className="flex-1"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                                alt="Mission"
                                className="w-full h-80 object-cover rounded-lg shadow-lg"
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Testimonials Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="py-20 bg-gray-100"
            >
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeIn}
                        className="text-4xl font-bold text-center mb-12 text-gray-800"
                    >
                        What Our Users Say
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            variants={fadeIn}
                            className="bg-white p-6 rounded-lg shadow-lg"
                        >
                            <p className="text-gray-600 mb-4 italic">
                                "FitChat has transformed the way I manage my gym. The platform is intuitive, and I can easily oversee my trainers and members. Highly recommend!"
                            </p>
                            <p className="text-gray-800 font-semibold">– John Doe, Gym Owner</p>
                        </motion.div>
                        <motion.div
                            variants={fadeIn}
                            className="bg-white p-6 rounded-lg shadow-lg"
                        >
                            <p className="text-gray-600 mb-4 italic">
                                "As a trainer, FitChat makes my job so much easier. I can create plans, schedule sessions, and chat with my clients all in one place."
                            </p>
                            <p className="text-gray-800 font-semibold">– Jane Smith, Personal Trainer</p>
                        </motion.div>
                        <motion.div
                            variants={fadeIn}
                            className="bg-white p-6 rounded-lg shadow-lg"
                        >
                            <p className="text-gray-600 mb-4 italic">
                                "I love how FitChat helps me track my progress and connect with my trainer. It’s the best fitness app I’ve ever used!"
                            </p>
                            <p className="text-gray-800 font-semibold">– Mike Johnson, Member</p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                id="contact"
                className="py-20 bg-white"
            >
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeIn}
                        className="text-4xl font-bold text-center mb-12 text-gray-800"
                    >
                        Contact Us
                    </motion.h2>
                    <motion.div
                        variants={fadeIn}
                        className="max-w-lg mx-auto bg-gray-50 p-8 rounded-lg shadow-lg"
                    >
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    rows="5"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                            >
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-lg mb-4">© 2025 FitChat. All rights reserved.</p>
                    <div className="flex justify-center space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                        <a href="#contact" className="text-gray-400 hover:text-white">Contact Us</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;