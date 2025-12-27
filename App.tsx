import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Workspace from './pages/Workspace';
import History from './pages/History';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light text-text-main font-display">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="library" element={<Library />} />
          <Route path="workspace" element={<Workspace />} />
          <Route path="history" element={<History />} />
          <Route path="saved" element={<div className="p-8 text-center text-text-secondary">Saved answers feature coming soon...</div>} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;