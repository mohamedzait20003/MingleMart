import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { Edit, Save, Cancel } from '@mui/icons-material';
import { TextField, Button, IconButton } from '@mui/material';

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
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                />
                <TextField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                />
            </div>
            {isEditing && (
                <div className="flex gap-2 mt-4">
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        size="small"
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        size="small"
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </section>
    );
};

export default PersonalInformation;