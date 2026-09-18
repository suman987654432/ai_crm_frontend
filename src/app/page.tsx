import React from 'react';
import { Activity, Users, DollarSign, TrendingUp, PhoneCall, Bot, BrainCircuit, Megaphone, BarChart2 } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard Overview</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">Last updated: Just now</span>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat Card 1 */}
        <div className="rounded-xl border border-[#333333] bg-[#1c1c1c] p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Active Contacts</h3>
            <Users className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-white">14,231</div>
          <p className="text-xs text-green-500 mt-1 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" /> +20.1% from last month
          </p>
        </div>

        {/* Stat Card 2 */}
        <div className="rounded-xl border border-[#333333] bg-[#1c1c1c] p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-400">AI Agent Interactions</h3>
            <Bot className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-white">+573</div>
          <p className="text-xs text-green-500 mt-1 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" /> +180 since yesterday
          </p>
        </div>

        {/* Stat Card 3 */}
        <div className="rounded-xl border border-[#333333] bg-[#1c1c1c] p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-400">Successful Calls</h3>
            <PhoneCall className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-white">12,234</div>
          <p className="text-xs text-green-500 mt-1 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" /> +19% from last month
          </p>
        </div>

        {/* Stat Card 4 */}
        <div className="rounded-xl border border-[#333333] bg-[#1c1c1c] p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-400">System Activity</h3>
            <Activity className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-white">99.9%</div>
          <p className="text-xs text-gray-400 mt-1">
            Optimal operation status
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart Area */}
        <div className="rounded-xl border border-[#333333] bg-[#1c1c1c] p-6 lg:col-span-4 shadow-sm flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Engagement Overview</h2>
              <p className="text-sm text-gray-400">Interaction metrics across all channels</p>
            </div>
            <BrainCircuit className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="flex-1 mt-6 border border-dashed border-[#444444] rounded-lg flex items-center justify-center bg-[#252525]">
            <span className="text-gray-500 text-sm flex items-center flex-col gap-2">
              <BarChart2 className="h-8 w-8 text-[#555555]" />
              Chart visualization placeholder
            </span>
          </div>
        </div>

        {/* Recent Activity Area */}
        <div className="rounded-xl border border-[#333333] bg-[#1c1c1c] p-6 lg:col-span-3 shadow-sm">
          <h2 className="text-lg font-semibold text-white mb-1">Recent AI Activity</h2>
          <p className="text-sm text-gray-400 mb-6">Latest operations executed by your agents.</p>
          
          <div className="space-y-6">
            {[
              { title: "Onboarding Call Sent", time: "2 minutes ago", contact: "John Doe", type: "call" },
              { title: "Follow-up Email Drafted", time: "15 minutes ago", contact: "Sarah Smith", type: "email" },
              { title: "Segment Updated", time: "1 hour ago", contact: "High Value Leads", type: "segment" },
              { title: "Support Ticket Resolved", time: "3 hours ago", contact: "Acme Corp", type: "ticket" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="mt-0.5 rounded-full bg-[#2d2d2d] p-2">
                  {activity.type === 'call' && <PhoneCall className="h-4 w-4 text-blue-400" />}
                  {activity.type === 'email' && <Megaphone className="h-4 w-4 text-green-400" />}
                  {activity.type === 'segment' && <Users className="h-4 w-4 text-purple-400" />}
                  {activity.type === 'ticket' && <Activity className="h-4 w-4 text-orange-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.contact} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
