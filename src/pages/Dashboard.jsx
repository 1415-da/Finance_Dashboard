import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { calculateDashboardStats } from '../utils/calculations';
import StatCard from '../components/ui/StatCard';
import './Pages.css';

export default function Dashboard() {
  const { transactions, loading } = useAppContext();

  const { balance, totalIncome, totalExpense, timelineData, categoryData } = useMemo(() => {
    return calculateDashboardStats(transactions);
  }, [transactions]);

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  if (loading) {
    return <div className="page-loader"><div className="spinner"></div></div>;
  }

  return (
    <motion.div 
      className="page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="page-header">
        <div className="page-header-text">
          <h1>Overview</h1>
          <p>Your financial summary at a glance.</p>
        </div>
      </header>

      <div className="summary-cards">
        <StatCard 
          icon={Wallet} 
          title="Total Balance" 
          value={`$${balance.toLocaleString()}`} 
          iconColorClass="blue" 
        />
        <StatCard 
          icon={TrendingUp} 
          title="Total Income" 
          value={`+$${totalIncome.toLocaleString()}`} 
          iconColorClass="green" 
          valueClass="success-text"
        />
        <StatCard 
          icon={TrendingDown} 
          title="Total Expenses" 
          value={`-$${totalExpense.toLocaleString()}`} 
          iconColorClass="red" 
          valueClass="danger-text"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-container glass-panel">
          <h3>Balance Trend</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Area type="monotone" dataKey="balance" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container glass-panel">
          <h3>Spending by Category</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                   itemStyle={{ color: 'var(--text-main)' }}
                   formatter={(value) => `$${value}`}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
