export interface Document {
  id: string;
  title: string;
  size: string;
  date: string;
  status: 'Processed' | 'Processing' | 'New' | 'Draft' | 'Ready';
  type: 'pdf';
}

export interface Stat {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  color: string;
  bgColor: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface HistoryItem {
  id: string;
  question: string;
  preview: string;
  course: string;
  date: string;
  sourcePdf: string;
}

export enum View {
  DASHBOARD = 'dashboard',
  LIBRARY = 'library',
  WORKSPACE = 'workspace',
  HISTORY = 'history',
  SETTINGS = 'settings',
}