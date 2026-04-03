import React from 'react';
import { Moon, Sun, UserCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Topbar() {
  const { theme, toggleTheme, role, setRole } = useAppContext();

  return (
    <header className="topbar glass-panel">
      <div className="search-placeholder">
        {/* Isolated header slot reserved for future contextual mounting */}
      </div>
      
      <div className="topbar-actions">
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="role-switcher">
          <UserCircle2 size={20} />
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="role-select"
          >
            <option value="Viewer">Viewer Mode</option>
            <option value="Admin">Admin Mode</option>
          </select>
        </div>
      </div>
    </header>
  );
}
