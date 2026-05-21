import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useSessionSync } from '../../hooks/useSessionSync';
import { supabase } from '../../lib/supabase';
import { Song } from '../../types';

export default function LiveOutput() {
  const { session } = useSessionSync();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

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

  if (session?.is_blackout) {
    return <div className="fixed inset-0 bg-black z-50 transition-opacity duration-1000" />;
  }

  const currentSlideText = currentSong?.lyrics[session?.current_slide_index || 0]?.text || '';

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Background Media Layer */}
      {session?.media_url && (
        <div className="absolute inset-0 z-0">
          {session.media_url.endsWith('.mp4') ? (
            <video
              src={session.media_url}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <img
              src={session.media_url}
              className="w-full h-full object-cover opacity-60"
              alt="background"
            />
          )}
        </div>
      )}

      {/* Content Layer */}
      <main className="relative z-10 w-full max-w-[80%] text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${session?.current_item_id}-${session?.current_slide_index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center min-h-[50vh]"
          >
            <p className="text-5xl md:text-7xl font-sans font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-tight whitespace-pre-wrap">
              {currentSlideText}
            </p>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
