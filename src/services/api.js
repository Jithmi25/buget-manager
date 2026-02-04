// src/services/api.js
import { supabase } from '../lib/supabase';

// ============================================
// TRANSACTIONS API
// ============================================

/**
 * Fetch all transactions for the current user
 */
export const getTransactions = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { data: null, error };
  }
};

/**
 * Add a new transaction
 */
export const addTransaction = async (transaction) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: user.id,
          type: transaction.type,
          amount: parseFloat(transaction.amount),
          category: transaction.category,
          description: transaction.description || '',
          date: transaction.date
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { data: null, error };
  }
};

/**
 * Update an existing transaction
 */
export const updateTransaction = async (id, updates) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({
        type: updates.type,
        amount: parseFloat(updates.amount),
        category: updates.category,
        description: updates.description || '',
        date: updates.date
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating transaction:', error);
    return { data: null, error };
  }
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (id) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { error };
  }
};

// ============================================
// BUDGETS API
// ============================================

/**
 * Fetch all budgets for the current user
 */
export const getBudgets = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return { data: null, error };
  }
};

/**
 * Add a new budget
 */
export const addBudget = async (budget) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('budgets')
      .insert([
        {
          user_id: user.id,
          category: budget.category,
          amount: parseFloat(budget.amount),
          period: budget.period
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding budget:', error);
    return { data: null, error };
  }
};

/**
 * Update an existing budget
 */
export const updateBudget = async (id, updates) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('budgets')
      .update({
        category: updates.category,
        amount: parseFloat(updates.amount),
        period: updates.period
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating budget:', error);
    return { data: null, error };
  }
};

/**
 * Delete a budget
 */
export const deleteBudget = async (id) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting budget:', error);
    return { error };
  }
};

// ============================================
// CATEGORIES API
// ============================================

/**
 * Fetch all categories for the current user
 */
export const getCategories = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: null, error };
  }
};

/**
 * Add a new category
 */
export const addCategory = async (categoryName) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          user_id: user.id,
          name: categoryName
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding category:', error);
    return { data: null, error };
  }
};

/**
 * Update an existing category
 */
export const updateCategory = async (id, newName) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('categories')
      .update({ name: newName })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating category:', error);
    return { data: null, error };
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (id) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { error };
  }
};

// ============================================
// ANALYTICS API
// ============================================

/**
 * Get spending by category for analytics
 */
export const getSpendingByCategory = async (startDate, endDate) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('transactions')
      .select('category, amount, type')
      .eq('user_id', user.id)
      .eq('type', 'expense');

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Group by category
    const categoryMap = {};
    data.forEach(transaction => {
      if (!categoryMap[transaction.category]) {
        categoryMap[transaction.category] = 0;
      }
      categoryMap[transaction.category] += parseFloat(transaction.amount);
    });

    return { 
      data: Object.entries(categoryMap).map(([category, amount]) => ({
        category,
        amount
      })),
      error: null 
    };
  } catch (error) {
    console.error('Error fetching spending by category:', error);
    return { data: null, error };
  }
};

/**
 * Get monthly income vs expense trends
 */
export const getMonthlyTrends = async (months = 6) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const { data, error } = await supabase
      .from('transactions')
      .select('date, amount, type')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;

    // Group by month and type
    const monthlyData = {};
    data.forEach(transaction => {
      const month = transaction.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        monthlyData[month].income += parseFloat(transaction.amount);
      } else {
        monthlyData[month].expense += parseFloat(transaction.amount);
      }
    });

    return { 
      data: Object.entries(monthlyData).map(([month, amounts]) => ({
        month,
        ...amounts
      })),
      error: null 
    };
  } catch (error) {
    console.error('Error fetching monthly trends:', error);
    return { data: null, error };
  }
};
