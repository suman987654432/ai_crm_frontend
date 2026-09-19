"use client";

import React from 'react';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';

export default function WorkflowsPage() {
  return (
    <PageLayout>
      <PageHeader title="Workflows" />
      <div className="p-8 flex flex-col items-center justify-center space-y-6 overflow-y-auto flex-1">
      <div className="bg-[#1c1c1c] border border-[#333333] rounded-2xl p-10 sm:p-12 max-w-xl w-full text-center shadow-sm relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="h-16 w-16 bg-[#252525] border border-[#333333] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Zap className="h-8 w-8 text-indigo-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Clock className="h-3.5 w-3.5" />
            Coming Soon
          </div>

          <h1 className="text-2xl font-semibold text-white mb-3">Automation Workflows</h1>

          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
            We're building a powerful visual workflow engine. Soon, you'll be able to connect your AI agents to external CRMs, trigger custom webhooks, and automate your entire customer operations pipeline.
          </p>


        </div>
      </div>
      </div>
    </PageLayout>
  );
}
