import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Elections from './pages/Elections/Elections';
import ElectionDetailsPage from './pages/Elections/ElectionDetailsPage';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/elections" element={<Elections />} />
      <Route path="/elections/:id" element={<ElectionDetailsPage user={{ name: 'John', email: 'john@example.com' }} />} />
    </Routes>
  );
}

export default AppRouter;