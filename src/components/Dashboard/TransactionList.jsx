// src/components/Dashboard/TransactionList.js
import React from 'react';
import { supabase } from '../../lib/supabase';

const TransactionList = ({ transactions, onRefresh, compact = false }) => {
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting transaction:', error);
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
            >
              🗑️
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
