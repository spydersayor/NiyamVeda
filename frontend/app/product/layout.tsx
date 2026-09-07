import React from 'react';
import RequireAuth from '@/components/RequireAuth';

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
