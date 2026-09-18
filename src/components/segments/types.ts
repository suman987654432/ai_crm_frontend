export interface Segment {
  id: string;
  name: string;
  contactIds: string[];
  usedIn: string[]; // e.g. ["Diwali Campaign", "Welcome Series"]
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
