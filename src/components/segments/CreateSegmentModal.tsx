import React, { useState, useMemo } from 'react';
import { X, Search, Check, Save } from 'lucide-react';
import { Segment } from './types';
import { Contact } from '../contacts/types';

interface CreateSegmentModalProps {
  segment?: Segment | null; // null means create new
  allContacts: Contact[];
  onSave: (segment: Partial<Segment>) => void;
  onClose: () => void;
}

export default function CreateSegmentModal({ segment, allContacts, onSave, onClose }: CreateSegmentModalProps) {
  const [name, setName] = useState(segment?.name || '');
  const [isActive, setIsActive] = useState(segment ? segment.isActive : true);
  
  // Keep track of which contacts are checked
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    new Set(segment?.contactIds || [])
  );
  
  const [contactSearch, setContactSearch] = useState('');

  const filteredContacts = useMemo(() => {
    return allContacts.filter(c => 
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) || 
      c.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.company.toLowerCase().includes(contactSearch.toLowerCase())
    );
  }, [allContacts, contactSearch]);

  const handleToggleContact = (contactId: string) => {
    const next = new Set(selectedContactIds);
    if (next.has(contactId)) {
      next.delete(contactId);
    } else {
      next.add(contactId);
    }
    setSelectedContactIds(next);
  };

  const handleSelectAllFiltered = () => {
    const next = new Set(selectedContactIds);
    const allFilteredSelected = filteredContacts.every(c => next.has(c.id));
    
    if (allFilteredSelected) {
      // deselect them
      filteredContacts.forEach(c => next.delete(c.id));
    } else {
      // select them
      filteredContacts.forEach(c => next.add(c.id));
    }
    setSelectedContactIds(next);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    onSave({
      id: segment?.id,
      name,
      isActive,
      contactIds: Array.from(selectedContactIds),
      usedIn: segment?.usedIn || []
    });
  };

  const isAllFilteredSelected = filteredContacts.length > 0 && filteredContacts.every(c => selectedContactIds.has(c.id));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1c1c] border border-[#333333] rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333333] shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">
              {segment ? 'Edit Segment' : 'Create New Segment'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">Group your contacts for targeted campaigns.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white bg-[#252525] border border-[#333333] rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          
          {/* Segment Details */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300">Segment Name <span className="text-red-400">*</span></label>
              {segment && (
                <span className="text-xs font-mono text-gray-500 bg-[#252525] px-2 py-1 rounded border border-[#333333]">ID: {segment.id.substring(0, 8)}...</span>
              )}
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VIP Customers"
              className="w-full px-4 py-2 bg-[#121212] border border-[#333333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              autoFocus
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-[#121212] border border-[#333333] p-4 rounded-md">
                <div>
                  <div className="text-sm font-medium text-white">Status</div>
                  <div className="text-xs text-gray-500">{isActive ? 'Active & Available' : 'Inactive'}</div>
                </div>
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none transition-colors ${isActive ? 'bg-indigo-600' : 'bg-[#333333]'}`}
                >
                  <span className={`pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-md">
                <div>
                  <div className="text-sm font-medium text-indigo-300">Contacts Selected</div>
                  <div className="text-xs text-indigo-200/60">Enrolled in this segment</div>
                </div>
                <div className="text-2xl font-bold text-indigo-400">{selectedContactIds.size}</div>
              </div>
            </div>
          </div>

          <hr className="border-[#333333]" />

          {/* Contact Selection */}
          <div className="flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white">Select Contacts</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search contacts..."
                  className="w-full pl-9 pr-4 py-1.5 bg-[#121212] border border-[#333333] rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex-1 border border-[#333333] rounded-md overflow-hidden flex flex-col bg-[#121212]">
              {/* Header Row */}
              <div className="flex items-center gap-4 px-4 py-3 bg-[#1a1a1a] border-b border-[#333333] shrink-0">
                <button 
                  onClick={handleSelectAllFiltered}
                  className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${isAllFilteredSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-500 hover:border-gray-400 bg-[#121212]'}`}
                >
                  {isAllFilteredSelected && <Check className="h-3 w-3 text-white stroke-[3]" />}
                </button>
                <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex-1">Name / Email</div>
                <div className="text-xs font-bold text-gray-300 uppercase tracking-wider w-32 hidden sm:block">Company</div>
              </div>
              
              {/* List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-8 text-sm text-gray-500">No contacts found.</div>
                ) : (
                  filteredContacts.map((contact, idx) => {
                    const isSelected = selectedContactIds.has(contact.id);
                    return (
                      <div 
                        key={contact.id}
                        onClick={() => handleToggleContact(contact.id)}
                        className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors border-b border-[#222222] last:border-0 ${isSelected ? 'bg-indigo-500/5 hover:bg-indigo-500/10' : 'bg-[#121212] hover:bg-[#1a1a1a]'}`}
                      >
                        <div className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-600 bg-[#121212]'}`}>
                          {isSelected && <Check className="h-3 w-3 text-white stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-200 truncate">{contact.name}</div>
                          <div className="text-xs text-gray-500 truncate">{contact.email}</div>
                        </div>
                        <div className="w-32 text-xs text-gray-400 truncate hidden sm:block">
                          {contact.company}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#333333] flex justify-end gap-3 bg-[#1c1c1c] rounded-b-xl shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors shadow-sm flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> Save Segment
          </button>
        </div>

      </div>
    </div>
  );
}
