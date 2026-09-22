"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, MoreVertical, Bot, Megaphone, PhoneCall, Clock, Phone, TrendingUp } from 'lucide-react';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { CopyableId } from '@/components/common/CopyableId';
import VoicePlayground from '@/components/VoicePlayground';

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [testingAgent, setTestingAgent] = useState<any | null>(null);
  
  // Edit logic is now handled in the wizard
  // (Removed modal states)

  const fetchAgents = () => {
    fetch('http://localhost:5000/api/v1/agents')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAgents(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/agents/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setAgents(agents.filter(a => a.id !== id));
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete agent');
      }
    }
    setOpenMenuId(null);
  };

  const handleTryCall = (agent: any) => {
    setTestingAgent(agent);
    setOpenMenuId(null);
  };
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
        {loading ? (
          <div className="flex items-center justify-center h-48 w-full text-gray-400">Loading agents...</div>
        ) : agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-[#333] rounded-xl text-gray-400 bg-[#1c1c1c]">
            <Bot className="h-8 w-8 text-gray-500 mb-2" />
            <p>No agents found. Create your first agent!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {agents.map(agent => (
              <div key={agent.id} className="group flex flex-col bg-[#1c1c1c] border border-[#333333] rounded-xl overflow-hidden hover:border-[#444444] transition-colors shadow-sm">
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <CopyableId id={agent.id.substring(0, 8)} className="mb-1" />
                      <Link href={`/agents/${agent.id}`} className="hover:underline focus:outline-none">
                        <h3 className="text-base font-semibold text-white">{agent.name}</h3>
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        agent.status.toLowerCase() === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        agent.status.toLowerCase() === 'paused' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${
                          agent.status.toLowerCase() === 'active' ? 'bg-green-500' :
                          agent.status.toLowerCase() === 'paused' ? 'bg-orange-500' : 'bg-gray-500'
                        }`} />
                        {agent.status}
                      </span>
                      <div className="relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === agent.id ? null : agent.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {openMenuId === agent.id && (
                          <div className="absolute right-0 top-full mt-1 w-32 bg-[#2d2d2d] border border-[#444] rounded shadow-lg z-10 overflow-hidden">
                            <Link 
                              href={`/agents/create?edit=${agent.id}`}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#3d3d3d] hover:text-white transition-colors"
                            >
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleTryCall(agent)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#3d3d3d] hover:text-white transition-colors"
                            >
                              Try Call
                            </button>
                            <button 
                              onClick={() => handleDelete(agent.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#3d3d3d] hover:text-red-300 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
                    {agent.description || agent.primary_goal}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-[#252525] border border-[#333333] text-xs text-gray-300">
                      Type: {agent.category}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded bg-[#252525] border border-[#333333] text-xs text-gray-300">
                      Voice: {agent.voice_name || 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div className="bg-[#222222] border-t border-[#333333] p-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Calls
                    </span>
                    <span className="text-sm font-medium text-gray-200">0</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Success Rate
                    </span>
                    <span className="text-sm font-medium text-gray-200">-</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Created
                    </span>
                    <span className="text-sm font-medium text-gray-400">{new Date(agent.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {testingAgent && (
        <VoicePlayground agent={testingAgent} onClose={() => setTestingAgent(null)} />
      )}
    </PageLayout>
  );
}
