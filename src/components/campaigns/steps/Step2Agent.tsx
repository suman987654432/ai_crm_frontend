import React from 'react';
import { CampaignPayload } from '../types';
import { DUMMY_AGENTS } from '@/data/dummyData';
import { Mic, Check } from 'lucide-react';

interface Step2AgentProps {
  data: CampaignPayload;
  updateData: (updates: Partial<CampaignPayload>) => void;
}

export default function Step2Agent({ data, updateData }: Step2AgentProps) {
  const selectedAgent = DUMMY_AGENTS.find(a => a.id === data.agentId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Choose AI Agent</h2>
        <p className="text-sm text-gray-400">Select the AI agent that will make the calls for this campaign.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {DUMMY_AGENTS.map(agent => {
          const isSelected = data.agentId === agent.id;
          return (
            <div 
              key={agent.id}
              onClick={() => updateData({ agentId: agent.id })}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.15)]' : 'bg-[#121212] border-[#333333] hover:border-[#444444] hover:bg-[#161616]'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-[#252525] text-gray-400'}`}>
                    <Mic className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{agent.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 font-medium">
                      <span className="bg-[#1c1c1c] border border-[#333333] px-2 py-0.5 rounded text-gray-300">{agent.language}</span>
                      <span>•</span>
                      <span className="text-gray-300">{agent.tone}</span>
                      <span>•</span>
                      <span className="text-gray-500">{agent.type}</span>
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
