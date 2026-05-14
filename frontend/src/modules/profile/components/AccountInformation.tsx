import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { TextField, Button, IconButton } from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import type { RootState } from '../../../store';

const AccountInformation: FC = () => {
    const { username, email } = useSelector((state: RootState) => state.user);

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        username: username || '',
        email: email || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            username: username || '',
            email: email || '',
        });
        setIsEditing(false);
    };

    return (
        <section id="account" className="pb-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
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
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
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

export default AccountInformation;