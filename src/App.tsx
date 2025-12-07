
import React, { useState, useEffect } from 'react';
import { DOMAINS } from './data/domains';
import { DomainConfig, SearchResult, PlaylistItem } from './types';
import { generateLecture, generateSpeech, initAI } from './services/ai';
import { splitText } from './utils/audio';
import { Database, Terminal, Feather, Book, Code, ArrowLeft, Play, Pause, Loader2, Volume2, Settings, X } from 'lucide-react';

const ICONS: Record<string, any> = {
  database: Database,
  terminal: Terminal,
  feather: Feather,
  book: Book,
  code: Code
};

function App() {
  const [activeDomain, setActiveDomain] = useState<DomainConfig | null>(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Audio
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [playingIndex, setPlayingIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    initAI();
    const storedKey = localStorage.getItem('user_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem('user_api_key', apiKey);
    window.location.reload();
  };

  const handleSearch = async (topic: string) => {
    if (!activeDomain) return;
    setLoading(true);
    setResult(null);
    setPlaylist([]);
    setPlayingIndex(-1);
    
    try {
      const res = await generateLecture(activeDomain, topic);
      setResult(res);
      
      // Parse script
      const parts = res.script.split(/(Teacher:|Student:|Interviewer:|Candidate:|Pastor:|Congregant:|Master:|Disciple:)/g).filter(p => p.trim());
      const items: PlaylistItem[] = [];
      let currentRole = 'Teacher';
      
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i].trim();
        if (p.endsWith(':')) {
          currentRole = p.slice(0, -1); // Remove colon
        } else {
          const chunks = splitText(p);
          chunks.forEach(c => items.push({ 
            text: c, 
            role: currentRole === 'Student' || currentRole === 'Candidate' || currentRole === 'Disciple' || currentRole === 'Congregant' ? 'Student' : 'Teacher' 
          }));
        }
      }
      setPlaylist(items);
    } catch (e) {
      alert("Error generating content. Check API Key or Quota.");
    } finally {
      setLoading(false);
    }
  };

  const playChunk = async (index: number) => {
    if (!activeDomain || index >= playlist.length) return;
    
    setPlayingIndex(index);
    setIsPlaying(true);
    
    const item = playlist[index];
    const voice = item.role === 'Teacher' ? activeDomain.voices.teacher : activeDomain.voices.student;
    
    try {
      const url = await generateSpeech(item.text, voice);
      const audio = new Audio(url);
      setAudioEl(audio);
      
      audio.play();
      audio.onended = () => {
        if (index + 1 < playlist.length) {
          playChunk(index + 1);
        } else {
          setIsPlaying(false);
          setPlayingIndex(-1);
        }
      };
    } catch (e) {
      console.error("TTS Error", e);
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
    setIsPlaying(false);
  };

  // --- LANDING PAGE ---
  if (!activeDomain) {
    return (
      <div className="min-h-screen bg-gray-950 p-8 flex flex-col items-center justify-center">
        <div className="absolute top-4 right-4">
          <button onClick={() => setShowSettings(true)} className="text-gray-500 hover:text-gray-300">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Unified <span className="text-blue-500">Voice AI</span></h1>
        <p className="text-gray-500 mb-12">Select a Knowledge Domain to begin</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
          {DOMAINS.map(domain => {
            const Icon = ICONS[domain.iconName] || Database;
            const colorClass = `text-${domain.color}-400 group-hover:text-${domain.color}-300`;
            const borderClass = `hover:border-${domain.color}-500/50`;
            
            return (
              <button 
                key={domain.id}
                onClick={() => setActiveDomain(domain)}
                className={`group bg-gray-900 border border-gray-800 p-6 rounded-xl text-left transition-all hover:bg-gray-800 ${borderClass}`}
              >
                <div className={`w-12 h-12 bg-gray-950 rounded-lg flex items-center justify-center mb-4 border border-gray-800 group-hover:border-${domain.color}-900`}>
                  <Icon className={`w-6 h-6 ${colorClass}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-200 mb-2">{domain.title}</h3>
                <p className="text-sm text-gray-500">{domain.description}</p>
              </button>
            );
          })}
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 w-96">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold text-white">API Settings</h3>
                <button onClick={() => setShowSettings(false)}><X className="w-5 h-5" /></button>
              </div>
              <input 
                type="password" 
                placeholder="Enter Gemini API Key" 
                className="w-full bg-gray-950 border border-gray-700 p-2 rounded text-white mb-4"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
              <button onClick={handleSaveKey} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded">
                Save & Reload
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- WORKSPACE PAGE ---
  const Icon = ICONS[activeDomain.iconName];
  
  return (
    <div className="flex h-screen bg-gray-950 text-gray-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <button onClick={() => setActiveDomain(null)} className="text-gray-500 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-gray-200 truncate">{activeDomain.title}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Recommended Topics</div>
          {activeDomain.topics.map(topic => (
            <button 
              key={topic}
              onClick={() => handleSearch(topic)}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-800 text-sm text-gray-400 hover:text-white truncate transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col relative">
        {/* Header Search */}
        <header className="h-16 border-b border-gray-800 flex items-center px-6 gap-4">
          <Icon className={`w-6 h-6 text-${activeDomain.color}-500`} />
          <input 
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
            placeholder={`Ask about ${activeDomain.title}...`}
            className="bg-transparent border-none outline-none flex-1 text-lg placeholder-gray-600"
          />
          {loading && <Loader2 className="w-5 h-5 animate-spin text-gray-500" />}
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar pb-32">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-600">
              <Icon className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a topic or type a query to begin.</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">{result.title}</h1>
                <p className="text-lg text-gray-400 leading-relaxed">{result.overview}</p>
              </div>
              
              <div className="space-y-4 border-l-2 border-gray-800 pl-6">
                {playlist.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => playChunk(idx)}
                    className={`cursor-pointer p-4 rounded transition-all ${
                      idx === playingIndex 
                        ? 'bg-gray-800 border-l-4 border-blue-500 shadow-lg' 
                        : 'hover:bg-gray-900 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`text-xs font-bold uppercase mb-1 ${item.role === 'Teacher' ? 'text-blue-400' : 'text-green-400'}`}>
                      {item.role}
                    </div>
                    <p className="text-gray-300 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Player Footer */}
        {result && playlist.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gray-900 border-t border-gray-800 flex items-center px-8 justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={isPlaying ? stopAudio : () => playChunk(playingIndex === -1 ? 0 : playingIndex)}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </button>
              <div>
                <div className="text-sm font-bold text-white">Now Playing</div>
                <div className="text-xs text-gray-500">{result.title}</div>
              </div>
            </div>
            <div className="text-gray-500 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span className="text-xs font-mono">AI Voice Generation</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
