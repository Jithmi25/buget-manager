// src/components/Dashboard/AddTransaction.js
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const AddTransaction = ({ categories, onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          type: formData.type,
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date
        }]);

      if (error) throw error;

      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });

      if (onTransactionAdded) onTransactionAdded();
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-transaction-form">
      <div className="form-row">
        <div className="form-group">
          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="form-select"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label>Amount (Rs.)</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="form-select"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter description"
          className="form-input"
        />
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Adding...' : '+ Add Transaction'}
      </button>
    </form>
  );
};

export default AddTransaction;
