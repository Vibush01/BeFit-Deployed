import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GymDashboard = () => {
    const { user, userDetails } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [announcementForm, setAnnouncementForm] = useState('');
    const [editAnnouncementId, setEditAnnouncementId] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/gym/requests', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRequests(res.data);
            } catch (err) {
                toast.error(err+'Failed to fetch join requests', { position: "top-right" });
            }
        };

        const fetchAnnouncements = async () => {
            if (user?.role === 'gym') {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get('http://localhost:5000/api/chat/announcements/gym', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setAnnouncements(res.data);
                } catch (err) {
                    toast.error(err+'Failed to fetch announcements', { position: "top-right" });
                }
            }
        };

        if (user?.role === 'gym' || (user?.role === 'trainer' && userDetails?.gym)) {
            fetchRequests();
        }
        if (user?.role === 'gym') {
            fetchAnnouncements();
        }
    }, [user, userDetails]);

    const handleAccept = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/gym/requests/${requestId}/accept`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(requests.filter((req) => req._id !== requestId));
            toast.success('Request accepted', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to accept request', { position: "top-right" });
        }
    };

    const handleDeny = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/gym/requests/${requestId}/deny`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(requests.filter((req) => req._id !== requestId));
            toast.success('Request denied', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to deny request', { position: "top-right" });
        }
    };

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        if (!announcementForm.trim()) {
            toast.error('Announcement message is required', { position: "top-right" });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (editAnnouncementId) {
                const res = await axios.put(`http://localhost:5000/api/chat/announcements/${editAnnouncementId}`, { message: announcementForm }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAnnouncements(announcements.map((ann) => (ann._id === editAnnouncementId ? res.data.announcement : ann)));
                setEditAnnouncementId(null);
                toast.success('Announcement updated', { position: "top-right" });
            } else {
                const res = await axios.post('http://localhost:5000/api/chat/announcements', { message: announcementForm }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAnnouncements([res.data.announcement, ...announcements]);
                toast.success('Announcement posted', { position: "top-right" });
            }
            setAnnouncementForm('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post announcement', { position: "top-right" });
        }
    };

    const handleEditAnnouncement = (announcement) => {
        setAnnouncementForm(announcement.message);
        setEditAnnouncementId(announcement._id);
    };

    const handleDeleteAnnouncement = async (announcementId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/chat/announcements/${announcementId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAnnouncements(announcements.filter((ann) => ann._id !== announcementId));
            toast.success('Announcement deleted', { position: "top-right" });
        } catch (err) {
            toast.error(err+'Failed to delete announcement', { position: "top-right" });
        }
    };

    if (user?.role !== 'gym' && user?.role !== 'trainer') {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <p className="text-red-500">Access denied. This page is only for Gym Profiles and Trainers.</p>
        </div>;
    }

    const isTrainerInGym = user?.role === 'trainer' && userDetails?.gym;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    {user.role === 'gym' ? 'Gym Dashboard' : 'Trainer Dashboard'}
                </h1>

                {/* Quick Links for Trainers Not in a Gym */}
                {user.role === 'trainer' && !isTrainerInGym && (
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                        <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
                        <div className="flex flex-col space-y-4">
                            <Link to="/gyms" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center">
                                Find Gym
                            </Link>
                        </div>
                    </div>
                )}

                {/* Announcements Section for Gym Profile */}
                {user.role === 'gym' && (
                    <div className="mb-8">
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
                            <h2 className="text-2xl font-bold mb-4">{editAnnouncementId ? 'Edit Announcement' : 'Post Announcement'}</h2>
                            <form onSubmit={handlePostAnnouncement}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Message</label>
                                    <textarea
                                        value={announcementForm}
                                        onChange={(e) => setAnnouncementForm(e.target.value)}
                                        className="w-full p-2 border rounded"
                                        rows="3"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                                >
                                    {editAnnouncementId ? 'Update Announcement' : 'Post Announcement'}
                                </button>
                                {editAnnouncementId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditAnnouncementId(null);
                                            setAnnouncementForm('');
                                        }}
                                        className="w-full bg-gray-500 text-white p-2 rounded mt-2 hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </form>
                        </div>

                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Your Announcements</h2>
                            {announcements.length > 0 ? (
                                <ul className="space-y-4">
                                    {announcements.map((announcement) => (
                                        <li key={announcement._id} className="border-b pb-4">
                                            <p className="text-gray-700">{announcement.message}</p>
                                            <p className="text-gray-500 text-sm">
                                                {new Date(announcement.timestamp).toLocaleString()}
                                            </p>
                                            <div className="mt-2">
                                                <button
                                                    onClick={() => handleEditAnnouncement(announcement)}
                                                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-700 text-center">No announcements posted yet</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Join Requests Section (Only for Gym or Trainer in a Gym) */}
                {(user.role === 'gym' || isTrainerInGym) && (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">{user.role === 'gym' ? 'Join Requests' : 'Member Join Requests'}</h2>
                        {requests.length > 0 ? (
                            <ul className="space-y-4">
                                {requests.map((request) => (
                                    <li key={request._id} className="border-b pb-4">
                                        <p className="text-gray-700">
                                            <strong>{request.userModel}:</strong> {request.user.name} ({request.user.email})
                                        </p>
                                        {request.userModel === 'Member' && (
                                            <p className="text-gray-700">
                                                <strong>Membership Duration:</strong> {request.membershipDuration}
                                            </p>
                                        )}
                                        <p className="text-gray-700">
                                            <strong>Requested on:</strong> {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="mt-2">
                                            <button
                                                onClick={() => handleAccept(request._id)}
                                                className="bg-green-600 text-white px-4 py-2 rounded mr-2 hover:bg-green-700"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleDeny(request._id)}
                                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 text-center">No pending join requests</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GymDashboard;