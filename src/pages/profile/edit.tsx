import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { SocialLinksManager } from '@/components/profile/SocialLinksManager';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          setProfileData({
            displayName: user.displayName || '',
            email: user.email || '',
            introduction: '',
            profileImageUrl: user.photoURL || '',
            socialLinks: []
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('プロファイルデータの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">プロファイル編集</h1>
      <div className="space-y-8">
        <ProfileEditForm profileData={profileData} onSubmit={async (data) => {
          // プロファイルの更新処理をここに実装
          console.log('Profile update:', data);
        }} />
        <SocialLinksManager 
          socialLinks={profileData.socialLinks || []} 
          onUpdate={async (links) => {
            // ソーシャルリンクの更新処理をここに実装
            console.log('Social links update:', links);
          }}
        />
      </div>
    </div>
  );
} 