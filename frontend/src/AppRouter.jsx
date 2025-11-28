import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Elections from './pages/Elections/Elections';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/elections" element={<Elections />} />
    </Routes>
  );
}

export default AppRouter;