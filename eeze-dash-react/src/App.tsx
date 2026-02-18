import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardProvider } from '@/context/DashboardContext';
import Navbar from '@/components/layout/Navbar';
import DashboardPage from '@/components/dashboard/DashboardPage';
import AboutPage from '@/components/about/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}
