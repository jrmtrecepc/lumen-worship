import { Plus, Search, Trash, Video } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useSessionSync } from '../../hooks/useSessionSync';
import { supabase } from '../../lib/supabase';
import { MediaItem, ScheduleItem, Song } from '../../types';

export default function OperatorDashboard() {
  const { session, updateSession } = useSessionSync();
  const [songs, setSongs] = useState<Song[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const { data: songsData } = await supabase.from('songs').select('*');
      const { data: mediaData } = await supabase.from('media').select('*');
      
      if (songsData && songsData.length > 0) {
        setSongs(songsData);
      } else {
        // Mock fallback
        setSongs([
          {
            id: 'mock-song',
            title: 'Amazing Grace',
            lyrics: [
              { id: '1', text: 'Amazing grace! How sweet the sound\nThat saved a wretch like me!' },
              { id: '2', text: 'I once was lost, but now am found\nWas blind, but now I see.' }
            ],
            author: 'John Newton'
          },
          {
            id: 'mock-song-2',
            title: 'How Great Thou Art',
            lyrics: [
              { id: '3', text: 'O Lord my God, When I in awesome wonder\nConsider all the worlds Thy hands have made' },
              { id: '4', text: 'I see the stars, I hear the rolling thunder\nThy power throughout the universe displayed' }
            ]
          }
        ]);
      }
      
      if (mediaData) setMedia(mediaData);
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if the operator is typing in a search bar or input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === 'b' || e.key === 'B') {
        updateSession({ is_blackout: !session?.is_blackout });
      } else if (e.code === 'Space') {
        e.preventDefault();
        updateSession({ current_slide_index: (session?.current_slide_index || 0) + 1 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session, updateSession]);

  const openWindow = (path: string) => {
    window.open(path, '_blank', 'width=1280,height=720');
  };

  const handleGoLive = (item: ScheduleItem, firstSlideIndex = 0) => {
    updateSession({
      current_item_id: item.reference_id,
      current_type: item.type,
      current_slide_index: firstSlideIndex,
      is_blackout: false
    });
  };

  return (
    <div className="flex h-screen bg-[#141414] text-white font-sans overflow-hidden">
      {/* Sidebar: Library */}
      <aside className="w-80 border-r border-[#2a2a2a] flex flex-col">
        <div className="p-4 border-bottom border-[#2a2a2a]">
          <h2 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4 italic">Library</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search songs/media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-6">
            <h3 className="px-2 text-[10px] uppercase font-bold text-gray-600 mb-2">Songs</h3>
            {songs.map(song => (
              <div key={song.id} className="p-2 hover:bg-[#222] rounded cursor-pointer text-sm flex justify-between items-center group">
                <span>{song.title}</span>
                <Plus className="size-4 opacity-0 group-hover:opacity-100 text-blue-500" />
              </div>
            ))}
          </div>

          <div>
            <h3 className="px-2 text-[10px] uppercase font-bold text-gray-600 mb-2">Media</h3>
            {media.map(item => (
              <div key={item.id} className="p-2 hover:bg-[#222] rounded cursor-pointer text-sm flex items-center gap-2">
                {item.type === 'video' ? <Video className="size-3" /> : <Plus className="size-3" />}
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content: Schedule & Preview */}
      <main className="flex-1 flex flex-col border-r border-[#2a2a2a]">
        {/* Top bar: Controls */}
        <header className="h-14 border-b border-[#2a2a2a] flex items-center justify-between px-6 bg-[#1a1a1a]">
          <div className="flex gap-4">
            <button onClick={() => openWindow('/live')} className="text-xs flex items-center gap-2 px-3 py-1.5 bg-[#222] hover:bg-[#333] rounded border border-[#333]">
              Open Projector
            </button>
            <button onClick={() => openWindow('/foldback')} className="text-xs flex items-center gap-2 px-3 py-1.5 bg-[#222] hover:bg-[#333] rounded border border-[#333]">
              Open Foldback
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => updateSession({ is_blackout: !session?.is_blackout })}
              className={`text-xs px-4 py-1.5 rounded border transition-colors ${session?.is_blackout ? 'bg-red-500 border-red-400' : 'bg-[#222] border-[#333]'}`}
            >
              BLACKOUT
            </button>
            <div className="size-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Schedule */}
          <div className="w-64 border-r border-[#2a2a2a] flex flex-col">
            <h2 className="p-4 text-xs font-mono uppercase tracking-widest opacity-50 italic">Schedule</h2>
            <div className="flex-1 p-2 space-y-1">
              {schedule.length === 0 && (
                <div className="text-xs text-gray-600 text-center mt-10 p-4 border border-dashed border-[#333] rounded">
                  Drag items here to build your service
                </div>
              )}
              {/* Iteration over schedule items would go here */}
            </div>
          </div>

          {/* Live Preview / WYSIWYG */}
          <div className="flex-1 bg-black p-8 flex items-center justify-center relative">
            <div className="aspect-video w-full max-w-2xl bg-[#0a0a0a] border border-[#222] rounded-lg overflow-hidden flex items-center justify-center p-8 text-center">
              <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                Preview Window
              </h1>
              {session?.is_blackout && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-red-500 font-mono text-sm uppercase tracking-[0.2em] animate-pulse">Live Blackout Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Right: Interaction/Inspector */}
      <aside className="w-64 p-4">
        <h2 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4 italic">Next Slides</h2>
        <div className="space-y-4">
          <div className="p-4 bg-[#1a1a1a] rounded border border-[#333] opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-xs text-gray-500 mb-1">Coming Next</p>
            <p className="text-sm">Amazing Grace (Slide 2)</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
