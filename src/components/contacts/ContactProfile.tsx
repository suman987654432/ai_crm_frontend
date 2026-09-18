import React from 'react';
import { PhoneCall, Calendar, Edit2, Trash2, ChevronRight, Plus } from 'lucide-react';
import { Contact, CustomField } from './types';

interface ContactProfileProps {
  contact: Contact | null;
  customFields: CustomField[];
  onClose: () => void;
}

export default function ContactProfile({ contact, customFields, onClose }: ContactProfileProps) {
  if (!contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[800px] h-full bg-[#171717] border-l border-[#333333] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex flex-col border-b border-[#333333] bg-[#1c1c1c]">
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-sm border border-[#333333]">
                {contact.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{contact.name}</h2>
                <p className="text-sm text-gray-400 mt-1">{contact.company}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-white bg-[#252525] border border-[#333333] rounded-md transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="px-6 pb-6 pt-2 flex items-center gap-3">
            <button className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm">
              <PhoneCall className="h-4 w-4" /> Call Now
            </button>
            <button className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-[#252525] hover:bg-[#2d2d2d] border border-[#333333] text-gray-200 text-sm font-medium rounded-md transition-colors">
              <Calendar className="h-4 w-4" /> Schedule
            </button>
            <button className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-[#252525] hover:bg-[#2d2d2d] border border-[#333333] text-gray-200 text-sm font-medium rounded-md transition-colors">
              <Edit2 className="h-4 w-4" /> Edit
            </button>
            <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium rounded-md transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex gap-6">
          
          {/* Left Column: Details */}
          <div className="w-1/2 flex flex-col gap-6">
            
            {/* Contact Info */}
            <div className="bg-[#1c1c1c] border border-[#333333] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm text-gray-200">{contact.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="text-sm text-gray-200">{contact.phone}</p>
                </div>
              </div>
            </div>

            {/* CRM Info */}
            <div className="bg-[#1c1c1c] border border-[#333333] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Dates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Created At</p>
                  <p className="text-sm text-gray-200">{contact.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Updated At</p>
                  <p className="text-sm text-gray-200">{contact.updatedAt}</p>
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            {customFields.length > 0 && (
              <div className="bg-[#1c1c1c] border border-[#333333] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Custom Fields</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {customFields.map(cf => (
                    <div key={cf.id}>
                      <p className="text-xs text-gray-500 mb-1">{cf.name}</p>
                      <p className="text-sm text-gray-200">{contact.customData[cf.id] || '-'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Activity Timeline */}
          <div className="w-1/2 flex flex-col gap-6">
            <div className="bg-[#1c1c1c] border border-[#333333] rounded-xl p-5 flex-1">
              <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Activity Timeline</h3>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#333333] before:to-transparent">
                
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-[#333333] bg-[#252525] group-[.is-active]:text-indigo-400 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <PhoneCall className="h-3 w-3" />
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg border border-[#333333] bg-[#121212] shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-200">Outbound Call</span>
                      <span className="text-[10px] text-gray-500">2 hrs ago</span>
                    </div>
                    <p className="text-xs text-gray-400">AI Agent "Sales Rep" completed a 4m 20s call. Lead qualified.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-[#333333] bg-[#252525] text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <Plus className="h-3 w-3" />
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg border border-transparent">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-400">Contact Created</span>
                      <span className="text-[10px] text-gray-500">{contact.createdAt}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
