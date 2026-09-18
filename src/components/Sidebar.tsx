"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  PieChart,
  Bot,
  Megaphone,
  PhoneCall,
  Zap,
  Calendar,
  CheckSquare,
  BarChart2,
  Plug,
  Settings,
  CreditCard,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronsUpDown,
} from 'lucide-react';

const mainNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'AI Agents', href: '/agents', icon: Bot },
  { name: 'Workflows', href: '/workflows', icon: Zap },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Segments', href: '/segments', icon: PieChart },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Calls', href: '/calls', icon: PhoneCall },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Integrations', href: '/integrations', icon: Plug },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'User Profile', href: '/profile', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(false);

  return (
    <div className={`relative flex h-full flex-col bg-[#1c1c1c] border-r border-[#333333] text-gray-300 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>

      {/* Sidebar Header */}
      <div className={`flex h-16 shrink-0 items-center border-b border-[#333333] ${isCollapsed ? 'justify-center' : 'px-4 justify-between'}`}>
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-sm">
                AI
              </div>
              <span className="text-sm font-semibold tracking-wide text-gray-100 transition-opacity duration-300">
                AI Customer Ops
              </span>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-gray-400 hover:text-white hover:bg-[#2d2d2d] p-1.5 rounded-md transition-colors focus:outline-none"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2d2d2d] border border-[#444444] text-gray-300 hover:text-white hover:bg-[#3d3d3d] transition-colors focus:outline-none"
            title="Expand Sidebar"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-6 space-y-8 custom-scrollbar">
        <nav className="flex flex-col space-y-1">
          {mainNavigation.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                  ? 'bg-[#2d2d2d] text-white'
                  : 'text-gray-400 hover:bg-[#2d2d2d] hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <item.icon
                  className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`}
                  aria-hidden="true"
                />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="mt-auto border-t border-[#333333] p-3 relative">
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isBottomMenuOpen && !isCollapsed ? 'max-h-64 opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'}`}>
          <div className="rounded-lg  p-2  space-y-1">
            {bottomNavigation.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                    ? 'bg-[#333333] text-white'
                    : 'text-gray-400 hover:bg-[#333333] hover:text-white'
                    }`}
                >
                  <item.icon
                    className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            if (isCollapsed) {
              setIsCollapsed(false);
              setIsBottomMenuOpen(true);
            } else {
              setIsBottomMenuOpen(!isBottomMenuOpen);
            }
          }}
          title={isCollapsed ? "Profile Menu" : undefined}
          className={`w-full flex items-center rounded-md px-3 py-2 text-sm transition-colors text-gray-400 hover:bg-[#2d2d2d] hover:text-white ${isCollapsed ? 'justify-center' : 'justify-between'}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-medium shrink-0 shadow-sm">
              SK
            </div>
            {!isCollapsed && (
              <div className="flex flex-col items-start">
                <span className="font-medium text-gray-200 text-sm">Suman Kumar</span>
                <span className="text-xs text-gray-500">Admin</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <ChevronsUpDown className="h-4 w-4 text-gray-500 shrink-0" />
          )}
        </button>
      </div>
    </div>
  );
}
