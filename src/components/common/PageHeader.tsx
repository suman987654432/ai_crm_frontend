import React from 'react';

interface PageHeaderProps {
  title: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between px-8 border-b border-[#333333] bg-[#1c1c1c] shrink-0">
      <div className="flex items-center gap-3">
        {typeof title === 'string' ? (
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        ) : (
          title
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
