import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, AlertTriangle, ArrowRightLeft, Calendar, PieChart, Lightbulb 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAppContext } from '../context/AppContext';
import { calculateInsightsData } from '../utils/calculations';
import StatCard from '../components/ui/StatCard';
import './Pages.css';

export default function Insights() {
  const { transactions, loading } = useAppContext();

  const insightsData = useMemo(() => {
    return calculateInsightsData(transactions);
  }, [transactions]);

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <motion.div 
      className="page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="page-header">
        <div className="page-header-text">
          <h1>Smart Insights</h1>
          <p>Analytical observations based on your recent activity.</p>
        </div>
      </header>

      {insightsData ? (
        <>
          <div className="insights-grid">
            <StatCard 
              icon={Trophy} 
              title="Top Spending Category" 
              value={insightsData.topCategory[0]} 
              description={`$${insightsData.topCategory[1].toLocaleString()}`}
              iconColorClass="red" 
            />
            <StatCard 
              icon={AlertTriangle} 
              title="Largest Single Expense" 
              value={insightsData.largestExpense.description} 
              description={`$${parseFloat(insightsData.largestExpense.amount).toLocaleString()}`}
              iconColorClass="red" 
            />
            <StatCard 
              icon={ArrowRightLeft} 
              title="Savings Rate" 
              value={`${insightsData.savingsRate}%`} 
              description="of your income was saved"
              iconColorClass="green" 
            />
            <StatCard 
              icon={Calendar} 
              title="Average Daily Spend" 
              value={`$${insightsData.averageDailySpend}`} 
              description="across the standard 30-day window"
              iconColorClass="blue" 
            />
            <StatCard 
              icon={PieChart} 
              title="Spending Priority" 
              value={`${insightsData.essentialPercentage}% Essential`} 
              description={`and ${100 - insightsData.essentialPercentage}% non-essential`}
              iconColorClass="blue" 
            />
            <StatCard 
              icon={Lightbulb} 
              title="Upcoming Projection" 
              value={insightsData.upcomingInsight} 
              description="Based on prior month extrapolation"
              iconColorClass="green" 
            />
          </div>

          <div className="chart-container glass-panel" style={{ marginTop: '1.5rem' }}>
            <h3>Income vs Expense (Monthly Cashflow)</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insightsData.monthlyFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-main)' }}
                    cursor={{fill: 'var(--bg-base)'}}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} />
                  <Bar dataKey="income" name="Income" fill="var(--accent-success)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="var(--accent-danger)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Not enough data to calculate insights.</p>
        </div>
      )}
    </motion.div>
  );
}
