import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const MembershipManagement = () => {
    const { user, userDetails } = useContext(AuthContext);
    const [members, setMembers] = useState([]);
    const [membershipRequests, setMembershipRequests] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/gym/members', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMembers(res.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch members', { position: "top-right" });
            }
        };

        const fetchMembershipRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/gym/membership-requests', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMembershipRequests(res.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch membership requests', { position: "top-right" });
            }
        };

        if (user?.role === 'gym' || (user?.role === 'trainer' && userDetails?.gym)) {
            fetchMembers();
            fetchMembershipRequests();
        }
    }, [user, userDetails]);

    const handleUpdateMembership = async () => {
        if (!selectedMember || !duration) {
            toast.error('Please select a member and duration', { position: "top-right" });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/gym/members/${selectedMember}/membership`, { duration }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMembers(members.map((member) =>
                member._id === selectedMember
                    ? { ...member, membership: { ...member.membership, duration, endDate: calculateEndDate(duration) } }
                    : member
            ));
            setSelectedMember('');
            setDuration('');
            toast.success('Membership updated successfully', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update membership', { position: "top-right" });
        }
    };

    const handleRequestAction = async (requestId, action) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/api/gym/membership-requests/${requestId}/action`, { action }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMembershipRequests(membershipRequests.map((req) =>
                req._id === requestId ? res.data.membershipRequest : req
            ));
            if (action === 'approve') {
                const memberId = res.data.membershipRequest.member._id;
                const duration = res.data.membershipRequest.requestedDuration;
                setMembers(members.map((member) =>
                    member._id === memberId
                        ? { ...member, membership: { ...member.membership, duration, endDate: calculateEndDate(duration) } }
                        : member
                ));
            }
            toast.success(`Membership request ${action}d`, { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${action} request`, { position: "top-right" });
        }
    };

    const calculateEndDate = (duration) => {
        const startDate = new Date();
        let endDate;
        switch (duration) {
            case '1 week':
                endDate = new Date(startDate.setDate(startDate.getDate() + 7));
                break;
            case '1 month':
                endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
                break;
            case '3 months':
                endDate = new Date(startDate.setMonth(startDate.getMonth() + 3));
                break;
            case '6 months':
                endDate = new Date(startDate.setMonth(startDate.getMonth() + 6));
                break;
            case '1 year':
                endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
                break;
            default:
                endDate = new Date();
        }
        return endDate;
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

    if (user?.role !== 'gym' && user?.role !== 'trainer') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    Access denied. This page is only for Gym Profiles and Trainers.
                </motion.p>
            </div>
        );
    }

    if (user?.role === 'trainer' && !userDetails?.gym) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    You must be associated with a gym to manage memberships.
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
                    Membership Management
                </motion.h1>

                {/* Update Membership Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Update Membership</h2>
                    <motion.div variants={fadeIn} className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                            Select Member
                        </label>
                        <select
                            value={selectedMember}
                            onChange={(e) => setSelectedMember(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
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
                            New Membership Duration
                        </label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base transition-all duration-300"
                        >
                            <option value="">Select duration</option>
                            <option value="1 week">1 Week</option>
                            <option value="1 month">1 Month</option>
                            <option value="3 months">3 Months</option>
                            <option value="6 months">6 Months</option>
                            <option value="1 year">1 Year</option>
                        </select>
                    </motion.div>
                    <motion.button
                        onClick={handleUpdateMembership}
                        whileHover="hover"
                        variants={buttonHover}
                        className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
                        aria-label="Update Membership"
                    >
                        Update Membership
                    </motion.button>
                </motion.div>

                {/* Membership Requests Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Membership Requests</h2>
                    {membershipRequests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-3 sm:p-4">Member</th>
                                        <th className="p-3 sm:p-4">Gym</th>
                                        <th className="p-3 sm:p-4">Requested Duration</th>
                                        <th className="p-3 sm:p-4">Status</th>
                                        <th className="p-3 sm:p-4">Requested On</th>
                                        <th className="p-3 sm:p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {membershipRequests.map((request) => (
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
                                            <td className="p-3 sm:p-4 text-gray-600">{request.requestedDuration}</td>
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
                                                            aria-label="Approve Membership Request"
                                                        >
                                                            Approve
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => handleRequestAction(request._id, 'deny')}
                                                            whileHover="hover"
                                                            variants={buttonHover}
                                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                                                            aria-label="Deny Membership Request"
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
                        <p className="text-gray-700 text-center text-sm sm:text-base">No membership requests</p>
                    )}
                </motion.div>

                {/* Members List */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Current Members</h2>
                    {members.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-3 sm:p-4">Name</th>
                                        <th className="p-3 sm:p-4">Email</th>
                                        <th className="p-3 sm:p-4">Membership Duration</th>
                                        <th className="p-3 sm:p-4">End Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member) => (
                                        <motion.tr
                                            key={member._id}
                                            className="border-b hover:bg-gray-50 transition-all duration-300"
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            variants={zoomIn}
                                        >
                                            <td className="p-3 sm:p-4 font-medium text-gray-800">{member.name}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{member.email}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">{member.membership?.duration || 'N/A'}</td>
                                            <td className="p-3 sm:p-4 text-gray-600">
                                                {member.membership?.endDate
                                                    ? new Date(member.membership.endDate).toLocaleDateString()
                                                    : 'N/A'}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-center text-sm sm:text-base">No members found</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default MembershipManagement;