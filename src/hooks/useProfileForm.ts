import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';

const profileSchema = z.object({
  displayName: z.string()
    .min(1, '表示名は必須です')
    .max(50, '表示名は50文字以内で入力してください'),
  bio: z.string()
    .max(1000, '自己紹介は1000文字以内で入力してください'),
  contactEmail: z.string()
    .email('正しいメールアドレスを入力してください'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

interface UseProfileFormReturn {
  form: ReturnType<typeof useForm<ProfileFormData>>;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: ProfileFormData) => Promise<void>;
}

export const useProfileForm = (): UseProfileFormReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getIdToken } = useAuth();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      bio: '',
      contactEmail: '',
    },
  });

  const updateProfile = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getIdToken();
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'プロフィールの更新に失敗しました');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    error,
    updateProfile,
  };
}; 