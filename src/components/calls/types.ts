export type CallStatus = 'Completed' | 'Missed' | 'Failed' | 'Ongoing' | 'Voicemail';

export interface Call {
  id: string;
  contactName: string;
  phoneNumber: string;
  agentName: string;
  campaignName: string;
  callDateTime: string; // ISO String or formatted string
  duration: string; // e.g. "02:15"
  status: CallStatus;
  transcript?: string;
  recordingUrl?: string;
}
