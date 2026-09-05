import { type FC, useState, useMemo } from 'react';
import { toast } from 'react-toastify';

import { MdPhotoCamera, MdEdit, MdSave, MdCancel } from 'react-icons/md';

import { useUpdatePictureMutation } from '@/lib/handlers/userHandlers';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/userSlice';

const ProfilePicture: FC = () => {
    const { profilePicURL, firstName, lastName } = useAppSelector(selectUser);
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
                    <button
                        type="button"
                        aria-label="Edit profile picture"
                        onClick={() => setIsEditing(true)}
                        className="rounded-full p-2 text-blue-600 transition hover:bg-blue-50"
                    >
                        <MdEdit />
                    </button>
                )}
            </div>
            <div className="flex items-center gap-6">
                {previewURL ? (
                    <img
                        src={previewURL}
                        alt={`${firstName} ${lastName}`}
                        className="h-25 w-25 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-25 w-25 items-center justify-center rounded-full bg-gray-200 text-2xl font-medium text-gray-600">
                        {`${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()}
                    </div>
                )}
                <div className="flex-1">
                    {isEditing ? (
                        <div className="space-y-3">
                            <div>
                                <label className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                                    <MdPhotoCamera />
                                    Choose File
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                {selectedFile && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Selected: {selectedFile.name}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={!selectedFile || isLoading}
                                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <MdSave />
                                    {isLoading
                                        ? <span role="status" aria-label="Saving" className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        : 'Save'}
                                </button>
                                <button type="button" onClick={handleCancel} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                                    <MdCancel />
                                    Cancel
                                </button>
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