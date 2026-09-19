"use client";

import React, { useState } from 'react';
import { Users, Megaphone, PhoneCall, RefreshCw, Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const callActivityData = [
  { name: 'Mon', calls: 150 },
  { name: 'Tue', calls: 230 },
  { name: 'Wed', calls: 180 },
  { name: 'Thu', calls: 320 },
  { name: 'Fri', calls: 290 },
  { name: 'Sat', calls: 110 },
  { name: 'Sun', calls: 90 },
];

const outcomesData = [
  { name: 'Interested', value: 35, color: '#10b981' }, // Emerald 500
  { name: 'Callback', value: 20, color: '#3b82f6' }, // Blue 500
  { name: 'Not Interested', value: 15, color: '#6366f1' }, // Indigo 500
  { name: 'No Answer', value: 20, color: '#f59e0b' }, // Amber 500
  { name: 'Failed', value: 10, color: '#ef4444' }, // Red 500
];

export default function Dashboard() {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="flex flex-col space-y-8 pb-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard Overview</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">Last updated: Just now</span>
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* 1. Top Stats Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#333333] bg-[#1c1c1c] p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-400">Contacts</h3>
            <Users className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-white">14,231</div>
        </div>

        <div className="rounded-xl border border-[#333333] bg-[#1c1c1c] p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-400">Campaigns</h3>
            <Megaphone className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-white">12</div>
        </div>

        <div className="rounded-xl border border-[#333333] bg-[#1c1c1c] p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-400">Calls Today</h3>
            <PhoneCall className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-white">573</div>
        </div>

        <div className="rounded-xl border border-[#333333] bg-[#1c1c1c] p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-400">Follow-ups</h3>
            <RefreshCw className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-white">126</div>
        </div>
      </div>

      {/* 2 & 3. Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3 mt-4">
        
        {/* Line Chart */}
        <div className="rounded-xl border border-[#333333] bg-[#1c1c1c] p-6 shadow-sm lg:col-span-2 flex flex-col h-[480px]">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Total Calls
                </p>
                <p className="text-xl font-bold text-white mt-0.5">1,370</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Completed Calls
                </p>
                <p className="text-xl font-bold text-white mt-0.5">1,124</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex items-center gap-1.5">
                {/* From Date */}
                <button 
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="flex items-center gap-1.5 px-2 py-1 bg-[#252525] border border-[#3d3d3d] rounded text-xs text-gray-300 hover:bg-[#2d2d2d] transition-colors shadow-sm"
                >
                  <span className="text-[10px] text-gray-500 font-medium">FROM</span>
                  <div className="h-3 w-[1px] bg-[#444]"></div>
                  <Calendar className="h-3 w-3 text-indigo-400" />
                  <span>Sep 13</span>
                </button>
                
                <span className="text-gray-500 text-xs">-</span>
                
                {/* To Date */}
                <button 
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="flex items-center gap-1.5 px-2 py-1 bg-[#252525] border border-[#3d3d3d] rounded text-xs text-gray-300 hover:bg-[#2d2d2d] transition-colors shadow-sm"
                >
                  <span className="text-[10px] text-gray-500 font-medium">TO</span>
                  <div className="h-3 w-[1px] bg-[#444]"></div>
                  <Calendar className="h-3 w-3 text-indigo-400" />
                  <span>Sep 20</span>
                </button>
              </div>

              {/* Calendar Popup Mockup */}
              {showCalendar && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#1c1c1c] border border-[#333333] rounded-lg shadow-xl z-50 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <button className="p-1 hover:bg-[#2d2d2d] rounded"><ChevronLeft className="h-4 w-4 text-gray-400" /></button>
                    <span className="text-sm font-medium text-white">September 2026</span>
                    <button className="p-1 hover:bg-[#2d2d2d] rounded"><ChevronRight className="h-4 w-4 text-gray-400" /></button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                      <div key={d} className="text-[10px] font-medium text-gray-500">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {/* Empty days */}
                    <div className="p-1 text-transparent">0</div>
                    <div className="p-1 text-transparent">0</div>
                    {/* Days */}
                    {Array.from({length: 30}).map((_, i) => {
                      const day = i + 1;
                      const isSelected = day >= 13 && day <= 20;
                      const isEdge = day === 13 || day === 20;
                      return (
                        <div 
                          key={day} 
                          className={`p-1.5 rounded-full cursor-pointer ${
                            isEdge ? 'bg-indigo-600 text-white font-bold' : 
                            isSelected ? 'bg-indigo-500/20 text-indigo-300' : 
                            'text-gray-300 hover:bg-[#2d2d2d]'
                          }`}
                        >
                          {day}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#333333] flex justify-end">
                    <button 
                      onClick={() => setShowCalendar(false)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={callActivityData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                <XAxis dataKey="name" stroke="#666666" tick={{fill: '#888888'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#666666" tick={{fill: '#888888'}} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1c1c', borderColor: '#333333', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="calls" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1c1c1c', stroke: '#4f46e5', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#4f46e5', stroke: '#1c1c1c', strokeWidth: 2 }}
                  name="Calls"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="rounded-xl border border-[#333333] bg-[#1c1c1c] p-6 shadow-sm lg:col-span-1 flex flex-col h-[480px]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-semibold text-white">Call Outcomes</h2>
            </div>
          </div>
          
          <div className="flex-1 w-full h-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomesData}
                  cx="50%"
                  cy="45%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {outcomesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1c1c', borderColor: '#333333', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text for Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-3xl font-bold text-white">100%</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
