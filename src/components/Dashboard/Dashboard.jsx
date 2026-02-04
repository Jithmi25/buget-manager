// src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  getTransactions, 
  getBudgets, 
  getCategories 
} from '../../services/api';
import AddTransaction from './AddTransaction';
import TransactionList from './TransactionList';
import BudgetPlanner from './BudgetPlanner';
import CategoryManager from './CategoryManager';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut: authSignOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  useEffect(() => {
    calculateStats();
  }, [transactions]);

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    
    try {
      await Promise.all([
        fetchTransactions(),
        fetchBudgets(),
        fetchCategories()
      ]);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await getTransactions();
      
      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }
      
      setTransactions(data || []);
    } catch (err) {
      console.error('Unexpected error fetching transactions:', err);
    }
  };

  const fetchBudgets = async () => {
    try {
      const { data, error } = await getBudgets();
      
      if (error) {
        console.error('Error fetching budgets:', error);
        return;
      }
      
      setBudgets(data || []);
    } catch (err) {
      console.error('Unexpected error fetching budgets:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await getCategories();
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data || []);
    } catch (err) {
      console.error('Unexpected error fetching categories:', err);
    }
  };

  const calculateStats = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    setStats({
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    });
  };

  const handleSignOut = async () => {
    try {
      await authSignOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#d32f2f'
      }}>
        <p>{error}</p>
        <button onClick={loadAllData} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">Budget Manager</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            <span>Overview</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <span className="nav-icon">💳</span>
            <span>Transactions</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'budgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('budgets')}
          >
            <span className="nav-icon">🎯</span>
            <span>Budgets</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <span className="nav-icon">🏷️</span>
            <span>Categories</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleSignOut} className="logout-btn">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'transactions' && 'Transactions'}
              {activeTab === 'budgets' && 'Budget Planning'}
              {activeTab === 'categories' && 'Categories'}
            </h1>
            <p className="dashboard-subtitle">
              {activeTab === 'overview' && 'Your financial overview at a glance'}
              {activeTab === 'transactions' && 'Manage your income and expenses'}
              {activeTab === 'budgets' && 'Plan and track your budgets'}
              {activeTab === 'categories' && 'Organize your transaction categories'}
            </p>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card income-card">
                <div className="stat-icon">💵</div>
                <div className="stat-details">
                  <div className="stat-label">Total Income</div>
                  <div className="stat-value">Rs. {stats.totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
              
              <div className="stat-card expense-card">
                <div className="stat-icon">💸</div>
                <div className="stat-details">
                  <div className="stat-label">Total Expenses</div>
                  <div className="stat-value">Rs. {stats.totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
              
              <div className="stat-card balance-card">
                <div className="stat-icon">💰</div>
                <div className="stat-details">
                  <div className="stat-label">Current Balance</div>
                  <div className="stat-value">Rs. {stats.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>

            <div className="overview-grid">
              <div className="dashboard-card">
                <h3 className="card-title">Recent Transactions</h3>
                <TransactionList 
                  transactions={transactions.slice(0, 5)} 
                  onRefresh={fetchTransactions}
                  compact={true}
                />
              </div>
              
              <div className="dashboard-card">
                <h3 className="card-title">Quick Add Transaction</h3>
                <AddTransaction 
                  categories={categories}
                  onTransactionAdded={fetchTransactions}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-content">
            <div className="dashboard-card">
              <h3 className="card-title">Add New Transaction</h3>
              <AddTransaction 
                categories={categories}
                onTransactionAdded={fetchTransactions}
              />
            </div>
            <div className="dashboard-card">
              <h3 className="card-title">All Transactions</h3>
              <TransactionList 
                transactions={transactions} 
                onRefresh={fetchTransactions}
              />
            </div>
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="budgets-content">
            <div className="dashboard-card">
              <BudgetPlanner 
                budgets={budgets}
                categories={categories}
                transactions={transactions}
                onRefresh={fetchBudgets}
              />
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="categories-content">
            <div className="dashboard-card">
              <CategoryManager 
                categories={categories}
                onRefresh={fetchCategories}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
