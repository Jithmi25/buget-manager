// src/components/Dashboard/CategoryManager.js
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const CategoryManager = ({ categories, onRefresh }) => {
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('categories')
        .insert([{
          user_id: user.id,
          name: newCategory.trim()
        }]);

      if (error) throw error;

      setNewCategory('');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will affect existing transactions.')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="category-manager">
      <div className="category-form-section">
        <h3>Add New Category</h3>
        <form onSubmit={handleAdd} className="category-form">
          <div className="form-group">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Adding...' : '+ Add Category'}
          </button>
        </form>
      </div>

      <div className="category-list-section">
        <h3>Your Categories</h3>
        {categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏷️</div>
            <p>No categories yet</p>
          </div>
        ) : (
          <div className="category-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-item">
                <span className="category-name">{category.name}</span>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="delete-btn-small"
                  title="Delete category"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
