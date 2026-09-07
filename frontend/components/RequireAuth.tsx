'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Centralized UX/Navigation guard.
 * Ensures unauthenticated users are redirected to /auth with the original internal path.
 * Renders nothing while auth state is resolving to prevent any flash of content.
 */
export default function RequireAuth({ children }: RequireAuthProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      const nextParam = pathname ? `?next=${encodeURIComponent(pathname)}` : '';
      router.replace(`/auth${nextParam}`);
    }
  }, [isLoading, user, router, pathname]);

  if (isLoading || !user) {
    return null;
  }

  return <>{children}</>;
}
