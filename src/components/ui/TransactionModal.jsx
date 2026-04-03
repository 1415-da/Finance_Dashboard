import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function TransactionModal({ formData, setFormData, handleSubmit, setIsModalOpen, editingId }) {
  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="modal-content"
        initial={{ scale: 0.95, y: 20 }} 
        animate={{ scale: 1, y: 0 }} 
        exit={{ scale: 0.95, y: 20 }}
      >
        <div className="modal-header">
          <h2>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="close-btn" onClick={() => setIsModalOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Type</label>
            <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="input-group">
            <label>Date</label>
            <input type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required/>
          </div>
          <div className="input-group">
            <label>Description</label>
            <input type="text" className="input-field" placeholder="E.g. Groceries" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required/>
          </div>
          <div className="input-group">
            <label>Category</label>
            <input type="text" className="input-field" placeholder="E.g. Food" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required/>
          </div>
          <div className="input-group">
            <label>Amount ($)</label>
            <input type="number" step="0.01" className="input-field" placeholder="10.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Save Transaction'}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
