import { type FC, useState } from 'react';
import { MdEdit, MdSave, MdCancel, MdVisibility, MdVisibilityOff } from 'react-icons/md';

const ChangePassword: FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
    };

    const handleSave = () => {
        // Handle password change logic here
        if (formData.newPassword !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        setIsEditing(false);
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    const handleCancel = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setIsEditing(false);
    };

    return (
        <section id="change-password" className="pb-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                {!isEditing && (
                    <button
                        type="button"
                        aria-label="Edit section"
                        onClick={() => setIsEditing(true)}
                        className="rounded-full p-2 text-blue-600 transition hover:bg-blue-50"
                    >
                            <MdEdit />
                    </button>
                )}
            </div>
            {!isEditing ? (
                <p className="text-sm text-gray-500">••••••••••••</p>
            ) : (
                <div className="space-y-4">
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-gray-700">Current Password</span>
                        <div className="relative">
                            <input
                                name="currentPassword"
                                type={showPasswords.current ? 'text' : 'password'}
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-500 pr-10"
                            />
                            <button
                                type="button"
                                aria-label="Toggle password visibility"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 transition hover:text-gray-700"
                            >
                                {showPasswords.current ? <MdVisibilityOff /> : <MdVisibility />}
                            </button>
                        </div>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-gray-700">New Password</span>
                        <div className="relative">
                            <input
                                name="newPassword"
                                type={showPasswords.new ? 'text' : 'password'}
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-500 pr-10"
                            />
                            <button
                                type="button"
                                aria-label="Toggle password visibility"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 transition hover:text-gray-700"
                            >
                                {showPasswords.new ? <MdVisibilityOff /> : <MdVisibility />}
                            </button>
                        </div>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-gray-700">Confirm New Password</span>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-500 pr-10"
                            />
                            <button
                                type="button"
                                aria-label="Toggle password visibility"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 transition hover:text-gray-700"
                            >
                                {showPasswords.confirm ? <MdVisibilityOff /> : <MdVisibility />}
                            </button>
                        </div>
                    </label>
                    <div className="flex gap-2">
                        <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                            <MdSave />
                            Save
                        </button>
                        <button type="button" onClick={handleCancel} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                            <MdCancel />
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ChangePassword;