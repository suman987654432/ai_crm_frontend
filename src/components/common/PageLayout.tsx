import React from 'react';

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-[calc(100vh)] -m-8 bg-[#121212]">
      {children}
    </div>
  );
}
