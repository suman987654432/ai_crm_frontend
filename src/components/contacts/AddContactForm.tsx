import React, { useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { CustomField, FieldType, Contact } from './types';

interface AddContactFormProps {
  customFields: CustomField[];
  onClose: () => void;
  onAddCustomField: (field: CustomField) => void;
  onSaveContact: (contact: Contact) => void;
  initialData?: Contact;
}

export default function AddContactForm({ customFields, onClose, onAddCustomField, onSaveContact, initialData }: AddContactFormProps) {
  // Field Creation State
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('Text');

  // Contact Form State
  const [firstName, setFirstName] = useState(initialData ? initialData.name.split(' ')[0] : '');
  const [lastName, setLastName] = useState(initialData ? initialData.name.split(' ').slice(1).join(' ') : '');
  const [email, setEmail] = useState(initialData ? initialData.email : '');
  const [customData, setCustomData] = useState<Record<string, string>>(initialData ? initialData.customData : {});

  const handleSaveField = () => {
    if (!newFieldName.trim()) return;
    onAddCustomField({
      id: `cf_${Date.now()}`,
      name: newFieldName,
      type: newFieldType,
      required: false,
      showInTable: true,
    });
    setNewFieldName('');
    setNewFieldType('Text');
    setIsAddingField(false);
  };

  const handleCustomDataChange = (fieldId: string, value: string) => {
    setCustomData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = () => {
    if (!firstName.trim()) {
      alert("First name is required");
      return;
    }
    
    const newContact: Contact = {
      id: initialData ? initialData.id : `contact_${Date.now()}`,
      name: `${firstName} ${lastName}`.trim(),
      phone: initialData ? initialData.phone : '-',
      email: email || '-',
      company: initialData ? initialData.company : '-',
      createdAt: initialData ? initialData.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      customData: customData
    };
    
    onSaveContact(newContact);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#1c1c1c] border border-[#333333] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#333333] shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Contact' : 'Create New Contact'}</h2>
            <p className="text-sm text-gray-400 mt-1">Add details for this contact to sync with campaigns.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white bg-[#252525] border border-[#333333] rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          
          <h3 className="text-sm font-medium text-white mb-4">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name <span className="text-red-400">*</span></label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-[#121212] border border-[#333333] rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-gray-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-[#121212] border border-[#333333] rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-gray-500" 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] border border-[#333333] rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-gray-500" 
              />
            </div>
          </div>

          <h3 className="text-sm font-medium text-white mb-4 pt-4 border-t border-[#333333]">Custom Fields</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {customFields.map(cf => (
              <div key={cf.id} className={cf.type === 'Text' ? 'col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-300 mb-1">{cf.name} {cf.required && <span className="text-red-400">*</span>}</label>
                {cf.type === 'Dropdown' ? (
                  <div className="relative">
                    <select 
                      value={customData[cf.id] || ''}
                      onChange={(e) => handleCustomDataChange(cf.id, e.target.value)}
                      className="w-full bg-[#121212] border border-[#333333] rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                    >
                      <option value="">Select...</option>
                      {cf.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
                  </div>
                ) : (
                  <input 
                    type="text" 
                    value={customData[cf.id] || ''}
                    onChange={(e) => handleCustomDataChange(cf.id, e.target.value)}
                    placeholder={`Enter ${cf.name.toLowerCase()}`} 
                    className="w-full bg-[#121212] border border-[#333333] rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-gray-500" 
                  />
                )}
              </div>
            ))}
            {customFields.length === 0 && (
              <div className="col-span-2 text-sm text-gray-500 italic mb-2">No custom fields created yet.</div>
            )}
          </div>

          {/* Inline Add Custom Field UI */}
          {!isAddingField ? (
            <button 
              onClick={() => setIsAddingField(true)}
              className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Custom Field
            </button>
          ) : (
            <div className="mt-4 p-4 border border-[#333333] rounded-lg bg-[#252525]">
              <h4 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">New Custom Field</h4>
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Field Name (e.g. LinkedIn)" 
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    className="w-full bg-[#121212] border border-[#333333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="w-1/3 relative">
                  <select 
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                    className="w-full bg-[#121212] border border-[#333333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="Text">Text</option>
                    <option value="Number">Number</option>
                    <option value="Currency">Currency</option>
                    <option value="Date">Date</option>
                    <option value="Dropdown">Dropdown</option>
                    <option value="URL">URL</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsAddingField(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveField}
                  disabled={!newFieldName.trim()}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded transition-colors"
                >
                  Save Field
                </button>
              </div>
            </div>
          )}

        </div>
        
        <div className="p-6 border-t border-[#333333] flex justify-end gap-3 bg-[#1c1c1c] rounded-b-xl shrink-0">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
          >
            Save Contact
          </button>
        </div>
      </div>
    </div>
  );
}
