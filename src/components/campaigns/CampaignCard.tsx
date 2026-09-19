import React, { useState } from 'react';
import { Campaign } from './types';
import { Phone, Mic, Users, Calendar, MoreVertical, Edit, Pause, Play, Trash2, CheckCircle2, PhoneOff, AlertCircle } from 'lucide-react';
import { CopyableId } from '@/components/common/CopyableId';

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'Running': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Scheduled': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Completed': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'Draft': return 'bg-[#2a2a2a] text-gray-300 border-[#444444]';
      case 'Paused': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Failed': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-[#2a2a2a] text-gray-300 border-[#444444]';
    }
  };

  const getStatusDotColor = (status: Campaign['status']) => {
    switch (status) {
      case 'Running': return 'bg-emerald-500';
      case 'Scheduled': return 'bg-indigo-500';
      case 'Completed': return 'bg-gray-500';
      case 'Paused': return 'bg-yellow-500';
      case 'Failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const completedPerc = campaign.totalContacts > 0 ? Math.round((campaign.callsCompleted / campaign.totalContacts) * 100) : 0;
  const noAnswerPerc = campaign.totalContacts > 0 ? Math.round((campaign.stats.noAnswer / campaign.totalContacts) * 100) : 0;
  const callbackPerc = campaign.totalContacts > 0 ? Math.round((campaign.stats.callback / campaign.totalContacts) * 100) : 0;

  return (
    <div className="bg-[#1c1c1c] border border-[#333333] rounded-2xl p-5 shadow-xl flex flex-col transition-all hover:border-[#444444]">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <CopyableId id={campaign.id} className="mb-1" />
          <h3 className="text-xl font-bold text-white mb-1">{campaign.name}</h3>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border ${getStatusColor(campaign.status)}`}>
            <div className={`h-2 w-2 rounded-full ${getStatusDotColor(campaign.status)}`} />
            {campaign.status}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-48 bg-[#252525] border border-[#333333] rounded-lg shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#333333] hover:text-white flex items-center gap-2 transition-colors">
                    <Edit className="h-4 w-4" /> Edit Campaign
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#333333] hover:text-white flex items-center gap-2 transition-colors">
                    {campaign.status === 'Paused' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />} 
                    {campaign.status === 'Paused' ? 'Resume Campaign' : 'Pause Campaign'}
                  </button>
                  <div className="h-px bg-[#333333] my-1" />
                  <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                    <Trash2 className="h-4 w-4" /> Delete Campaign
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Info Grid (2 Columns) */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-5">
        {/* Agent */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#252525] border border-[#333333] flex items-center justify-center shrink-0">
            <Mic className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">AI Agent</div>
            <div className="text-sm font-semibold text-gray-200 truncate">{campaign.agentName}</div>
          </div>
        </div>

        {/* Segment */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#252525] border border-[#333333] flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Target Segment</div>
            <div className="text-sm font-semibold text-gray-200 truncate">
              {campaign.segmentName} <span className="text-gray-500 font-medium">({campaign.totalContacts.toLocaleString()})</span>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#252525] border border-[#333333] flex items-center justify-center shrink-0">
            <Calendar className="h-4 w-4 text-orange-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Schedule</div>
            <div className="text-sm font-semibold text-gray-200 truncate">
              {campaign.scheduleDate} at {campaign.scheduleTime}
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#252525] border border-[#333333] flex items-center justify-center shrink-0">
            <Phone className="h-4 w-4 text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Phone Number</div>
            <div className="text-sm font-semibold text-gray-200 truncate">{campaign.phoneNumber}</div>
          </div>
        </div>
      </div>

      {/* 3 Key Stats at Bottom */}
      <div className="mt-auto border-t border-[#333333] pt-4">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Performance Metrics</div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#121212] border border-[#333333] rounded-lg p-3">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xl font-bold">{completedPerc}%</span>
            </div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Calls Completed</div>
          </div>
          
          <div className="bg-[#121212] border border-[#333333] rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-400 mb-1">
              <PhoneOff className="h-4 w-4" />
              <span className="text-xl font-bold">{noAnswerPerc}%</span>
            </div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">No Answer</div>
          </div>

          <div className="bg-[#121212] border border-[#333333] rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-400 mb-1">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xl font-bold">{callbackPerc}%</span>
            </div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Callback Requested</div>
          </div>
        </div>
      </div>
    </div>
  );
}
