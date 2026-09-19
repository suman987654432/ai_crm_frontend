import React from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';

export default function ProfilePage() {
  return (
    <PageLayout>
      <PageHeader title="User Profile" />
      <EmptyState />
    </PageLayout>
  );
}
