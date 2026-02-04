// src/components/Dashboard/CategoryManager.js
import React, { useState } from 'react';
import { addCategory, deleteCategory } from '../../services/api';

const CategoryManager = ({ categories, onRefresh }) => {
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { data, error } = await addCategory(newCategory.trim());
      
      if (error) {
        setError(error.message || 'Failed to add category');
        setLoading(false);
        return;
      }

      setNewCategory('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      if (onRefresh) onRefresh();
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error adding category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will affect existing transactions.')) return;
    
    setDeleting(id);
    try {
      const { error } = await deleteCategory(id);
      
      if (error) {
        alert('Failed to delete category: ' + error.message);
        return;
      }
      
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('An unexpected error occurred');
      console.error('Error deleting category:', err);
    } finally {
      setDeleting(null);
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

          {error && <div style={{ color: '#d32f2f', marginBottom: '10px' }}>{error}</div>}
          {success && <div style={{ color: '#4caf50', marginBottom: '10px' }}>Category added successfully!</div>}

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
                  disabled={deleting === category.id}
                >
                  {deleting === category.id ? '⏳' : '✕'}
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
