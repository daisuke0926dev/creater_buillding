'use client';

import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import Link from 'next/link';

export const UserStatus = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      {user ? (
        <div className="space-y-2">
          <p className="text-lg font-semibold">ログイン中</p>
          <p className="text-gray-600">メール: {user.email}</p>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            ログアウト
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-lg font-semibold">未ログイン</p>
          <div className="space-x-2">
            <Link
              href="/auth/login"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/auth/signup"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              新規登録
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}; 