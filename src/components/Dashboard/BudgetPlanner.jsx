// src/components/Dashboard/BudgetPlanner.js
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const BudgetPlanner = ({ budgets, categories, transactions, onRefresh }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });
  const [loading, setLoading] = useState(false);

  const calculateSpending = (category, period) => {
    const now = new Date();
    const startDate = new Date();
    
    if (period === 'monthly') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    }

    return transactions
      .filter(t => 
        t.type === 'expense' &&
        t.category === category &&
        new Date(t.date) >= startDate
      )
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('budgets')
        .insert([{
          user_id: user.id,
          category: formData.category,
          amount: parseFloat(formData.amount),
          period: formData.period
        }]);

      if (error) throw error;

      setFormData({
        category: '',
        amount: '',
        period: 'monthly'
      });

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error adding budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <div className="budget-planner">
      <div className="budget-form-section">
        <h3>Create New Budget</h3>
        <form onSubmit={handleSubmit} className="budget-form">
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
            <label>Budget Amount (Rs.)</label>
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

          <div className="form-group">
            <label>Period</label>
            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="form-select"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : '+ Create Budget'}
          </button>
        </form>
      </div>

      <div className="budget-list-section">
        <h3>Active Budgets</h3>
        {budgets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <p>No budgets set yet</p>
          </div>
        ) : (
          <div className="budget-list">
            {budgets.map((budget) => {
              const spent = calculateSpending(budget.category, budget.period);
              const percentage = (spent / budget.amount) * 100;
              const isOverBudget = percentage > 100;

              return (
                <div key={budget.id} className="budget-card">
                  <div className="budget-header">
                    <h4>{budget.category}</h4>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="delete-btn-small"
                      title="Delete budget"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="budget-amounts">
                    <div className="budget-spent">
                      <span className="label">Spent</span>
                      <span className={`value ${isOverBudget ? 'over' : ''}`}>
                        Rs. {spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="budget-total">
                      <span className="label">Budget</span>
                      <span className="value">
                        Rs. {parseFloat(budget.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${isOverBudget ? 'over' : ''}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  <div className="budget-footer">
                    <span className="period">{budget.period}</span>
                    <span className={`percentage ${isOverBudget ? 'over' : ''}`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPlanner;
