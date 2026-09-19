import React from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';

export default function SettingsPage() {
  return (
    <PageLayout>
      <PageHeader title="Settings" />
      <EmptyState />
    </PageLayout>
  );
}
