"use client";

import React, { useState } from 'react';
import { Search, Filter, Plus, UploadCloud, List } from 'lucide-react';
import { Contact, CustomField } from '@/components/contacts/types';
import ContactsTable from '@/components/contacts/ContactsTable';
import AddContactForm from '@/components/contacts/AddContactForm';
import ContactProfile from '@/components/contacts/ContactProfile';
import BulkImportModal from '@/components/contacts/BulkImportModal';
import { INITIAL_CUSTOM_FIELDS, INITIAL_CONTACTS } from '@/data/dummyData';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';



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
    <PageLayout>

      {/* HEADER */}
      <PageHeader title="Contacts">
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
      </PageHeader>

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

    </PageLayout>
  );
}
