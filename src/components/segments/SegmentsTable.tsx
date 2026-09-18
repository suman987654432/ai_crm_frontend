import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { Edit2, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Segment } from './types';

interface SegmentsTableProps {
  segments: Segment[];
  onEdit: (segment: Segment) => void;
  onDelete: (segment: Segment) => void;
  onToggleStatus: (segment: Segment) => void;
  globalFilter: string;
}

const columnHelper = createColumnHelper<Segment>();

export default function SegmentsTable({ segments, onEdit, onDelete, onToggleStatus, globalFilter }: SegmentsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo(() => [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: info => <span className="font-mono text-xs text-gray-500">{info.getValue().substring(0, 8)}</span>,
    }),
    columnHelper.accessor('name', {
      header: 'Segment Name',
      cell: info => (
        <span className="font-medium text-white">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('contactIds', {
      id: 'contactCount',
      header: 'Contacts',
      cell: info => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {info.getValue().length} Contacts
        </span>
      ),
      sortingFn: (rowA, rowB) => {
        return rowA.original.contactIds.length - rowB.original.contactIds.length;
      }
    }),
    columnHelper.accessor('usedIn', {
      header: 'Used In',
      cell: info => {
        const campaigns = info.getValue();
        if (campaigns.length === 0) return <span className="text-gray-500 text-xs italic">-</span>;
        return (
          <div className="flex flex-wrap gap-1.5">
            {campaigns.map(c => (
              <span key={c} className="px-2 py-0.5 text-xs bg-[#252525] border border-[#333333] rounded text-gray-300">
                {c}
              </span>
            ))}
          </div>
        );
      },
      enableSorting: false,
    }),
    columnHelper.accessor('isActive', {
      header: 'Status',
      cell: info => {
        const isActive = info.getValue();
        const segment = info.row.original;
        return (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(segment);
            }}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-[#121212] transition-colors ${isActive ? 'bg-indigo-600' : 'bg-[#333333]'}`}
            role="switch"
            aria-checked={isActive}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute left-0 inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-4' : 'translate-x-0.5'}`}
            />
          </button>
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: info => <span className="text-gray-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Last Updated',
      cell: info => <span className="text-gray-400">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: info => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(info.row.original);
            }}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333333] rounded transition-colors"
            title="Edit Segment"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(info.row.original);
            }}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#333333] rounded transition-colors"
            title="Delete Segment"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    })
  ], [onEdit, onDelete, onToggleStatus]);

  const table = useReactTable({
    data: segments,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Simple global filter that checks name or description
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const name = (row.getValue('name') as string).toLowerCase();
      return name.includes(search);
    }
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#121212]">
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
          <thead className="bg-[#1c1c1c] text-sm font-bold tracking-wider text-gray-300 uppercase sticky top-0 z-20 shadow-sm">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const isLast = index === headerGroup.headers.length - 1;
                  return (
                    <th 
                      key={header.id} 
                      className={`px-6 py-4 border-b border-[#333333] ${isLast ? 'sticky right-0 bg-[#1c1c1c] shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)]' : ''}`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-2 ${header.column.getCanSort() ? 'cursor-pointer select-none group' : ''} ${isLast ? 'justify-end' : ''}`}
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
          <tbody className="text-sm text-gray-300">
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id} 
                className="border-b border-[#222222] hover:bg-[#1a1a1a] transition-colors group"
              >
                {row.getVisibleCells().map((cell, index) => {
                  const isLast = index === row.getVisibleCells().length - 1;
                  return (
                    <td 
                      key={cell.id} 
                      className={`px-6 py-4 ${isLast ? 'sticky right-0 bg-[#121212] group-hover:bg-[#1a1a1a] transition-colors shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)]' : ''}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  No segments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FIXED PAGINATION */}
      <div className="px-6 py-4 border-t border-[#333333] bg-[#121212] shrink-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>
              Page <span className="font-medium text-white">{table.getState().pagination.pageIndex + 1}</span> of{' '}
              <span className="font-medium text-white">{table.getPageCount() || 1}</span>
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
              className="bg-[#252525] border border-[#333333] rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-[#252525] border border-[#333333] text-gray-300 hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-[#252525] border border-[#333333] text-gray-300 hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
