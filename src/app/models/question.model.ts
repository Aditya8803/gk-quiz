export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface Subject {
  id: string;
  label: string;
  dataFile: string;
  icon: string;
}

export const SUBJECTS: Subject[] = [
  { id: 'history', label: 'History', dataFile: 'history.json', icon: '🏛️' },
  { id: 'geography', label: 'Geography', dataFile: 'geography.json', icon: '🌏' },
  { id: 'polity', label: 'Polity', dataFile: 'polity.json', icon: '⚖️' },
  { id: 'economics', label: 'Economics', dataFile: 'economics.json', icon: '📊' },
  { id: 'static_gk', label: 'Static GK', dataFile: 'static_gk.json', icon: '📚' },
  { id: 'current_affairs', label: 'Current Affairs', dataFile: 'current_affairs.json', icon: '📰' },
];
