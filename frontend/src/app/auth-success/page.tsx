'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '../../store/hooks';
import { setToken, fetchUser } from '../../store/slices/authSlice';

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      dispatch(setToken(token));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(fetchUser() as any).then((res: any) => {
        if (res.payload?.role === 'Teacher') {
          router.push('/teacher/dashboard');
        } else {
          router.push('/candidate/dashboard');
        }
      });
    } else {
      router.push('/');
    }
  }, [dispatch, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}
