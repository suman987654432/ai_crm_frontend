import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SuccessState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-500">
      <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
        <CheckCircle2 className="h-10 w-10 text-green-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2">Campaign Created Successfully</h2>
      <p className="text-gray-400 mb-10 max-w-sm">
        Your campaign has been scheduled and your AI Agent will begin making calls during the specified window.
      </p>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/campaigns')}
          className="px-6 py-2.5 bg-[#252525] border border-[#333333] hover:bg-[#333333] text-white rounded-lg font-medium transition-colors"
        >
          View Campaigns
        </button>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
          Done
        </button>
      </div>
    </div>
  );
}
