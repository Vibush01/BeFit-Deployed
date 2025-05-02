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
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const slideInLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const slideInRight = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const zoomIn = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
    };

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-24 overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="relative container mx-auto text-center px-4">
                    <motion.h1
                        variants={fadeIn}
                        className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg"
                    >
                        Transform Your Fitness with BeFit
                    </motion.h1>
                    <motion.p
                        variants={fadeIn}
                        className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-md"
                    >
                        Join a community where gym owners, trainers, and members unite to achieve wellness goals seamlessly.
                    </motion.p>
                    <motion.a
                        href="#contact"
                        variants={zoomIn}
                        className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                    >
                        Get Started Now
                    </motion.a>
                </div>
            </motion.section>

            {/* About Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="py-24 bg-white"
            >
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeIn}
                        className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 tracking-tight"
                    >
                        Discover BeFit
                    </motion.h2>
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <motion.div
                            variants={slideInLeft}
                            className="flex-1"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                                alt="Fitness"
                                className="w-full h-96 object-cover rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-500"
                            />
                        </motion.div>
                        <motion.div
                            variants={slideInRight}
                            className="flex-1"
                        >
                            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                BeFit is your all-in-one fitness platform, designed to empower gym owners, trainers, and members in their pursuit of health and wellness. We provide a seamless ecosystem where technology meets fitness, offering tools to manage gyms, create personalized training plans, and track progress effectively.
                            </p>
                            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                From real-time communication to advanced progress tracking, BeFit ensures that every user—whether a beginner or a seasoned athlete—has the resources they need to succeed. Our platform fosters a supportive community, bridging the gap between fitness professionals and enthusiasts.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Join BeFit today and experience a fitness journey like never before. Let’s build a healthier, stronger future together.
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
                className="py-24 bg-gray-100"
            >
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeIn}
                        className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 tracking-tight"
                    >
                        Why BeFit Stands Out
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <motion.div
                            variants={zoomIn}
                            className="bg-white p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                        >
                            <div className="text-blue-600 mb-6">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Gym Management</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Streamline gym operations with tools to manage trainers, members, membership plans, and join requests effortlessly.
                            </p>
                        </motion.div>
                        <motion.div
                            variants={zoomIn}
                            className="bg-white p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                        >
                            <div className="text-blue-600 mb-6">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Trainer Support</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Empower trainers with features to create tailored workout and diet plans, schedule sessions, and engage with clients in real-time.
                            </p>
                        </motion.div>
                        <motion.div
                            variants={zoomIn}
                            className="bg-white p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                        >
                            <div className="text-blue-600 mb-6">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Member Tools</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Equip members with progress tracking, macro calculators, session booking, and community engagement tools for a complete fitness experience.
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
                className="py-24 bg-white"
            >
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeIn}
                        className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 tracking-tight"
                    >
                        Our Mission
                    </motion.h2>
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <motion.div
                            variants={slideInLeft}
                            className="flex-1"
                        >
                            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                At BeFit, our mission is to redefine the fitness landscape by creating a platform that inspires collaboration, motivation, and achievement. We are committed to empowering every user—gym owners, trainers, and members—with cutting-edge tools to take charge of their fitness journeys.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Fitness is more than physical strength; it’s about community and support. BeFit connects fitness professionals with enthusiasts, ensuring access to the guidance and resources needed to succeed. Let’s build a healthier future together.
                            </p>
                        </motion.div>
                        <motion.div
                            variants={slideInRight}
                            className="flex-1"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                                alt="Mission"
                                className="w-full h-96 object-cover rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-500"
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
                className="py-24 bg-gray-100"
            >
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeIn}
                        className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 tracking-tight"
                    >
                        Voices of Our Community
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <motion.div
                            variants={zoomIn}
                            className="bg-white p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-500"
                        >
                            <p className="text-gray-600 mb-6 italic leading-relaxed">
                                "BeFit has transformed the way I manage my gym. The platform is intuitive, and I can easily oversee my trainers and members. Highly recommend!"
                            </p>
                            <p className="text-gray-800 font-semibold text-lg">– John Doe, Gym Owner</p>
                        </motion.div>
                        <motion.div
                            variants={zoomIn}
                            className="bg-white p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-500"
                        >
                            <p className="text-gray-600 mb-6 italic leading-relaxed">
                                "As a trainer, BeFit makes my job so much easier. I can create plans, schedule sessions, and chat with my clients all in one place."
                            </p>
                            <p className="text-gray-800 font-semibold text-lg">– Jane Smith, Personal Trainer</p>
                        </motion.div>
                        <motion.div
                            variants={zoomIn}
                            className="bg-white p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-500"
                        >
                            <p className="text-gray-600 mb-6 italic leading-relaxed">
                                "I love how BeFit helps me track my progress and connect with my trainer. It’s the best fitness app I’ve ever used!"
                            </p>
                            <p className="text-gray-800 font-semibold text-lg">– Mike Johnson, Member</p>
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
                className="py-24 bg-white"
            >
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeIn}
                        className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 tracking-tight"
                    >
                        Get in Touch
                    </motion.h2>
                    <motion.div
                        variants={fadeIn}
                        className="max-w-xl mx-auto bg-gray-50 p-10 rounded-2xl shadow-2xl"
                    >
                        <form onSubmit={handleSubmit}>
                            <motion.div variants={fadeIn} className="mb-6">
                                <label className="block text-gray-800 font-semibold mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                                    required
                                />
                            </motion.div>
                            <motion.div variants={fadeIn} className="mb-6">
                                <label className="block text-gray-800 font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                                    required
                                />
                            </motion.div>
                            <motion.div variants={fadeIn} className="mb-6">
                                <label className="block text-gray-800 font-semibold mb-2">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                                    required
                                />
                            </motion.div>
                            <motion.div variants={fadeIn} className="mb-6">
                                <label className="block text-gray-800 font-semibold mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                                    required
                                />
                            </motion.div>
                            <motion.div variants={fadeIn} className="mb-6">
                                <label className="block text-gray-800 font-semibold mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                                    rows="5"
                                    required
                                />
                            </motion.div>
                            <motion.button
                                type="submit"
                                variants={zoomIn}
                                className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                            >
                                Send Message
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </motion.section>

            {/* Footer */}
            <motion.footer
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-gray-900 text-white py-12"
            >
                <div className="container mx-auto px-4 text-center">
                    <motion.p
                        variants={fadeIn}
                        className="text-lg mb-6"
                    >
                        © 2025 BeFit. All rights reserved.
                    </motion.p>
                    <motion.div
                        variants={fadeIn}
                        className="flex justify-center space-x-6"
                    >
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition-all duration-300">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition-all duration-300">Terms of Service</a>
                        <a href="#contact" className="text-gray-400 hover:text-blue-400 transition-all duration-300">Contact Us</a>
                    </motion.div>
                </div>
            </motion.footer>
        </div>
    );
};

export default Home;