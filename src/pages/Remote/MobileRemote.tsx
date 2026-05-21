import { ChevronLeft, ChevronRight, List, MessageCircle, Smartphone } from 'lucide-react';
import { useSessionSync } from '../../hooks/useSessionSync';

export default function MobileRemote() {
  const { session, updateSession } = useSessionSync();

  const handleNext = () => {
    if (!session) return;
    updateSession({ current_slide_index: session.current_slide_index + 1 });
  };

  const handlePrev = () => {
    if (!session) return;
    updateSession({ current_slide_index: Math.max(0, session.current_slide_index - 1) });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-lg font-bold uppercase tracking-[0.2em]">Remote</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">LumenWorship Control</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-green-500 animate-pulse">Sync Active</div>
        </div>
      </header>

      {/* Current Selection Status */}
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222] mb-10 shadow-2xl">
        <p className="text-[10px] uppercase text-gray-500 font-bold mb-2 tracking-widest">Now Presenting</p>
        <p className="text-xl font-bold mb-1">Amazing Grace</p>
        <p className="text-sm text-gray-400 italic">Slide { (session?.current_slide_index || 0) + 1 }</p>
      </div>

      {/* Main Controls */}
      <div className="flex-1 grid grid-cols-2 gap-4 mb-10">
        <button
          onClick={handlePrev}
          className="aspect-square bg-[#1a1a1a] rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-[#222] active:scale-95 transition-all outline outline-1 outline-[#333]"
        >
          <ChevronLeft className="size-10" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Previous</span>
        </button>

        <button
          onClick={handleNext}
          className="aspect-square bg-blue-600 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-blue-500 active:scale-95 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
        >
          <ChevronRight className="size-10" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Next Slide</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
           onClick={() => updateSession({ is_blackout: !session?.is_blackout })}
           className={`py-4 rounded-xl text-[10px] uppercase font-bold tracking-widest border transition-all ${session?.is_blackout ? 'bg-red-500 border-red-400' : 'bg-[#111] border-[#222]'}`}
        >
          Blackout
        </button>
        <button className="py-4 bg-[#111] border border-[#222] rounded-xl text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2">
          <MessageCircle className="size-3" />
          Nursery Alert
        </button>
      </div>

      <nav className="flex justify-around items-center p-4 bg-[#111] border border-[#222] rounded-full mt-auto">
        <List className="size-5 text-blue-500" />
        <div className="size-12 bg-white/5 rounded-full flex items-center justify-center">
          <Smartphone className="size-5 text-gray-500" />
        </div>
      </nav>
    </div>
  );
}
