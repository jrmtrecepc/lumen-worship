import { useEffect, useState } from 'react';
import { useSessionSync } from '../../hooks/useSessionSync';
import { supabase } from '../../lib/supabase';
import { Song } from '../../types';

export default function FoldbackDisplay() {
  const { session } = useSessionSync();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (session?.current_type === 'song' && session.current_item_id) {
      const fetchSong = async () => {
        if (!import.meta.env.VITE_SUPABASE_URL && session.current_item_id === 'mock-song') {
            setCurrentSong({
                id: 'mock-song',
                title: 'Amazing Grace',
                lyrics: [
                  { id: '1', text: 'Amazing grace! How sweet the sound\nThat saved a wretch like me!' },
                  { id: '2', text: 'I once was lost, but now am found\nWas blind, but now I see.' }
                ]
            });
            return;
        }
        
        const { data } = await supabase
          .from('songs')
          .select('*')
          .eq('id', session.current_item_id)
          .single();
        if (data) setCurrentSong(data);
      };
      fetchSong();
    }
  }, [session?.current_item_id, session?.current_type]);

  const currentSlideText = currentSong?.lyrics[session?.current_slide_index || 0]?.text || '';
  const nextSlideText = currentSong?.lyrics[(session?.current_slide_index || 0) + 1]?.text || 'End of Song';

  return (
    <div className="fixed inset-0 bg-black text-white p-12 flex flex-col font-mono uppercase tracking-tight">
      {/* Top Section: Clock & Status */}
      <header className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl text-gray-500 font-bold mb-2 uppercase">Time</h2>
          <p className="text-7xl font-bold font-mono">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-4xl font-bold ${session?.is_blackout ? 'text-red-500' : 'text-green-500'}`}>
            {session?.is_blackout ? 'BLACKOUT' : 'LIVE'}
          </p>
        </div>
      </header>

      {/* Main Section: Current Slide (Yellow on Black) */}
      <main className="flex-1 flex flex-col justify-center border-l-4 border-yellow-500 pl-12 mb-8">
        <h2 className="text-2xl text-yellow-500/50 font-bold mb-8 uppercase">Current</h2>
        <p className="text-6xl md:text-8xl font-bold text-yellow-500 leading-tight">
          {currentSlideText || "NO ACTIVE SLIDE"}
        </p>
      </main>

      {/* Bottom Section: Next Slide (White on Black) */}
      <footer className="h-1/4 border-l-4 border-white pb-8 pl-12 opacity-60">
        <h2 className="text-xl text-gray-500 font-bold mb-4 uppercase">Next</h2>
        <p className="text-3xl md:text-4xl font-bold">
          {nextSlideText}
        </p>
      </footer>
    </div>
  );
}
