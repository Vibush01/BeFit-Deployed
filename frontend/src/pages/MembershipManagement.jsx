import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const MembershipManagement = () => {
    const { user, userDetails } = useContext(AuthContext);
    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [membershipRequests, setMembershipRequests] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/gym/members`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMembers(res.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch members', { position: "top-right" });
            }
        };

        const fetchTrainers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/gym/trainers`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTrainers(res.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch trainers', { position: "top-right" });
            }
        };

        const fetchMembershipRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/gym/membership-requests`, {
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
            if (user?.role === 'gym') {
                fetchTrainers();
            }
        }
    }, [user, userDetails]);

    const handleUpdateMembership = async () => {
        if (!selectedMember || !duration) {
            toast.error('Please select a member and duration', { position: "top-right" });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/gym/members/${selectedMember}/membership`, { duration }, {
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

    const handleRemoveMember = async (memberId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/gym/members/${memberId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMembers(members.filter((member) => member._id !== memberId));
            setMembershipRequests(membershipRequests.filter((req) => req.member._id !== memberId));
            toast.success('Member removed successfully', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove member', { position: "top-right" });
        }
    };

    const handleRemoveTrainer = async (trainerId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/gym/trainers/${trainerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTrainers(trainers.filter((trainer) => trainer._id !== trainerId));
            toast.success('Trainer removed successfully', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove trainer', { position: "top-right" });
        }
    };

    const handleRequestAction = async (requestId, action) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/gym/membership-requests/${requestId}/action`, { action }, {
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

    if (user?.role !== 'gym' && user?.role !== 'trainer') {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <p className="text-red-500">Access denied. This page is only for Gym Profiles and Trainers.</p>
        </div>;
    }

    if (user?.role === 'trainer' && !userDetails?.gym) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <p className="text-red-500">You must be associated with a gym to manage memberships.</p>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Membership Management</h1>

                {/* Update Membership Section */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-bold mb-4">Update Membership</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700">Select Member</label>
                        <select
                            value={selectedMember}
                            onChange={(e) => setSelectedMember(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select a member</option>
                            {members.map((member) => (
                                <option key={member._id} value={member._id}>
                                    {member.name} ({member.email})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">New Membership Duration</label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select duration</option>
                            <option value="1 week">1 Week</option>
                            <option value="1 month">1 Month</option>
                            <option value="3 months">3 Months</option>
                            <option value="6 months">6 Months</option>
                            <option value="1 year">1 Year</option>
                        </select>
                    </div>
                    <button
                        onClick={handleUpdateMembership}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Update Membership
                    </button>
                </div>

                {/* Membership Requests Section */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-bold mb-4">Membership Requests</h2>
                    {membershipRequests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th className="p-2">Member</th>
                                        <th className="p-2">Gym</th>
                                        <th className="p-2">Requested Duration</th>
                                        <th className="p-2">Status</th>
                                        <th className="p-2">Requested On</th>
                                        <th className="p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {membershipRequests.map((request) => (
                                        <tr key={request._id} className="border-t">
                                            <td className="p-2">{request.member.name} ({request.member.email})</td>
                                            <td className="p-2">{request.gym.gymName}</td>
                                            <td className="p-2">{request.requestedDuration}</td>
                                            <td className="p-2">{request.status}</td>
                                            <td className="p-2">{new Date(request.createdAt).toLocaleString()}</td>
                                            <td className="p-2">
                                                {request.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleRequestAction(request._id, 'approve')}
                                                            className="bg-green-600 text-white px-4 py-2 rounded mr-2 hover:bg-green-700"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequestAction(request._id, 'deny')}
                                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                                        >
                                                            Deny
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-center">No membership requests</p>
                    )}
                </div>

                {/* Members List */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-bold mb-4">Current Members</h2>
                    {members.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th className="p-2">Name</th>
                                        <th className="p-2">Email</th>
                                        <th className="p-2">Membership Duration</th>
                                        <th className="p-2">End Date</th>
                                        {user?.role === 'gym' && <th className="p-2">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member) => (
                                        <tr key={member._id} className="border-t">
                                            <td className="p-2">{member.name}</td>
                                            <td className="p-2">{member.email}</td>
                                            <td className="p-2">{member.membership?.duration || 'N/A'}</td>
                                            <td className="p-2">
                                                {member.membership?.endDate
                                                    ? new Date(member.membership.endDate).toLocaleDateString()
                                                    : 'N/A'}
                                            </td>
                                            {user?.role === 'gym' && (
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => handleRemoveMember(member._id)}
                                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-center">No members found</p>
                    )}
                </div>

                {/* Trainers List (Gym Only) */}
                {user?.role === 'gym' && (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Current Trainers</h2>
                        {trainers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr>
                                            <th className="p-2">Name</th>
                                            <th className="p-2">Email</th>
                                            <th className="p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trainers.map((trainer) => (
                                            <tr key={trainer._id} className="border-t">
                                                <td className="p-2">{trainer.name}</td>
                                                <td className="p-2">{trainer.email}</td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => handleRemoveTrainer(trainer._id)}
                                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-700 text-center">No trainers found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MembershipManagement;