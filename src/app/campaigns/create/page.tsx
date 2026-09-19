import React from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import CreateCampaignWizard from '@/components/campaigns/CreateCampaignWizard';

export default function CreateCampaignPage() {
  return (
    <PageLayout>
      <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-6">
        <CreateCampaignWizard />
      </div>
    </PageLayout>
  );
}
