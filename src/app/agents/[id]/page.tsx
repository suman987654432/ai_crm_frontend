"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';
import VoicePlayground from '@/components/VoicePlayground';

export default function AgentDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/agents/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAgent(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] text-white p-8">Loading agent details...</div>;
  if (!agent) return <div className="min-h-screen bg-[#0a0a0a] text-white p-8">Agent not found.</div>;

  return (
    <PageLayout>
      <PageHeader title={agent.name}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsTestMode(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded transition-colors"
          >
            Test Agent
          </button>
          <Link href={`/agents/create?edit=${agent.id}`}>
            <button className="px-4 py-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] border border-[#444] text-white text-sm font-medium rounded transition-colors">
              Edit Agent
            </button>
          </Link>
          <button className="px-4 py-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] border border-[#444] text-white text-sm font-medium rounded transition-colors">
            Deploy Agent
          </button>
        </div>
      </PageHeader>

      <div className="p-8">
        <Link href="/agents" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Agents
        </Link>
        
        <div className="bg-[#1c1c1c] border border-[#333333] rounded-xl p-6 max-w-4xl">
          <h2 className="text-xl font-semibold text-white mb-4">Configuration Details</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <p className="text-gray-200 capitalize">{agent.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Category</p>
              <p className="text-gray-200">{agent.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Language</p>
              <p className="text-gray-200">{agent.language}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Voice Config</p>
              <p className="text-gray-200">{agent.voice_config?.voice_name || 'Unassigned'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500 mb-1">Primary Goal</p>
              <p className="text-gray-200 bg-[#252525] p-3 rounded">{agent.primary_goal}</p>
            </div>
          </div>
        </div>
      </div>

      {isTestMode && (
        <VoicePlayground agent={agent} onClose={() => setIsTestMode(false)} />
      )}
    </PageLayout>
  );
}
