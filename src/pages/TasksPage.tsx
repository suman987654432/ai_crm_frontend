import React from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';

export default function TasksPage() {
  return (
    <PageLayout>
      <PageHeader title="Tasks" />
      <EmptyState />
    </PageLayout>
  );
}
