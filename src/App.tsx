import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Dashboard from '@/pages/Dashboard';
import WaterSources from '@/pages/WaterSources';
import Storage from '@/pages/Storage';
import Desalination from '@/pages/Desalination';
import Pipeline from '@/pages/Pipeline';
import Consumption from '@/pages/Consumption';
import Maintenance from '@/pages/Maintenance';
import Emergency from '@/pages/Emergency';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="water-sources" element={<WaterSources />} />
          <Route path="storage" element={<Storage />} />
          <Route path="desalination" element={<Desalination />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="consumption" element={<Consumption />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="emergency" element={<Emergency />} />
        </Route>
      </Routes>
    </Router>
  );
}
