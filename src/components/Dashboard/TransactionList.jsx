// src/components/Dashboard/TransactionList.js
import React, { useState } from 'react';
import { deleteTransaction } from '../../services/api';

const TransactionList = ({ transactions, onRefresh, compact = false }) => {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    setDeleting(id);
    try {
      const { error } = await deleteTransaction(id);
      
      if (error) {
        alert('Failed to delete transaction: ' + error.message);
        return;
      }
      
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('An unexpected error occurred');
      console.error('Error deleting transaction:', err);
    } finally {
      setDeleting(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <p>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className={`transaction-item ${transaction.type}`}
        >
          <div className="transaction-info">
            <div className="transaction-header">
              <span className="transaction-category">{transaction.category}</span>
              <span className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'} Rs. {parseFloat(transaction.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            {transaction.description && (
              <div className="transaction-description">{transaction.description}</div>
            )}
            <div className="transaction-date">
              {new Date(transaction.date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
          {!compact && (
            <button
              onClick={() => handleDelete(transaction.id)}
              className="delete-btn"
              title="Delete transaction"
              disabled={deleting === transaction.id}
            >
              {deleting === transaction.id ? '⏳' : '🗑️'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
