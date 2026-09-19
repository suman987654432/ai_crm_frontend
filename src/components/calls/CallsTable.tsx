"use client";

import React, { useMemo, useState } from 'react';
import { 
  ArrowUpDown, ArrowUp, ArrowDown, 
  FileText, Play, Trash2, Phone, Mic, MoreVertical, 
  CheckCircle2, AlertCircle, PhoneOff, PauseCircle 
} from 'lucide-react';
import { Call, CallStatus } from './types';
import { CopyableId } from '@/components/common/CopyableId';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';

interface CallsTableProps {
  calls: Call[];
  globalFilter: string;
  onViewTranscript: (call: Call) => void;
  onViewDetails: (call: Call) => void;
  onDelete: (call: Call) => void;
}

const getStatusBadge = (status: CallStatus) => {
  switch (status) {
    case 'Completed':
      return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: CheckCircle2 };
    case 'Failed':
      return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: AlertCircle };
    case 'Missed':
      return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', icon: PhoneOff };
    case 'Ongoing':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: Phone };
    case 'Voicemail':
      return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: Mic };
    default:
      return { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', icon: PauseCircle };
  }
};

export default function CallsTable({
  calls,
  globalFilter,
  onViewTranscript,
  onViewDetails,
  onDelete
}: CallsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const columnHelper = createColumnHelper<Call>();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => <CopyableId id={info.getValue()} displayId={`${info.getValue().substring(0, 8)}...`} />,
      }),
      columnHelper.accessor('contactName', {
        header: 'Contact Name',
        cell: info => <span className="font-medium text-white">{info.getValue()}</span>,
      }),
      columnHelper.accessor('phoneNumber', {
        header: 'Phone Number',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('agentName', {
        header: 'AI Agent',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('campaignName', {
        header: 'Campaign',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('callDateTime', {
        header: 'Date & Time',
        cell: info => new Date(info.getValue()).toLocaleString('en-US', { 
          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
        }),
      }),
      columnHelper.accessor('duration', {
        header: 'Duration',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          const badge = getStatusBadge(status);
          const Icon = badge.icon;
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}>
              <Icon className="h-3 w-3" />
              {status}
            </span>
          );
        },
      }),
      columnHelper.accessor('transcript', {
        header: 'Transcript',
        cell: ({ row }) => row.original.transcript ? (
          <button 
            onClick={(e) => { e.stopPropagation(); onViewTranscript(row.original); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#252525] border border-[#3d3d3d] text-gray-300 hover:text-white hover:bg-[#2d2d2d] rounded-md transition-colors"
          >
            <FileText className="h-4 w-4" /> Transcript
          </button>
        ) : <span className="text-gray-600">-</span>,
      }),
      columnHelper.accessor('recordingUrl', {
        header: 'Recording',
        cell: ({ row }) => {
          const isPlaying = playingId === row.original.id;
          return row.original.recordingUrl ? (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setPlayingId(isPlaying ? null : row.original.id);
                // Real implementation would use an <audio> ref
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                isPlaying 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-[#252525] text-gray-300 border-[#3d3d3d] hover:bg-[#2d2d2d]'
              }`}
            >
              {isPlaying ? <PauseCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Playing...' : 'Play'}
            </button>
          ) : <span className="text-gray-600">-</span>;
        }
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(row.original); }}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#333333] rounded transition-colors" 
              title="Delete Call Record"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      }),
    ];
  }, [onViewTranscript, onViewDetails, onDelete, playingId]);

  const table = useReactTable({
    data: calls,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
      sorting: [{ id: 'callDateTime', desc: true }]
    },
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#121212]">
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
          <thead className="bg-[#1c1c1c] text-sm font-bold tracking-wider text-gray-300 uppercase sticky top-0 z-20 shadow-sm">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const isFirst = index === 0;
                  const isLast = index === headerGroup.headers.length - 1;
                  
                  let cellClasses = "px-6 py-4 border-b border-[#333333] bg-[#1c1c1c]";
                  if (isFirst) cellClasses += " sticky left-0 z-30 shadow-[1px_0_0_0_#333333]";
                  if (isLast) cellClasses = "px-4 py-4 border-b border-[#333333] bg-[#1c1c1c] sticky right-0 z-30 shadow-[-1px_0_0_0_#333333] text-center";

                  return (
                    <th key={header.id} className={cellClasses}>
                      {header.isPlaceholder ? null : (
                        <div 
                          className={`flex items-center ${isLast ? 'justify-center' : 'justify-start'} gap-2 ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-300 transition-colors' : ''}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && !isLast && (
                            <span className="w-5 h-5 flex items-center justify-center">
                              {{
                                asc: <ArrowUp className="h-4 w-4 stroke-[3] text-indigo-400" />,
                                desc: <ArrowDown className="h-4 w-4 stroke-[3] text-indigo-400" />,
                              }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4 stroke-[2.5] opacity-30 group-hover:opacity-100" />}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-[#1a1a1a] transition-colors group cursor-pointer border-b border-[#222222] last:border-b-0" onClick={() => onViewDetails(row.original)}>
                {row.getVisibleCells().map((cell, index) => {
                  const isFirst = index === 0;
                  const isLast = index === row.getVisibleCells().length - 1;
                  
                  let cellClasses = "px-6 py-4 text-sm text-gray-400";
                  if (isFirst) cellClasses = "px-6 py-4 sticky left-0 bg-[#121212] group-hover:bg-[#1a1a1a] z-10 shadow-[1px_0_0_0_#222222] transition-colors hover:text-indigo-400";
                  if (isLast) cellClasses = "px-4 py-4 text-center sticky right-0 bg-[#121212] group-hover:bg-[#1a1a1a] z-10 shadow-[-1px_0_0_0_#222222] transition-colors cursor-default";

                  return (
                    <td key={cell.id} className={cellClasses} onClick={(e) => isLast && e.stopPropagation()}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
            
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-gray-500 bg-[#121212]">
                  No calls found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Pagination */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#121212] border-t border-[#333333] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            Page <span className="font-medium text-gray-200">{table.getState().pagination.pageIndex + 1}</span> of{' '}
            <span className="font-medium text-gray-200">{table.getPageCount()}</span>
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="ml-4 bg-[#121212] border border-[#333333] rounded px-2 py-1 text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>Show {pageSize}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 border border-[#333333] bg-[#252525] hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm font-medium text-gray-300 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 border border-[#333333] bg-[#252525] hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm font-medium text-gray-300 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
