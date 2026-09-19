"use client";

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyableIdProps {
  id: string;
  displayId?: string;
  className?: string;
}

export function CopyableId({ id, displayId, className = '' }: CopyableIdProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-center gap-1.5 text-xs text-gray-500 font-mono ${className}`}>
      <span>{displayId || id}</span>
      <button 
        onClick={handleCopy}
        className="relative h-6 w-12 flex items-center justify-center hover:bg-[#333333] rounded transition-colors"
        title="Copy ID"
      >
        {copied ? (
          <span className="absolute text-[10px] font-bold text-emerald-400 leading-none">Copied</span>
        ) : (
          <Copy className="absolute h-3 w-3 text-gray-400 hover:text-gray-200" />
        )}
      </button>
    </div>
  );
}
