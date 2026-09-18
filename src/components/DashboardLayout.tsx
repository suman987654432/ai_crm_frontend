import React from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#121212] text-gray-200">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="h-full p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
