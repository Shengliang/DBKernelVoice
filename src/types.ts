
export interface DomainConfig {
  id: string;
  title: string;
  description: string;
  iconName: 'database' | 'terminal' | 'feather' | 'book' | 'code';
  color: string; // Tailwind class prefix (e.g., 'blue', 'green')
  systemPrompt: string;
  topics: string[];
  voices: {
    teacher: string;
    student: string;
  };
}

export interface SearchResult {
  domainId: string;
  title: string;
  overview: string;
  script: string; // Dialogue
}

export interface PlaylistItem {
  text: string;
  role: 'Teacher' | 'Student';
}

// Additions for geminiService.ts compatibility

export enum VoiceName {
  Kore = 'Kore',
  Puck = 'Puck', // Student
  Charon = 'Charon', // Narrator / System
  Fenrir = 'Fenrir', // Teacher
  Zephyr = 'Zephyr',
}

export type Language = 'en' | 'zh';

export interface HistoryItem {
  key: string;
  query: string;
  title: string;
  timestamp: number;
  language: Language;
}

export interface TopicResult {
  topic: {
    title: string;
    techStack: string;
    overview: string;
  };
  script: string; // The full conversation
  timestamp?: number;
}

export interface DetailedSearchResult {
  topic: {
    title: string;
    techStack: string;
    overview: string;
  };
  passage: {
    reference: string; // Kept for compatibility with some components
    text: string;
    context?: string;
  };
  timestamp?: number;
}
