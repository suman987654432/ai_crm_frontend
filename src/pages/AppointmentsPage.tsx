import React from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';

export default function AppointmentsPage() {
  return (
    <PageLayout>
      <PageHeader title="Appointments" />
      <EmptyState />
    </PageLayout>
  );
}
