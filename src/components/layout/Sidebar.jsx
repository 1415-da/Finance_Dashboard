import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, PieChart } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar glass-panel">
      <div className="logo-container">
        <div className="logo-icon">MF</div>
        <h2 className="logo-text">MyFinance</h2>
      </div>
      
      <nav className="nav-menu">
        <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/transactions" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <ReceiptText size={20} />
          <span>Transactions</span>
        </NavLink>
        <NavLink to="/insights" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <PieChart size={20} />
          <span>Insights</span>
        </NavLink>
      </nav>
    </aside>
  );
}
