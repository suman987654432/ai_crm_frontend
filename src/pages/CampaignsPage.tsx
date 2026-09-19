"use client";

import React from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { INITIAL_CAMPAIGNS } from '@/data/dummyData';
import CampaignCard from '@/components/campaigns/CampaignCard';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CampaignsPage() {
  const router = useRouter();

  return (
    <PageLayout>
      <PageHeader title="Campaigns">
        <button 
          onClick={() => router.push('/campaigns/create')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      </PageHeader>
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1600px] mx-auto w-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {INITIAL_CAMPAIGNS.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
