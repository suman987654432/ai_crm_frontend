export interface CampaignPayload {
  name: string;
  phoneNumber: string;
  agentId: string;
  segmentId: string;
  selectedDays: string[];
  timezone: string;
  callingWindowStart: string;
  callingWindowEnd: string;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 'success';

export type CampaignStatus = 'Draft' | 'Scheduled' | 'Running' | 'Paused' | 'Completed' | 'Failed';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  agentName: string;
  segmentName: string;
  totalContacts: number;
  callsCompleted: number;
  stats: {
    interested: number;
    callback: number;
    noAnswer: number;
  };
  scheduleDate: string;
  scheduleTime: string;
  phoneNumber: string;
  lastActivity?: string;
}
