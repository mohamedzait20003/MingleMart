import { type FC, useState } from 'react';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Edit, Save, Cancel, Visibility, VisibilityOff } from '@mui/icons-material';

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
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                )}
            </div>
            {!isEditing ? (
                <p className="text-sm text-gray-500">••••••••••••</p>
            ) : (
                <div className="space-y-4">
                    <TextField
                        label="Current Password"
                        name="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => togglePasswordVisibility('current')}
                                        edge="end"
                                    >
                                        {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="New Password"
                        name="newPassword"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => togglePasswordVisibility('new')}
                                        edge="end"
                                    >
                                        {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Confirm New Password"
                        name="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        edge="end"
                                    >
                                        {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 3 }}
                    />
                    <div className="flex gap-2">
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
                </div>
            )}
        </section>
    );
};

export default ChangePassword;