import React from 'react';
import { CampaignPayload } from '../types';
import { INITIAL_SEGMENTS } from '@/data/dummyData';
import { Users, Check } from 'lucide-react';

interface Step3SegmentProps {
  data: CampaignPayload;
  updateData: (updates: Partial<CampaignPayload>) => void;
}

export default function Step3Segment({ data, updateData }: Step3SegmentProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Select Target Segment</h2>
        <p className="text-sm text-gray-400">Choose the audience segment you want this campaign to call.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {INITIAL_SEGMENTS.map(segment => {
          const isSelected = data.segmentId === segment.id;
          return (
            <div 
              key={segment.id}
              onClick={() => updateData({ segmentId: segment.id })}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.15)]' : 'bg-[#121212] border-[#333333] hover:border-[#444444] hover:bg-[#161616]'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-[#252525] text-gray-400'}`}>
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{segment.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5 text-sm">
                      <span className="font-bold text-indigo-400">{segment.contactIds.length}</span>
                      <span className="text-gray-400">Contacts</span>
                    </div>
                  </div>
                </div>
                
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-[#444444] bg-transparent'}`}>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
