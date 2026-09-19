"use client";

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Segment } from '@/components/segments/types';
import SegmentsTable from '@/components/segments/SegmentsTable';
import CreateSegmentModal from '@/components/segments/CreateSegmentModal';
import { INITIAL_SEGMENTS, INITIAL_CONTACTS } from '@/data/dummyData';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';



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
    <PageLayout>

      {/* HEADER */}
      <PageHeader title={
        <>

          <h1 className="text-2xl font-bold text-white">Segments</h1>
        </>
      }>
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
      </PageHeader>

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
          allContacts={INITIAL_CONTACTS}
          onSave={handleSaveSegment}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </PageLayout>
  );
}
