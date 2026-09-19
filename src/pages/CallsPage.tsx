"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';
import CallsTable from '@/components/calls/CallsTable';
import TranscriptModal from '@/components/calls/TranscriptModal';
import { INITIAL_CALLS } from '@/data/dummyData';
import { Call } from '@/components/calls/types';

export default function CallsPage() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [transcriptCall, setTranscriptCall] = useState<Call | null>(null);

  const handleViewTranscript = (call: Call) => {
    setTranscriptCall(call);
  };

  const handleViewDetails = (call: Call) => {
    console.log("View details for:", call.id);
  };

  const handleDelete = (call: Call) => {
    console.log("Delete call:", call.id);
  };

  return (
    <PageLayout>
      <PageHeader title="Calls">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search calls..."
              className="w-full pl-9 pr-4 py-2 bg-[#1c1c1c] border border-[#333333] rounded-md text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
            />
          </div>
        </div>
      </PageHeader>
      
      <CallsTable 
        calls={INITIAL_CALLS}
        globalFilter={globalFilter}
        onViewTranscript={handleViewTranscript}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
      />

      <TranscriptModal 
        call={transcriptCall}
        onClose={() => setTranscriptCall(null)}
      />
    </PageLayout>
  );
}
