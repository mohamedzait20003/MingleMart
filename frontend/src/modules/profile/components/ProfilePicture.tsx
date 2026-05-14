import { type FC, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { Avatar, IconButton, Button, CircularProgress } from '@mui/material';
import { PhotoCamera, Edit, Save, Cancel } from '@mui/icons-material';

import type { RootState } from '../../../store';
import { useUpdatePictureMutation } from '../../../store/apis/userApi';

const ProfilePicture: FC = () => {
    const { profilePicURL, firstName, lastName } = useSelector((state: RootState) => state.user);
    const [updatePicture, { isLoading }] = useUpdatePictureMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const previewURL = useMemo(() => {
        if (selectedFile) {
            return URL.createObjectURL(selectedFile);
        }

        return profilePicURL || null;
    }, [selectedFile, profilePicURL]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
        }
    };

    const handleSave = async () => {
        try {
            if(!selectedFile) {
                toast.error('No file selected');
                return;
            }

            await updatePicture({ picture: selectedFile }).unwrap();
        } catch (err) {
            console.error('Error uploading profile picture:', err);
        } finally {
            setIsEditing(false);
            setSelectedFile(null);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedFile(null);
    };

    return (
        <section id="picture" className="pb-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Profile Picture</h2>
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
            <div className="flex items-center gap-6">
                <Avatar
                    sx={{ width: 100, height: 100 }}
                    alt={`${firstName} ${lastName}`}
                    src={previewURL || undefined}
                />
                <div className="flex-1">
                    {isEditing ? (
                        <div className="space-y-3">
                            <div>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<PhotoCamera />}
                                >
                                    Choose File
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                {selectedFile && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Selected: {selectedFile.name}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    onClick={handleSave}
                                    disabled={!selectedFile || isLoading}
                                    size="small"
                                >
                                    {isLoading ? <CircularProgress size={20} /> : 'Save'}
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
                    ) : (
                        <p className="text-sm text-gray-500">Click edit to update your profile picture</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProfilePicture;