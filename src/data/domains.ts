
import { DomainConfig } from '../types';

export const DOMAINS: DomainConfig[] = [
  {
    id: 'database',
    title: 'DB Kernel Voice',
    description: 'MySQL, PostgreSQL, and Distributed Systems Internals.',
    iconName: 'database',
    color: 'blue',
    voices: { teacher: 'Fenrir', student: 'Puck' },
    systemPrompt: `You are a Senior Database Kernel Engineer. 
    Explain the topic with deep technical detail, referencing source code (C/C++) concepts like B-Trees, WAL, and MVCC.
    Structure as a dialogue between a Kernel Architect (Teacher) and a Junior DBA (Student).
    Output Format: JSON with "title", "overview", and "script" fields.`,
    topics: [
      'InnoDB Buffer Pool', 'Postgres MVCC', 'Raft Consensus', 
      'MySQL Redo Log', 'RocksDB LSM Tree', 'Redis Event Loop',
      'Google AlloyDB Architecture', 'Aurora Log Storage'
    ]
  },
  {
    id: 'linux',
    title: 'Linux Kernel Voice',
    description: 'OS Scheduling, Memory Management, and eBPF.',
    iconName: 'terminal',
    color: 'emerald',
    voices: { teacher: 'Fenrir', student: 'Puck' },
    systemPrompt: `You are a Senior Linux Kernel Maintainer.
    Explain the topic focusing on kernel structs (task_struct, sk_buff), memory management (SLUB, VMA), and scheduling (CFS).
    Structure as a dialogue between a Kernel Hacker (Teacher) and a Student.
    Output Format: JSON with "title", "overview", and "script" fields.`,
    topics: [
      'CFS Scheduler', 'eBPF Verifier', 'SLUB Allocator', 
      'Context Switching', 'Page Fault Handling', 'RCU Synchronization'
    ]
  },
  {
    id: 'interview',
    title: 'Software Interview Voice',
    description: 'System Design, Algorithms, and Behavioral Prep.',
    iconName: 'code',
    color: 'violet',
    voices: { teacher: 'Zephyr', student: 'Kore' },
    systemPrompt: `You are a FAANG Hiring Manager.
    Conduct a mock interview or explain a system design concept. Focus on scalability, trade-offs, and algorithmic complexity.
    Structure as a dialogue between Interviewer and Candidate.
    Output Format: JSON with "title", "overview", and "script" fields.`,
    topics: [
      'Design Twitter', 'Invert a Binary Tree', 'Rate Limiter Design', 
      'Consistent Hashing', 'Distributed Lock Manager'
    ]
  },
  {
    id: 'scripture',
    title: 'Scripture Voice',
    description: 'Biblical Exegesis, Theology, and Devotionals.',
    iconName: 'book',
    color: 'amber',
    voices: { teacher: 'Fenrir', student: 'Kore' },
    systemPrompt: `You are a Theology Professor.
    Explain the bible verse or theological concept with historical context, original Greek/Hebrew meaning, and modern application.
    Structure as a dialogue between Pastor and Congregant.
    Output Format: JSON with "title", "overview", and "script" fields.`,
    topics: [
      'John 3:16', 'Romans 8', 'Psalm 23', 
      'The Meaning of Grace', 'Sermon on the Mount'
    ]
  },
  {
    id: 'poem',
    title: 'Chinese Poem Voice',
    description: 'Tang/Song Dynasty Poetry and Cultural History.',
    iconName: 'feather',
    color: 'rose',
    voices: { teacher: 'Zephyr', student: 'Puck' },
    systemPrompt: `You are a Classical Chinese Literature Professor.
    Explain the poem, its historical background, and the poet's emotions.
    Output the script in Traditional Chinese.
    Structure as a dialogue between Master and Disciple.
    Output Format: JSON with "title", "overview", and "script" fields.`,
    topics: [
      'Li Bai - Quiet Night Thought', 'Du Fu - Spring View', 
      'Su Shi - Water Melody', 'The Art of Calligraphy'
    ]
  }
];
