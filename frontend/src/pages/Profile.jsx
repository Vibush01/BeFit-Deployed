import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profileImage: null,
    });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFormData({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    password: '',
                    profileImage: null,
                });
                setPreviewImage(res.data.profileImage || null);
            } catch (err) {
                toast.error(err+'Failed to fetch profile', { position: "top-right" });
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    const handleChange = (e) => {
        if (e.target.name === 'profileImage') {
            const file = e.target.files[0];
            setFormData({ ...formData, profileImage: file });
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            if (formData.name) data.append('name', formData.name);
            if (formData.password) data.append('password', formData.password);
            if (formData.profileImage) data.append('profileImage', formData.profileImage);

            await axios.put('http://localhost:5000/api/auth/profile', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFormData({ ...formData, password: '' });
            toast.success('Profile updated successfully', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile', { position: "top-right" });
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>

                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <img
                            src={previewImage || 'https://via.placeholder.com/150'}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        <input
                            type="file"
                            name="profileImage"
                            onChange={handleChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                        />
                        <button
                            className="absolute bottom-0 right-0 bg-blue-600 text-white px-2 py-1 rounded-full text-sm"
                            onClick={(e) => e.preventDefault()}
                        >
                            Upload
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">New Password (optional)</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-2"
                    >
                        Update Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;