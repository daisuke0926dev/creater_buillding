import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageUploader } from './ImageUploader';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ProfileData } from '@/types/profile';

// バリデーションスキーマの定義
const profileSchema = z.object({
  displayName: z.string()
    .min(1, '表示名は必須です')
    .max(50, '表示名は50文字以内で入力してください'),
  bio: z.string()
    .max(1000, '自己紹介は1000文字以内で入力してください'),
  contactEmail: z.string()
    .email('正しいメールアドレスを入力してください'),
});

type ProfileSchemaType = z.infer<typeof profileSchema>;

export interface ProfileFormData extends ProfileSchemaType {
  profileImage: File | null;
  profileImageUrl?: string;
}

interface ProfileEditFormProps {
  profileData: ProfileData;
  onSubmit: (data: ProfileData) => Promise<void>;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profileData, onSubmit }) => {
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    profileData?.profileImageUrl
  );
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profileData?.displayName || '',
      bio: profileData?.bio || '',
      contactEmail: profileData?.contactEmail || '',
    },
  });

  const { uploadImage, isUploading, error: uploadError } = useImageUpload('profile-images');

  const handleFormSubmit = async (data: ProfileSchemaType) => {
    try {
      await onSubmit({
        ...data,
        profileImageUrl,
        socialLinks: profileData.socialLinks || [],
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleImageSelect = async (file: File) => {
    try {
      const url = await uploadImage(file);
      setProfileImageUrl(url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">プロフィール画像</h3>
        <ImageUploader
          onImageSelect={handleImageSelect}
          currentImageUrl={profileImageUrl}
        />
        {uploadError && (
          <p className="mt-1 text-sm text-red-600">{uploadError}</p>
        )}
      </div>

      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
          表示名 *
        </label>
        <input
          type="text"
          id="displayName"
          {...register('displayName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.displayName && (
          <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          自己紹介
        </label>
        <textarea
          id="bio"
          rows={4}
          {...register('bio')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
          連絡先メールアドレス *
        </label>
        <input
          type="email"
          id="contactEmail"
          {...register('contactEmail')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.contactEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
          ${isUploading
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
      >
        {isUploading ? '画像アップロード中...' : '保存'}
      </button>
    </form>
  );
}; 