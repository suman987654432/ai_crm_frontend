import React, { useState } from 'react';
import { UploadCloud, Check, X, ArrowRight, Plus } from 'lucide-react';
import { CustomField, FieldType } from './types';

interface BulkImportModalProps {
  customFields: CustomField[];
  onClose: () => void;
  onAddCustomField: (field: CustomField) => void;
}

type ImportStep = 'upload' | 'mapping' | 'success';

const MOCK_FILE_COLUMNS = ['First Name', 'Last Name', 'Phone Number', 'Company Name', 'Revenue', 'Job Title'];
const STANDARD_FIELDS = [
  { id: 'name', label: 'Name' },
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
  { id: 'company', label: 'Company' },
];

export default function BulkImportModal({ customFields, onClose, onAddCustomField }: BulkImportModalProps) {
  const [step, setStep] = useState<ImportStep>('upload');
  
  // Mapping State: map File Column -> CRM Field ID
  const [mapping, setMapping] = useState<Record<string, string>>({});
  
  // Inline Custom Field Creation State
  const [isCreatingFieldFor, setIsCreatingFieldFor] = useState<string | null>(null); // Stores the file column name
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('Text');

  const handleSimulateUpload = () => {
    // Pre-fill some obvious mappings
    setMapping({
      'First Name': 'name',
      'Phone Number': 'phone',
      'Company Name': 'company'
    });
    setStep('mapping');
  };

  const handleSaveNewField = () => {
    if (!newFieldName.trim() || !isCreatingFieldFor) return;
    
    const newFieldId = `cf_${Date.now()}`;
    
    // 1. Create the new custom field globally
    onAddCustomField({
      id: newFieldId,
      name: newFieldName,
      type: newFieldType,
      required: false,
      showInTable: true,
    });

    // 2. Automatically map this file column to the newly created field (if not global)
    if (isCreatingFieldFor !== '__GLOBAL__') {
      setMapping(prev => ({
        ...prev,
        [isCreatingFieldFor]: newFieldId
      }));
    }

    // 3. Reset inline creation state
    setIsCreatingFieldFor(null);
    setNewFieldName('');
    setNewFieldType('Text');
  };

  const handleImport = () => {
    setStep('success');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1c1c] border border-[#333333] rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333333] shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Bulk Import Contacts</h2>
            <p className="text-sm text-gray-400 mt-1">
              {step === 'upload' && 'Upload a CSV or Excel file'}
              {step === 'mapping' && 'Map your file columns to CRM fields'}
              {step === 'success' && 'Importing contacts...'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white bg-[#252525] border border-[#333333] rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          
          {step === 'upload' && (
            <div 
              onClick={handleSimulateUpload}
              className="border-2 border-dashed border-[#333333] rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-indigo-500 hover:bg-[#252525] transition-all cursor-pointer bg-[#121212] group"
            >
              <div className="h-16 w-16 bg-[#1c1c1c] border border-[#333333] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Click to upload or drag and drop</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Supported formats: CSV, XLS, XLSX. Maximum file size 10MB.
              </p>
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-4">
              
              {/* Toolbar for Mapping Step */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">Match the columns from your file to the CRM fields.</p>
                <button 
                  onClick={() => {
                    setIsCreatingFieldFor('__GLOBAL__');
                    setNewFieldName('');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#252525] border border-[#333333] hover:bg-indigo-600 hover:text-white hover:border-indigo-500 text-gray-300 rounded transition-colors shadow-sm"
                >
                  <Plus className="h-3 w-3" /> Add Custom Field
                </button>
              </div>

              {/* Global Field Creation Form */}
              {isCreatingFieldFor === '__GLOBAL__' && (
                <div className="flex items-end gap-3 p-4 bg-[#252525] border border-[#444444] rounded-lg shadow-sm animate-in slide-in-from-top-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Field Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Lead Score"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#444444] rounded text-sm text-white focus:border-indigo-500 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="w-48">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Field Type</label>
                    <select
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#444444] rounded text-sm text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Text">Text</option>
                      <option value="Number">Number</option>
                      <option value="Currency">Currency</option>
                      <option value="Dropdown">Dropdown</option>
                      <option value="Date">Date</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsCreatingFieldFor(null)}
                      className="px-4 py-2 bg-[#121212] border border-[#444444] hover:bg-[#333333] text-gray-300 text-sm font-medium rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveNewField}
                      disabled={!newFieldName.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded transition-colors"
                    >
                      Save Field
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-[#252525] rounded-t-lg border border-[#333333] text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <div className="col-span-5">File Column</div>
                <div className="col-span-2 text-center"></div>
                <div className="col-span-5">CRM Field</div>
              </div>
              
              <div className="space-y-2 border border-[#333333] rounded-b-lg border-t-0 p-2">
                {MOCK_FILE_COLUMNS.map((fileCol) => (
                  <div key={fileCol} className="grid grid-cols-12 gap-4 items-center px-2 py-3 bg-[#1a1a1a] border border-[#222222] rounded-md">
                    
                    {/* Left: File Column */}
                    <div className="col-span-5">
                      <span className="text-sm font-medium text-gray-200">{fileCol}</span>
                    </div>
                    
                    {/* Center: Arrow */}
                    <div className="col-span-2 flex justify-center text-gray-600">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    
                    {/* Right: CRM Field Mapping */}
                    <div className="col-span-5 relative">
                      {isCreatingFieldFor === fileCol ? (
                        /* INLINE CUSTOM FIELD CREATION */
                        <div className="flex flex-col gap-2 p-3 bg-[#252525] border border-[#444444] rounded-md shadow-lg animate-in fade-in">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-indigo-400">New Custom Field</span>
                            <button onClick={() => setIsCreatingFieldFor(null)} className="text-gray-500 hover:text-white">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <input 
                            type="text"
                            placeholder="Field Name"
                            value={newFieldName}
                            onChange={(e) => setNewFieldName(e.target.value)}
                            className="w-full px-2 py-1.5 bg-[#121212] border border-[#444444] rounded text-sm text-white focus:border-indigo-500 focus:outline-none"
                            autoFocus
                          />
                          <select
                            value={newFieldType}
                            onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                            className="w-full px-2 py-1.5 bg-[#121212] border border-[#444444] rounded text-sm text-white focus:border-indigo-500 focus:outline-none"
                          >
                            <option value="Text">Text</option>
                            <option value="Number">Number</option>
                            <option value="Currency">Currency</option>
                            <option value="Dropdown">Dropdown</option>
                            <option value="Date">Date</option>
                          </select>
                          <button 
                            onClick={handleSaveNewField}
                            disabled={!newFieldName.trim()}
                            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium rounded transition-colors"
                          >
                            Save & Map
                          </button>
                        </div>
                      ) : (
                        /* MAPPING DROPDOWN */
                        <select
                          value={mapping[fileCol] || ""}
                          onChange={(e) => {
                            if (e.target.value === 'CREATE_NEW') {
                              setIsCreatingFieldFor(fileCol);
                              setNewFieldName(fileCol); // Pre-fill with file column name
                              setNewFieldType('Text');
                            } else {
                              setMapping(prev => ({ ...prev, [fileCol]: e.target.value }));
                            }
                          }}
                          className={`w-full px-3 py-2 bg-[#121212] border rounded-md text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer appearance-none ${
                            mapping[fileCol] ? 'border-[#444444] text-white' : 'border-dashed border-gray-600 text-gray-400'
                          }`}
                        >
                          <option value="">-- Ignore this column --</option>
                          <optgroup label="Standard Fields">
                            {STANDARD_FIELDS.map(f => (
                              <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                          </optgroup>
                          {customFields.length > 0 && (
                            <optgroup label="Custom Fields">
                              {customFields.map(cf => (
                                <option key={cf.id} value={cf.id}>{cf.name}</option>
                              ))}
                            </optgroup>
                          )}
                          <optgroup label="Actions">
                            <option value="CREATE_NEW">➕ Create New Custom Field...</option>
                          </optgroup>
                        </select>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95">
              <div className="h-20 w-20 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mb-6">
                <Check className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Import Successful!</h3>
              <p className="text-gray-400 max-w-md">
                Successfully processed 150 contacts. Background jobs are populating the table now.
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {step !== 'success' && (
          <div className="p-6 border-t border-[#333333] flex justify-end gap-3 bg-[#1c1c1c] rounded-b-xl shrink-0">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            {step === 'mapping' && (
              <button 
                onClick={handleImport}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm flex items-center gap-2"
              >
                Import Contacts <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
