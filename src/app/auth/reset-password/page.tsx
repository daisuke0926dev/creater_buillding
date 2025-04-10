'use client';

import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <ResetPasswordForm />
        <div className="mt-4 text-center text-sm">
          <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
            ログインページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
} 