import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2 } from 'lucide-react';

export default function TransactionsTable({ transactions, role, deleteTransaction, handleEditClick }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Type</th>
            {role === 'Admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {transactions.length > 0 ? transactions.map((txn, i) => (
              <motion.tr 
                key={txn.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <td>{txn.date}</td>
                <td style={{ fontWeight: 500 }}>{txn.description}</td>
                <td><span className="badge" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>{txn.category}</span></td>
                <td className={txn.type === 'income' ? 'success-text' : ''}>
                  {txn.type === 'income' ? '+' : '-'}${parseFloat(txn.amount).toLocaleString()}
                </td>
                <td>
                  <span className={`badge ${txn.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                    {txn.type}
                  </span>
                </td>
                {role === 'Admin' && (
                  <td>
                    <div className="action-btns">
                      <button 
                        className="icon-btn primary" 
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', marginRight: '0.75rem' }}
                        onClick={() => handleEditClick(txn)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="icon-btn danger" 
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-danger)' }}
                        onClick={() => deleteTransaction(txn.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </motion.tr>
            )) : (
              <tr>
                <td colSpan={role === 'Admin' ? 6 : 5} style={{ textAlign: 'center', padding: '3rem' }}>
                  <p>No transactions found.</p>
                </td>
              </tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
