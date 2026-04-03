import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Download } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TransactionsTable from '../components/ui/TransactionsTable';
import TransactionModal from '../components/ui/TransactionModal';
import './Pages.css';

export default function Transactions() {
  const { transactions, loading, role, addTransaction, editTransaction, deleteTransaction, exportToCSV } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ date: '', description: '', amount: '', category: '', type: 'expense' });

  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      return matchSearch && matchType;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, searchTerm, typeFilter]);

  const handleAddNewClick = () => {
    setFormData({ date: '', description: '', amount: '', category: '', type: 'expense' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (txn) => {
    setFormData({ date: txn.date, description: txn.description, amount: txn.amount, category: txn.category, type: txn.type });
    setEditingId(txn.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.date || !formData.category) return;
    
    if (editingId) {
      editTransaction(editingId, { ...formData, amount: parseFloat(formData.amount) });
    } else {
      addTransaction({ ...formData, amount: parseFloat(formData.amount) });
    }
    
    setIsModalOpen(false);
    setFormData({ date: '', description: '', amount: '', category: '', type: 'expense' });
    setEditingId(null);
  };

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
          <h1>Transactions</h1>
          <p>Review and manage all your past activities.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={exportToCSV}>
            <Download size={16} /> Export
          </button>
          {role === 'Admin' && (
            <button className="btn btn-primary" onClick={handleAddNewClick}>
              <Plus size={16} /> Add New
            </button>
          )}
        </div>
      </header>

      <div className="glass-panel">
        <div className="controls-bar" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div className="input-with-icon">
            <Search size={18} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search descriptions or categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="input-field filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <TransactionsTable 
          transactions={filteredData} 
          role={role} 
          deleteTransaction={deleteTransaction} 
          handleEditClick={handleEditClick} 
        />
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <TransactionModal 
            formData={formData} 
            setFormData={setFormData} 
            handleSubmit={handleSubmit} 
            setIsModalOpen={setIsModalOpen} 
            editingId={editingId} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
