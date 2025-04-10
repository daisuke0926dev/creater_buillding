'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-500">
            アカウントをお持ちでない方はこちら
          </Link>
          <div className="mt-2">
            <Link href="/auth/reset-password" className="text-indigo-600 hover:text-indigo-500">
              パスワードをお忘れの方はこちら
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 