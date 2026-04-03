import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialTransactions } from '../utils/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('Viewer'); // Viewer or Admin
  const [theme, setTheme] = useState('dark');

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('finance-dashboard-theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('finance-dashboard-theme', newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  // Mock API Loading and Local Storage
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate network latency (Mock API delay)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const stored = localStorage.getItem('finance-transactions-v2');
      if (stored) {
        setTransactions(JSON.parse(stored));
      } else {
        setTransactions(initialTransactions);
        localStorage.setItem('finance-transactions-v2', JSON.stringify(initialTransactions));
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const addTransaction = async (txn) => {
    const updated = [...transactions, { ...txn, id: Date.now().toString() }];
    setTransactions(updated);
    localStorage.setItem('finance-transactions-v2', JSON.stringify(updated));
  };

  const deleteTransaction = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem('finance-transactions-v2', JSON.stringify(updated));
  };

  const editTransaction = (id, updatedFields) => {
    const updated = transactions.map(t => t.id === id ? { ...t, ...updatedFields } : t);
    setTransactions(updated);
    localStorage.setItem('finance-transactions-v2', JSON.stringify(updated));
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
    const rows = transactions.map(t => [
      t.date, 
      `"${t.description}"`, 
      t.category, 
      t.amount, 
      t.type
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const value = {
    transactions,
    loading,
    role,
    setRole,
    theme,
    toggleTheme,
    addTransaction,
    editTransaction,
    deleteTransaction,
    exportToCSV
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
