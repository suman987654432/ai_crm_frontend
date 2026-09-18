"use client";

import React, { useState } from 'react';
import { Search, Filter, Plus, UploadCloud, List } from 'lucide-react';
import { Contact, CustomField } from '@/components/contacts/types';
import ContactsTable from '@/components/contacts/ContactsTable';
import AddContactForm from '@/components/contacts/AddContactForm';
import ContactProfile from '@/components/contacts/ContactProfile';
import BulkImportModal from '@/components/contacts/BulkImportModal';

// --- DUMMY DATA ---
const INITIAL_CUSTOM_FIELDS: CustomField[] = [
  { id: 'cf_1', name: 'Budget', type: 'Currency', required: false, showInTable: true },
  { id: 'cf_2', name: 'Industry', type: 'Dropdown', options: ['Tech', 'Finance', 'Real Estate', 'Healthcare'], required: false, showInTable: true },
];

const INITIAL_CONTACTS: Contact[] = [
  { id: 'c9a2f3b1-4d5e-6f7a-8b9c-0d1e2f3a4b5c', name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul.s@example.com', company: 'TechCorp India', createdAt: '2023-09-15', updatedAt: '2023-10-25', customData: { 'cf_1': '₹ 1.5 Cr', 'cf_2': 'Tech' } },
  { id: 'f8e7d6c5-b4a3-9f8e-7d6c-5b4a39f8e7d6', name: 'Priya Patel', phone: '+91 87654 32109', email: 'priya.p@example.com', company: 'Innovate Solutions', createdAt: '2023-10-24', updatedAt: '2023-10-24', customData: { 'cf_1': '₹ 80 L', 'cf_2': 'Finance' } },
  { id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', name: 'Amit Kumar', phone: '+91 99887 76655', email: 'amit.k@startup.in', company: 'BuildFast', createdAt: '2023-08-10', updatedAt: '2023-10-20', customData: { 'cf_1': '₹ 50 L', 'cf_2': 'Tech' } },
  { id: 'd6c5b4a3-9f8e-7d6c-5b4a-39f8e7d6c5b4', name: 'Neha Gupta', phone: '+91 77665 54433', email: 'neha.g@globalenterprises.com', company: 'Global Enterprises', createdAt: '2023-09-01', updatedAt: '2023-10-15', customData: { 'cf_1': '₹ 3 Cr', 'cf_2': 'Real Estate' } },
  { id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', name: 'Vikram Singh', phone: '+91 88776 65544', email: 'vikram.s@logistics.net', company: 'FastTrack Logistics', createdAt: '2023-10-05', updatedAt: '2023-10-26', customData: { 'cf_1': '₹ 1.2 Cr', 'cf_2': 'Healthcare' } },
  { id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', name: 'Sneha Desai', phone: '+91 99001 12233', email: 'sneha.d@retailgiant.com', company: 'RetailGiant', createdAt: '2023-07-20', updatedAt: '2023-09-30', customData: { 'cf_1': '₹ 2.5 Cr', 'cf_2': 'Retail' } },
  { id: '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', name: 'Karan Malhotra', phone: '+91 98112 23344', email: 'karan.m@agency.io', company: 'Creative Agency', createdAt: '2023-10-15', updatedAt: '2023-10-22', customData: { 'cf_1': '₹ 60 L', 'cf_2': 'Media' } },
  { id: '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', name: 'Pooja Verma', phone: '+91 88990 01122', email: 'pooja.v@healthplus.in', company: 'HealthPlus', createdAt: '2023-09-28', updatedAt: '2023-10-10', customData: { 'cf_1': '₹ 1.8 Cr', 'cf_2': 'Healthcare' } },
  { id: '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', name: 'Rohan Jain', phone: '+91 77889 90011', email: 'rohan.j@fintech.co', company: 'FinTech Solutions', createdAt: '2023-08-05', updatedAt: '2023-10-18', customData: { 'cf_1': '₹ 4 Cr', 'cf_2': 'Finance' } },
  { id: '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', name: 'Anjali Rathi', phone: '+91 99880 07766', email: 'anjali.r@edutech.com', company: 'EduTech India', createdAt: '2023-10-18', updatedAt: '2023-10-25', customData: { 'cf_1': '₹ 90 L', 'cf_2': 'Education' } },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [customFields, setCustomFields] = useState<CustomField[]>(INITIAL_CUSTOM_FIELDS);

  // TanStack Table Search State
  const [globalFilter, setGlobalFilter] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);

  const handleAddCustomField = (newField: CustomField) => {
    setCustomFields(prev => [...prev, newField]);
  };

  const handleSaveContact = (newContact: Contact) => {
    setContacts(prev => {
      const existingIndex = prev.findIndex(c => c.id === newContact.id);
      if (existingIndex >= 0) {
        // Update existing contact
        const updated = [...prev];
        updated[existingIndex] = newContact;
        return updated;
      } else {
        // Add new contact
        return [newContact, ...prev];
      }
    });
    setIsAddModalOpen(false);
    setContactToEdit(null);
  };

  const handleEditContact = (contact: Contact) => {
    setContactToEdit(contact);
  };

  const handleDeleteContact = (contact: Contact) => {
    if (confirm(`Are you sure you want to delete ${contact.name}?`)) {
      setContacts(prev => prev.filter(c => c.id !== contact.id));
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh)] -m-8 bg-[#121212]">

      {/* HEADER */}
      <div className="flex h-16 items-center justify-between px-8 border-b border-[#333333] bg-[#1c1c1c] shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#252525] border border-[#333333] rounded-md text-sm font-medium text-gray-200 hover:bg-[#2d2d2d] transition-colors"
          >
            <UploadCloud className="h-4 w-4" /> Add Bulk Contacts
          </button>
          
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#121212] border border-[#333333] rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => {
              setContactToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Contact
          </button>
        </div>
      </div>

      {/* REUSABLE DATA TABLE */}
      <ContactsTable
        contacts={contacts}
        customFields={customFields}
        globalFilter={globalFilter}
        onRowClick={setSelectedContact}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
      />

      {/* REUSABLE MODALS */}
      {(isAddModalOpen || contactToEdit) && (
        <AddContactForm
          customFields={customFields}
          initialData={contactToEdit || undefined}
          onClose={() => {
            setIsAddModalOpen(false);
            setContactToEdit(null);
          }}
          onAddCustomField={handleAddCustomField}
          onSaveContact={handleSaveContact}
        />
      )}

      <ContactProfile
        contact={selectedContact}
        customFields={customFields}
        onClose={() => setSelectedContact(null)}
      />

      {/* Bulk Import Modal */}
      {isImportOpen && (
        <BulkImportModal
          customFields={customFields}
          onClose={() => setIsImportOpen(false)}
          onAddCustomField={handleAddCustomField}
        />
      )}

    </div>
  );
}
