"use client";

import React from 'react';
import { X, FileText } from 'lucide-react';
import { Call } from './types';

interface TranscriptModalProps {
  call: Call | null;
  onClose: () => void;
}

export default function TranscriptModal({ call, onClose }: TranscriptModalProps) {
  if (!call) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-[#1c1c1c] border border-[#333333] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#333333]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <FileText className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Call Transcript</h2>
              <p className="text-sm text-gray-400">
                {call.contactName} • {new Date(call.callDateTime).toLocaleString()}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#333333] rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 bg-[#121212] max-h-[60vh] overflow-y-auto custom-scrollbar">
          {call.transcript ? (
            <div className="space-y-4">
              {call.transcript.split('\n').map((line, idx) => {
                const isAgent = line.startsWith('Agent:');
                const isUser = line.startsWith('User:');
                
                if (isAgent || isUser) {
                  const text = line.replace(/^(Agent:|User:)/, '').trim();
                  return (
                    <div key={idx} className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 px-1">
                        {isAgent ? call.agentName : call.contactName}
                      </span>
                      <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm ${
                        isAgent 
                          ? 'bg-[#1c1c1c] border border-[#333333] text-gray-300 rounded-tl-sm' 
                          : 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
                      }`}>
                        {text}
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div key={idx} className="text-center text-xs text-gray-500 italic my-4">
                    {line}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No transcript available for this call.
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-[#333333] flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-[#252525] border border-[#3d3d3d] rounded-md text-sm font-medium text-gray-200 hover:bg-[#2d2d2d] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
