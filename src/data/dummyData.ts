import { Contact, CustomField } from '@/components/contacts/types';
import { Segment } from '@/components/segments/types';

export const INITIAL_CUSTOM_FIELDS: CustomField[] = [
  { id: 'cf_1', name: 'Budget', type: 'Currency', required: false, showInTable: true },
  { id: 'cf_2', name: 'Industry', type: 'Dropdown', options: ['Tech', 'Finance', 'Real Estate', 'Healthcare'], required: false, showInTable: true },
];

export const INITIAL_CONTACTS: Contact[] = [
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

export const INITIAL_SEGMENTS: Segment[] = [
  {
    id: 's-9f8e7d6c-5b4a-39f8-e7d6-c5b4a39f8e7d',
    name: 'VIP Customers',
    contactIds: ['c9a2f3b1-4d5e-6f7a-8b9c-0d1e2f3a4b5c', 'f8e7d6c5-b4a3-9f8e-7d6c-5b4a39f8e7d6', 'd6c5b4a3-9f8e-7d6c-5b4a-39f8e7d6c5b4'],
    usedIn: ['Diwali Promo', 'Q4 Newsletter'],
    isActive: true,
    createdAt: '2023-10-01',
    updatedAt: '2023-10-20',
  },
  {
    id: 's-1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    name: 'Cold Leads',
    contactIds: ['1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a'],
    usedIn: ['Re-engagement Campaign'],
    isActive: true,
    createdAt: '2023-09-15',
    updatedAt: '2023-10-25',
  },
  {
    id: 's-7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
    name: 'Startups India',
    contactIds: ['1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'],
    usedIn: [],
    isActive: false,
    createdAt: '2023-10-10',
    updatedAt: '2023-10-15',
  }
];

export const DUMMY_AGENTS = [
  { id: 'agent-1', name: 'Sales Follow-up Agent', language: 'Hindi + English', tone: 'Professional', type: 'Outbound Sales' },
  { id: 'agent-2', name: 'Customer Support Bot', language: 'English', tone: 'Friendly', type: 'Inbound Support' },
  { id: 'agent-3', name: 'Feedback Collection', language: 'Hindi', tone: 'Casual', type: 'Survey' },
];

export const AVAILABLE_NUMBERS = [
  '+91 98765 43210',
  '+91 87654 32109',
  '+91 99887 76655',
];

export const INITIAL_CAMPAIGNS: import('@/components/campaigns/types').Campaign[] = [
  {
    id: 'camp-1',
    name: 'Inactive Customer Follow-up',
    description: 'Re-engage customers who haven\'t purchased recently',
    status: 'Running',
    agentName: 'Sales Follow-up Agent',
    segmentName: 'Inactive Customers',
    totalContacts: 1240,
    callsCompleted: 892,
    stats: {
      interested: 124,
      callback: 86,
      noAnswer: 310
    },
    scheduleDate: '25 Sep 2026',
    scheduleTime: '10:00 AM (IST)',
    phoneNumber: '+91 98765 43210',
    lastActivity: 'Last activity 5 minutes ago'
  },
  {
    id: 'camp-2',
    name: 'Q3 Feature Announcement',
    description: 'Call our top users to inform them of the new AI features',
    status: 'Scheduled',
    agentName: 'Customer Support Bot',
    segmentName: 'VIP Customers',
    totalContacts: 450,
    callsCompleted: 0,
    stats: {
      interested: 0,
      callback: 0,
      noAnswer: 0
    },
    scheduleDate: '28 Sep 2026',
    scheduleTime: '02:00 PM (IST)',
    phoneNumber: '+91 87654 32109'
  },
  {
    id: 'camp-3',
    name: 'Feedback Survey - June',
    description: 'Ask startups about their experience with the Q2 program',
    status: 'Completed',
    agentName: 'Feedback Collection',
    segmentName: 'Startups India',
    totalContacts: 850,
    callsCompleted: 850,
    stats: {
      interested: 320,
      callback: 10,
      noAnswer: 40
    },
    scheduleDate: '10 Jun 2026',
    scheduleTime: '11:00 AM (IST)',
    phoneNumber: '+91 99887 76655',
    lastActivity: 'Completed on 12 Jun 2026'
  }
];

export const INITIAL_CALLS: import('@/components/calls/types').Call[] = [
  {
    id: 'call-001',
    contactName: 'Rahul Sharma',
    phoneNumber: '+91 98765 43210',
    agentName: 'Sales Follow-up Agent',
    campaignName: 'Inactive Customer Follow-up',
    callDateTime: '2023-10-25T10:30:00Z',
    duration: '04:12',
    status: 'Completed',
    transcript: 'Agent: Hello, am I speaking with Rahul?\nUser: Yes, speaking.\nAgent: Hi Rahul, I am calling from TechCorp regarding your recent interest in our premium subscription. Are you free to chat for a minute?\nUser: Yes, tell me.\nAgent: We have a special Diwali offer running... (transcript truncated)',
    recordingUrl: '#'
  },
  {
    id: 'call-002',
    contactName: 'Priya Patel',
    phoneNumber: '+91 87654 32109',
    agentName: 'Customer Support Bot',
    campaignName: 'Q3 Feature Announcement',
    callDateTime: '2023-10-25T11:05:00Z',
    duration: '00:45',
    status: 'Missed',
    transcript: 'Voicemail detected. Call ended.',
  },
  {
    id: 'call-003',
    contactName: 'Amit Kumar',
    phoneNumber: '+91 99887 76655',
    agentName: 'Feedback Collection',
    campaignName: 'Feedback Survey - June',
    callDateTime: '2023-10-26T14:20:00Z',
    duration: '02:30',
    status: 'Completed',
    transcript: 'Agent: Hi Amit, how was your experience with BuildFast recently?\nUser: It was quite good, I liked the new UI.',
    recordingUrl: '#'
  },
  {
    id: 'call-004',
    contactName: 'Neha Gupta',
    phoneNumber: '+91 77665 54433',
    agentName: 'Sales Follow-up Agent',
    campaignName: 'Inactive Customer Follow-up',
    callDateTime: '2023-10-26T15:10:00Z',
    duration: '00:00',
    status: 'Failed',
  }
];
