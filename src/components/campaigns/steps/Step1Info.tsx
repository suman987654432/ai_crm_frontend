import React from 'react';
import { CampaignPayload } from '../types';
import { AVAILABLE_NUMBERS, DUMMY_AGENTS, INITIAL_SEGMENTS } from '@/data/dummyData';
import { ChevronDown, Mic, Users } from 'lucide-react';

interface Step1InfoProps {
  data: CampaignPayload;
  updateData: (updates: Partial<CampaignPayload>) => void;
}

export default function Step1Info({ data, updateData }: Step1InfoProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Campaign Information</h2>
        <p className="text-sm text-gray-400">Set up the core details for your new campaign.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="e.g. Inactive Customer Follow-up"
            className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
          <div className="relative">
            <select
              value={data.phoneNumber}
              onChange={(e) => updateData({ phoneNumber: e.target.value })}
              className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="" disabled>Select a number</option>
              {AVAILABLE_NUMBERS.map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
          </div>
          <p className="text-xs text-gray-500 mt-2">The business number used to make outgoing calls.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Mic className="h-4 w-4 text-indigo-400" /> AI Agent
            </label>
            <div className="relative">
              <select
                value={data.agentId}
                onChange={(e) => updateData({ agentId: e.target.value })}
                className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="" disabled>Select an agent</option>
                {DUMMY_AGENTS.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name} ({agent.language})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Users className="h-4 w-4 text-indigo-400" /> Target Segment
            </label>
            <div className="relative">
              <select
                value={data.segmentId}
                onChange={(e) => updateData({ segmentId: e.target.value })}
                className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="" disabled>Select a segment</option>
                {INITIAL_SEGMENTS.map(segment => (
                  <option key={segment.id} value={segment.id}>{segment.name} ({segment.contactIds.length} contacts)</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
