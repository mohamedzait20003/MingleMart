import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { Edit, Save, Cancel } from '@mui/icons-material';
import { TextField, Button, IconButton } from '@mui/material';

import type { RootState } from '../../../store';

const Preferences: FC = () => {
    const { language, timeZone } = useSelector((state: RootState) => state.user);
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        language: language || 'English',
        timezone: timeZone || 'UTC',
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
            language: language || 'English',
            timezone: timeZone || 'UTC',
        });
        setIsEditing(false);
    };

    return (
        <section id="preferences" className="pb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
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
                    label="Language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                />
                <TextField
                    label="Timezone"
                    name="timezone"
                    value={formData.timezone}
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

export default Preferences;