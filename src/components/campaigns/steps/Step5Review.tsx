import React from 'react';
import { CampaignPayload } from '../types';
import { DUMMY_AGENTS, INITIAL_SEGMENTS } from '@/data/dummyData';
import { Calendar, Clock, Globe, Phone, Users, Mic } from 'lucide-react';

interface Step5ReviewProps {
  data: CampaignPayload;
}

export default function Step5Review({ data }: Step5ReviewProps) {
  const agent = DUMMY_AGENTS.find(a => a.id === data.agentId);
  const segment = INITIAL_SEGMENTS.find(s => s.id === data.segmentId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Review Campaign</h2>
        <p className="text-sm text-gray-400">Please review your campaign details before finalizing.</p>
      </div>

      <div className="bg-[#121212] border border-[#333333] rounded-xl overflow-hidden divide-y divide-[#222222]">
        
        {/* Info */}
        <div className="p-5 flex items-start gap-4">
          <div className="p-2 bg-[#252525] rounded-md shrink-0"><Phone className="h-5 w-5 text-gray-400" /></div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Campaign Info</div>
            <div className="font-bold text-white text-lg">{data.name}</div>
            <div className="text-sm text-indigo-400 mt-1">{data.phoneNumber}</div>
          </div>
        </div>

        {/* Agent */}
        <div className="p-5 flex items-start gap-4">
          <div className="p-2 bg-[#252525] rounded-md shrink-0"><Mic className="h-5 w-5 text-gray-400" /></div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">AI Agent</div>
            <div className="font-medium text-white">{agent?.name || 'Not Selected'}</div>
          </div>
        </div>

        {/* Segment */}
        <div className="p-5 flex items-start gap-4">
          <div className="p-2 bg-[#252525] rounded-md shrink-0"><Users className="h-5 w-5 text-gray-400" /></div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Target Segment</div>
            <div className="font-medium text-white">{segment?.name || 'Not Selected'}</div>
            <div className="text-sm text-gray-400 mt-1">{segment?.contactIds.length || 0} Contacts</div>
          </div>
        </div>

        {/* Schedule */}
        <div className="p-5 flex items-start gap-4">
          <div className="p-2 bg-[#252525] rounded-md shrink-0"><Calendar className="h-5 w-5 text-gray-400" /></div>
          <div className="w-full">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Schedule</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Selected Days</div>
                <div className="font-medium text-white mt-0.5">
                  {data.selectedDays.length === 7 ? 'Every day' : data.selectedDays.map(d => d.substring(0,3)).join(', ')}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Daily Timings</div>
                <div className="font-medium text-white mt-0.5">{data.callingWindowStart} - {data.callingWindowEnd}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
              <Globe className="h-3.5 w-3.5" /> {data.timezone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
