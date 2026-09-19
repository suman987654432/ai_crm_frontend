import React from 'react';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'Coming soon' }: EmptyStateProps) {
  return (
    <div className="p-8 flex flex-col space-y-6 overflow-y-auto flex-1">
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-[#333333] rounded-xl">
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
}
