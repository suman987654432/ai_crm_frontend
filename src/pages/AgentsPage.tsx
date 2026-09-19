import React from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, LayoutGrid, List, MoreVertical, Bot, Megaphone, PhoneCall, CheckCircle2, Clock, Phone, TrendingUp } from 'lucide-react';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { CopyableId } from '@/components/common/CopyableId';

const agents = [
  {
    id: 1,
    name: 'Sales Follow-up Agent',
    description: 'Automatically follows up with new leads via voice and qualifies them.',
    status: 'Active',
    type: 'Sales',
    voice: 'Priya (Hindi)',
    calls: '1,243',
    successRate: '24%',
    lastActive: '2 mins ago',
    icon: PhoneCall,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    id: 2,
    name: 'Appointment Booker',
    description: 'Handles inbound queries and books calendar appointments.',
    status: 'Active',
    type: 'Support',
    voice: 'Aarav (English)',
    calls: '3,892',
    successRate: '68%',
    lastActive: '1 hr ago',
    icon: CalendarIcon, // Note: Calendar is already exported from lucide, but I'll use Bot
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    id: 3,
    name: 'Lead Qualification Bot',
    description: 'Initial interaction bot to gather requirements and assign tags.',
    status: 'Draft',
    type: 'Lead Qualification',
    voice: 'Unassigned',
    calls: '0',
    successRate: '-',
    lastActive: 'Yesterday',
    icon: Bot,
    color: 'text-gray-400',
    bg: 'bg-gray-400/10',
  },
  {
    id: 4,
    name: 'Customer Support Agent',
    description: 'Answers FAQs and resolves tier 1 support tickets automatically.',
    status: 'Paused',
    type: 'Support',
    voice: 'Priya (English)',
    calls: '8,190',
    successRate: '82%',
    lastActive: '3 days ago',
    icon: Megaphone,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  }
];

function CalendarIcon(props: any) {
  return <Bot {...props} />; // Placeholder
}

export default function AgentsPage() {
  return (
    <PageLayout>
      <PageHeader title="AI Agents">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full pl-9 pr-4 py-2 bg-[#1c1c1c] border border-[#333333] rounded-md text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
            />
          </div>

          <div className="flex items-center bg-[#1c1c1c] border border-[#333333] rounded-md p-1 h-9">
            <button className="px-3 py-1 text-sm font-medium bg-[#2d2d2d] text-white rounded shadow-sm">All</button>
            <button className="px-3 py-1 text-sm font-medium text-gray-400 hover:text-gray-200">Active</button>
            <button className="px-3 py-1 text-sm font-medium text-gray-400 hover:text-gray-200">Draft</button>
            <button className="px-3 py-1 text-sm font-medium text-gray-400 hover:text-gray-200">Archived</button>
          </div>

          <Link href="/agents/create">
            <button className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 h-9 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm">
              <Plus className="h-4 w-4" />
              Create Agent
            </button>
          </Link>
        </div>
      </PageHeader>

      <div className="p-8 flex flex-col space-y-6 overflow-y-auto flex-1">
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div key={agent.id} className="group flex flex-col bg-[#1c1c1c] border border-[#333333] rounded-xl overflow-hidden hover:border-[#444444] transition-colors shadow-sm">
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CopyableId id={`agt-00${agent.id}`} className="mb-1" />
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                    <Link href={`/agents/${agent.id}`}>{agent.name}</Link>
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                    agent.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    agent.status === 'Paused' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      agent.status === 'Active' ? 'bg-green-500' :
                      agent.status === 'Paused' ? 'bg-orange-500' : 'bg-gray-500'
                    }`} />
                    {agent.status}
                  </span>
                  <button className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
                {agent.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2 py-1 rounded bg-[#252525] border border-[#333333] text-xs text-gray-300">
                  Type: {agent.type}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded bg-[#252525] border border-[#333333] text-xs text-gray-300">
                  Voice: {agent.voice}
                </span>
              </div>
            </div>

            <div className="bg-[#222222] border-t border-[#333333] p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Calls
                </span>
                <span className="text-sm font-medium text-gray-200">{agent.calls}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Success Rate
                </span>
                <span className="text-sm font-medium text-gray-200">{agent.successRate}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Last Active
                </span>
                <span className="text-sm font-medium text-gray-400">{agent.lastActive}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </PageLayout>
  );
}
