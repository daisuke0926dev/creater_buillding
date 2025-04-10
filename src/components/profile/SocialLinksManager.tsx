import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialLink } from '@/types/profile';

const PLATFORMS = [
  { id: 'twitter', name: 'Twitter', pattern: /^https?:\/\/(www\.)?twitter\.com\/.+/ },
  { id: 'instagram', name: 'Instagram', pattern: /^https?:\/\/(www\.)?instagram\.com\/.+/ },
  { id: 'tiktok', name: 'TikTok', pattern: /^https?:\/\/(www\.)?tiktok\.com\/@.+/ },
  { id: 'niconico', name: 'niconico', pattern: /^https?:\/\/(www\.)?nicovideo\.jp\/user\/.+/ },
] as const;

const socialLinkSchema = z.object({
  platform: z.enum(['twitter', 'instagram', 'tiktok', 'niconico']),
  url: z.string().url('有効なURLを入力してください').refine(
    (url) => {
      const platform = PLATFORMS.find(p => p.id === url);
      return platform ? platform.pattern.test(url) : false;
    },
    {
      message: 'プラットフォームの形式に合ったURLを入力してください',
    }
  ),
});

type SocialLinkFormData = z.infer<typeof socialLinkSchema>;

interface SocialLinksManagerProps {
  socialLinks: SocialLink[];
  onUpdate: (links: SocialLink[]) => Promise<void>;
}

export const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({ socialLinks, onUpdate }) => {
  const [links, setLinks] = useState<SocialLink[]>(socialLinks);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SocialLinkFormData>({
    resolver: zodResolver(socialLinkSchema),
  });

  const onSubmit = (data: SocialLinkFormData) => {
    const newLink: SocialLink = {
      ...data,
      id: crypto.randomUUID(),
    };
    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    onUpdate(updatedLinks);
    reset();
  };

  const removeLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    onUpdate(updatedLinks);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
            プラットフォーム
          </label>
          <select
            id="platform"
            {...register('platform')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">選択してください</option>
            {PLATFORMS.map(platform => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>
          {errors.platform && (
            <p className="mt-1 text-sm text-red-600">{errors.platform.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            URL
          </label>
          <input
            type="url"
            id="url"
            {...register('url')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="https://..."
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          リンクを追加
        </button>
      </form>

      <div className="space-y-2">
        {links.map(link => (
          <div
            key={link.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div>
              <span className="font-medium">
                {PLATFORMS.find(p => p.id === link.platform)?.name}:
              </span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-indigo-600 hover:text-indigo-500"
              >
                {link.url}
              </a>
            </div>
            <button
              onClick={() => removeLink(link.id)}
              className="text-red-500 hover:text-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}; 