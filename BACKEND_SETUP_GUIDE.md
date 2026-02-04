# Supabase Backend Setup Guide

## Overview

Your budget manager is now fully integrated with Supabase as the backend database. This guide will help you set up and configure your Supabase project.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your project's Supabase URL and anon key (already in .env file)

## Database Setup

### 1. Create Database Tables

The SQL schema is already provided in `database-setup.sql`. Run this in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `database-setup.sql`
4. Click "Run" to execute the schema

This will create:

- **categories** table - Store user-defined transaction categories
- **transactions** table - Store income and expense transactions
- **budgets** table - Store budget limits for categories

### 2. Row Level Security (RLS)

The SQL schema automatically enables RLS policies to ensure:

- Users can only access their own data
- All CRUD operations are restricted to authenticated users
- Complete data isolation between users

### 3. Authentication Setup

#### Email/Password Authentication

Already enabled by default in Supabase. Users can:

- Sign up with email and password
- Log in with email and password
- Reset passwords via email

#### Google OAuth (Optional)

To enable Google sign-in:

1. Go to Authentication → Providers in Supabase dashboard
2. Enable Google provider
3. Add your OAuth credentials:
   - Get credentials from Google Cloud Console
   - Add authorized redirect URIs:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
4. Save the configuration

## Project Structure

### Backend Integration Files

```
src/
├── services/
│   └── api.js                    # Database operations (CRUD)
├── context/
│   └── AuthContext.jsx           # Authentication state management
├── lib/
│   └── supabase.js              # Supabase client & auth functions
└── components/
    ├── ProtectedRoute/
    │   └── ProtectedRoute.jsx   # Route protection wrapper
    ├── Auth/
    │   ├── Login.jsx            # Login with Supabase
    │   ├── SignUp.jsx           # Sign up with Supabase
    │   └── ForgotPassword.jsx   # Password reset
    └── Dashboard/
        ├── Dashboard.jsx        # Main dashboard with data
        ├── AddTransaction.jsx   # Add transactions to DB
        ├── TransactionList.jsx  # Display & delete transactions
        ├── BudgetPlanner.jsx    # Manage budgets
        └── CategoryManager.jsx  # Manage categories
```

### Key Features Implemented

#### Authentication (AuthContext)

- Automatic session management
- Protected routes
- Sign in/Sign up/Sign out
- OAuth with Google
- Password reset

#### API Services (services/api.js)

**Transactions:**

- `getTransactions()` - Fetch all user transactions
- `addTransaction(transaction)` - Create new transaction
- `updateTransaction(id, updates)` - Update existing transaction
- `deleteTransaction(id)` - Delete transaction

**Budgets:**

- `getBudgets()` - Fetch all user budgets
- `addBudget(budget)` - Create new budget
- `updateBudget(id, updates)` - Update existing budget
- `deleteBudget(id)` - Delete budget

**Categories:**

- `getCategories()` - Fetch all user categories
- `addCategory(name)` - Create new category
- `updateCategory(id, name)` - Update category name
- `deleteCategory(id)` - Delete category

**Analytics:**

- `getSpendingByCategory(startDate, endDate)` - Get spending breakdown
- `getMonthlyTrends(months)` - Get income vs expense trends

## Environment Variables

Your `.env` file contains:

```env
VITE_SUPABASE_URL=https://uyeucfetuikbgjatbgfv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are already configured. Never commit the actual keys to version control!

## Testing the Application

### 1. Run the Application

```bash
npm run dev
```

### 2. Test Authentication

- Visit http://localhost:5173
- Click "Get Started" or "Sign In"
- Create a new account
- Check your email for verification link (if email confirmation is enabled)

### 3. Test Dashboard Features

Once logged in, test:

- **Add Transaction**: Create income/expense entries
- **View Transactions**: See all transactions with real-time updates
- **Create Budgets**: Set spending limits for categories
- **Manage Categories**: Add/remove custom categories
- **Sign Out**: Test logout functionality

### 4. Test Data Persistence

- Add some transactions
- Sign out
- Sign back in
- Verify data persists correctly

## Security Considerations

1. **Row Level Security**: All tables have RLS enabled
2. **Authentication Required**: Users must be logged in to access data
3. **User Isolation**: Each user can only see their own data
4. **Secure Communication**: All requests use HTTPS
5. **Anon Key**: The public anon key is safe to expose (limited permissions)

## Common Issues & Solutions

### Issue: "Supabase env vars are missing"

**Solution**: Check that your `.env` file exists and contains both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Issue: Authentication not working

**Solution**:

- Verify Supabase credentials in `.env`
- Check Supabase dashboard for authentication settings
- Ensure email confirmation is disabled for testing (or check email)

### Issue: Data not loading

**Solution**:

- Check browser console for errors
- Verify database tables exist in Supabase
- Ensure RLS policies are created correctly

### Issue: "Failed to fetch"

**Solution**:

- Check internet connection
- Verify Supabase project is active
- Check Supabase dashboard for any service issues

## Next Steps

### Enhancements to Consider

1. **Email Verification**
   - Enable in Supabase → Authentication → Settings
   - Customize email templates

2. **Profile Management**
   - Add user profile updates
   - Avatar upload with Supabase Storage
   - Currency preferences

3. **Advanced Analytics**
   - Charts and graphs (integrate Chart.js or Recharts)
   - Export data to CSV/PDF
   - Recurring transactions

4. **Notifications**
   - Budget alerts
   - Email notifications for large expenses
   - Weekly/monthly summaries

5. **Multi-currency Support**
   - Add currency field to profile
   - Automatic conversion rates

## Database Schema Overview

### Categories Table

```sql
- id (UUID, primary key)
- user_id (UUID, references auth.users)
- name (VARCHAR)
- created_at (TIMESTAMP)
```

### Transactions Table

```sql
- id (UUID, primary key)
- user_id (UUID, references auth.users)
- type (VARCHAR: 'income' or 'expense')
- amount (DECIMAL)
- category (VARCHAR)
- description (TEXT)
- date (DATE)
- created_at (TIMESTAMP)
```

### Budgets Table

```sql
- id (UUID, primary key)
- user_id (UUID, references auth.users)
- category (VARCHAR)
- amount (DECIMAL)
- period (VARCHAR: 'weekly' or 'monthly')
- created_at (TIMESTAMP)
```

## Support & Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [React Authentication Guide](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Troubleshooting Commands

Check Supabase connection:

```javascript
// In browser console
import { supabase } from "./src/lib/supabase";
const { data, error } = await supabase.auth.getSession();
console.log(data, error);
```

Test database query:

```javascript
// In browser console (when logged in)
const { data, error } = await supabase.from("transactions").select("*");
console.log(data, error);
```

---

**Your budget manager is now fully integrated with Supabase!** 🎉

All authentication, data storage, and real-time synchronization are handled by Supabase's robust backend infrastructure.
