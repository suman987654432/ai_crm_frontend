"use client";

import React, { useState } from 'react';
import { Plus, Search, PieChart } from 'lucide-react';
import { Segment } from '@/components/segments/types';
import SegmentsTable from '@/components/segments/SegmentsTable';
import CreateSegmentModal from '@/components/segments/CreateSegmentModal';

// Using dummy contacts to populate the modal checklist
const DUMMY_CONTACTS = [
  { id: 'c9a2f3b1-4d5e-6f7a-8b9c-0d1e2f3a4b5c', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', company: 'TechCorp India', createdAt: '2023-09-15', updatedAt: '2023-10-25', customData: {} },
  { id: 'f8e7d6c5-b4a3-9f8e-7d6c-5b4a39f8e7d6', name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 87654 32109', company: 'Innovate Solutions', createdAt: '2023-10-24', updatedAt: '2023-10-24', customData: {} },
  { id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', name: 'Amit Kumar', email: 'amit.k@startup.in', phone: '+91 99887 76655', company: 'BuildFast', createdAt: '2023-08-10', updatedAt: '2023-10-20', customData: {} },
  { id: 'd6c5b4a3-9f8e-7d6c-5b4a-39f8e7d6c5b4', name: 'Neha Gupta', email: 'neha.g@globalenterprises.com', phone: '+91 77665 54433', company: 'Global Enterprises', createdAt: '2023-09-01', updatedAt: '2023-10-15', customData: {} },
  { id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', name: 'Vikram Singh', email: 'vikram.s@logistics.net', phone: '+91 88776 65544', company: 'FastTrack Logistics', createdAt: '2023-10-05', updatedAt: '2023-10-26', customData: {} },
  { id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', name: 'Sneha Desai', email: 'sneha.d@retailgiant.com', phone: '+91 99001 12233', company: 'RetailGiant', createdAt: '2023-07-20', updatedAt: '2023-09-30', customData: {} },
];

const INITIAL_SEGMENTS: Segment[] = [
  {
    id: 's-9f8e7d6c-5b4a-39f8-e7d6-c5b4a39f8e7d',
    name: 'VIP Customers',
    contactIds: ['c9a2f3b1-4d5e-6f7a-8b9c-0d1e2f3a4b5c', 'f8e7d6c5-b4a3-9f8e-7d6c-5b4a39f8e7d6', 'd6c5b4a3-9f8e-7d6c-5b4a-39f8e7d6c5b4'],
    usedIn: ['Diwali Promo', 'Q4 Newsletter'],
    isActive: true,
    createdAt: '2023-10-01',
    updatedAt: '2023-10-20',
  },
  {
    id: 's-1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    name: 'Cold Leads',
    contactIds: ['1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a'],
    usedIn: ['Re-engagement Campaign'],
    isActive: true,
    createdAt: '2023-09-15',
    updatedAt: '2023-10-25',
  },
  {
    id: 's-7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
    name: 'Startups India',
    contactIds: ['1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'],
    usedIn: [],
    isActive: false,
    createdAt: '2023-10-10',
    updatedAt: '2023-10-15',
  }
];

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>(INITIAL_SEGMENTS);
  const [globalFilter, setGlobalFilter] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [segmentToEdit, setSegmentToEdit] = useState<Segment | null>(null);

  const handleToggleStatus = (segment: Segment) => {
    setSegments(prev => prev.map(s => 
      s.id === segment.id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const handleDelete = (segment: Segment) => {
    if (confirm(`Are you sure you want to delete the segment "${segment.name}"?`)) {
      setSegments(prev => prev.filter(s => s.id !== segment.id));
    }
  };

  const handleEdit = (segment: Segment) => {
    setSegmentToEdit(segment);
    setIsModalOpen(true);
  };

  const handleSaveSegment = (segmentData: Partial<Segment>) => {
    if (segmentData.id) {
      // Edit existing
      setSegments(prev => prev.map(s => 
        s.id === segmentData.id ? { ...s, ...segmentData, updatedAt: new Date().toISOString().split('T')[0] } : s
      ));
    } else {
      // Create new
      const newSegment: Segment = {
        id: `s_${Date.now()}`,
        name: segmentData.name || '',
        contactIds: segmentData.contactIds || [],
        usedIn: [],
        isActive: segmentData.isActive ?? true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setSegments([newSegment, ...segments]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh)] -m-8 bg-[#121212]">
      
      {/* HEADER */}
      <div className="flex h-16 items-center justify-between px-8 border-b border-[#333333] bg-[#1c1c1c] shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-md border border-indigo-500/20">
            <PieChart className="h-5 w-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Segments</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search segments..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#121212] border border-[#333333] rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => {
              setSegmentToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Create Segment
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <SegmentsTable 
        segments={segments}
        globalFilter={globalFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* MODAL */}
      {isModalOpen && (
        <CreateSegmentModal 
          segment={segmentToEdit}
          allContacts={DUMMY_CONTACTS}
          onSave={handleSaveSegment}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  );
}
