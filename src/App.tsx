import { Book, Image as ImageIcon, Layout, List, Monitor, Play, Smartphone, Tv } from 'lucide-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FoldbackDisplay from './pages/Foldback/FoldbackDisplay';
import LiveOutput from './pages/Live/LiveOutput';
import OperatorDashboard from './pages/Operator/OperatorDashboard';
import MobileRemote from './pages/Remote/MobileRemote';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OperatorDashboard />} />
        <Route path="/live" element={<LiveOutput />} />
        <Route path="/foldback" element={<FoldbackDisplay />} />
        <Route path="/remote" element={<MobileRemote />} />
      </Routes>
    </BrowserRouter>
  );
}
