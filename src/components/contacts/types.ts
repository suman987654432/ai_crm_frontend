export type FieldType = 'Text' | 'Number' | 'Currency' | 'Date' | 'Dropdown' | 'Multi-select' | 'Checkbox' | 'Email' | 'Phone' | 'URL';

export interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  options?: string[];
  required: boolean;
  showInTable: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  createdAt: string;
  updatedAt: string;
  customData: Record<string, any>;
}
