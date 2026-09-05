import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { MdEdit, MdSave, MdCancel } from 'react-icons/md';

import type { RootState } from '../../../store';

const PersonalInformation: FC = () => {
    const { firstName, lastName, dateOfBirth, gender } = useSelector((state: RootState) => state.user);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: firstName || '',
        lastName: lastName || '',
        dateOfBirth: dateOfBirth || '',
        gender: gender || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Handle save logic here
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            firstName: firstName || '',
            lastName: lastName || '',
            dateOfBirth: dateOfBirth || '',
            gender: gender || '',
        });
        setIsEditing(false);
    };

    return (
        <section id="personal" className="pb-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">First Name</span>
                    <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </label>
                <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">Last Name</span>
                    <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </label>
                <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">Date of Birth</span>
                    <input
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </label>
                <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">Gender</span>
                    <input
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </label>
            </div>
            {isEditing && (
                <div className="flex gap-2 mt-4">
                    <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                        <MdSave />
                        Save
                    </button>
                    <button type="button" onClick={handleCancel} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                        <MdCancel />
                        Cancel
                    </button>
                </div>
            )}
        </section>
    );
};

export default PersonalInformation;