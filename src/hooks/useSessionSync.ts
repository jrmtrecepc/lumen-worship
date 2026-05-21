import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SessionState } from '../types';

export function useSessionSync() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase
          .from('session_state')
          .select('*')
          .single();

        if (error) throw error;
        setSession(data);
      } catch (err) {
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Subscription to real-time changes
    let channel: any;
    
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      channel = supabase
        .channel('session_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'session_state',
          },
          (payload) => {
            console.log('Session updated:', payload.new);
            setSession(payload.new as SessionState);
          }
        )
        .subscribe();
    } else {
      // Mock local storage fallback for demo if no Supabase
      const mockState: SessionState = {
        id: 'mock-session',
        current_item_id: 'mock-song',
        current_type: 'song',
        current_slide_index: 0,
        is_blackout: false,
        media_url: null,
        updated_at: new Date().toISOString()
      };
      setSession(mockState);
      setLoading(false);
      
      const interval = setInterval(() => {
        const stored = localStorage.getItem('mock_session_state');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSession(prev => (JSON.stringify(prev) !== JSON.stringify(parsed) ? parsed : prev));
        }
      }, 1000);
      return () => clearInterval(interval);
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateSession = useCallback(async (updates: Partial<SessionState>) => {
    const updatedState = { ...session, ...updates, updated_at: new Date().toISOString() } as SessionState;
    
    if (!import.meta.env.VITE_SUPABASE_URL) {
      localStorage.setItem('mock_session_state', JSON.stringify(updatedState));
      setSession(updatedState);
      return;
    }

    try {
      const { error } = await supabase
        .from('session_state')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', session?.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating session:', err);
    }
  }, [session]);

  return { session, loading, updateSession };
}
