import React, { useMemo, useState } from 'react';
import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Contact, CustomField } from './types';
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

interface ContactsTableProps {
  contacts: Contact[];
  customFields: CustomField[];
  globalFilter: string;
  onRowClick: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export default function ContactsTable({
  contacts,
  customFields,
  globalFilter,
  onRowClick,
  onEdit,
  onDelete
}: ContactsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<Contact>();

  const columns = useMemo(() => {
    // 1. Sticky Name Column
    const baseColumns = [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => <span className="font-mono text-xs text-gray-500">{info.getValue().substring(0, 8)}</span>,
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => <span className="font-medium text-white">{info.getValue()}</span>,
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('company', {
        header: 'Company',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Updated At',
        cell: info => info.getValue(),
      }),
    ];

    // 2. Dynamic Custom Field Columns
    const dynamicColumns = customFields
      .filter(cf => cf.showInTable)
      .map(cf => 
        columnHelper.accessor(row => row.customData[cf.id] || '-', {
          id: cf.id,
          header: cf.name,
          cell: info => info.getValue(),
        })
      );

    // 3. Sticky Actions Column
    const actionsColumn = columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(row.original); }}
            className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-[#333333] rounded transition-colors" 
            title="Edit Contact"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(row.original); }}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#333333] rounded transition-colors" 
            title="Delete Contact"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    });

    return [...baseColumns, ...dynamicColumns, actionsColumn];
  }, [customFields, onEdit, onDelete]);

  const table = useReactTable({
    data: contacts,
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
      pagination: {
        pageSize: 10,
      },
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
                  if (isFirst) {
                    cellClasses += " sticky left-0 z-30 shadow-[1px_0_0_0_#333333]";
                  }
                  if (isLast) {
                    cellClasses = "px-4 py-4 border-b border-[#333333] bg-[#1c1c1c] sticky right-0 z-30 shadow-[-1px_0_0_0_#333333] text-center";
                  }

                  // Handle Custom Field Header Styling
                  if (!isFirst && !isLast && header.id.startsWith('cf_')) {
                    cellClasses += " text-indigo-300/80";
                  }

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
          <tbody className="divide-y divide-[#222222]">
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id} 
                className="hover:bg-[#1a1a1a] transition-colors group"
              >
                {row.getVisibleCells().map((cell, index) => {
                  const isFirst = index === 0;
                  const isLast = index === row.getVisibleCells().length - 1;
                  
                  let cellClasses = "px-6 py-4 text-sm text-gray-400";
                  if (isFirst) {
                    cellClasses = "px-6 py-4 sticky left-0 bg-[#121212] group-hover:bg-[#1a1a1a] z-10 shadow-[1px_0_0_0_#222222] transition-colors hover:text-indigo-400";
                  }
                  if (isLast) {
                    cellClasses = "px-4 py-4 text-center sticky right-0 bg-[#121212] group-hover:bg-[#1a1a1a] z-10 shadow-[-1px_0_0_0_#222222] transition-colors cursor-default";
                  }

                  return (
                    <td key={cell.id} className={cellClasses} onClick={(e) => isLast && e.stopPropagation()}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
            
            {/* Empty State / Padding */}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-gray-500 bg-[#121212]">
                  No contacts found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Fixed Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#121212] border-t border-[#333333] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            Page <span className="font-medium text-gray-200">{table.getState().pagination.pageIndex + 1}</span> of{' '}
            <span className="font-medium text-gray-200">{table.getPageCount()}</span>
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
            className="ml-4 bg-[#121212] border border-[#333333] rounded px-2 py-1 text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
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
