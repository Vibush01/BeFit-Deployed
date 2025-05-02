import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const RoleSelection = () => {
    const [role, setRole] = useState('');
    const location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!role) {
            alert('Please select a role');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Select Role</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="gym">Gym Profile</option>
                            <option value="trainer">Trainer</option>
                            <option value="member">Member</option>
                        </select>
                    </div>
                    {role && (
                        <Link
                            to={`/signup/${role}`}
                            state={{ from: location.state?.from }}
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 text-center block"
                        >
                            Continue
                        </Link>
                    )}
                </form>
                <p className="mt-4 text-center">
                    Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
};

export default RoleSelection;