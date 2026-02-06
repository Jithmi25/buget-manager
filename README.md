# Budget Manager

A modern, full-featured budget management application built with React and Supabase. Track your income, expenses, set budgets, and visualize your spending patterns with an intuitive user interface.

## Features

- 📊 **Transaction Management** - Track income and expenses with detailed categorization
- 💰 **Budget Planning** - Set weekly or monthly budgets for different categories
- 📈 **Analytics & Reports** - Visualize spending patterns with charts and monthly reports
- 👤 **User Authentication** - Secure signup, login, password reset, and Google authentication
- 🎨 **Customizable Profiles** - Personalize your experience with currency, language, and theme preferences
- 🔒 **Protected Routes** - Secure dashboard with authentication required
- 🌐 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19, React Router DOM
- **Backend**: Supabase (PostgreSQL database, Authentication)
- **Build Tool**: Vite with Rolldown
- **Icons**: React Icons
- **3D Graphics**: Three.js
- **Styling**: CSS

## Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- npm or yarn package manager
- A Supabase account and project

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd buget-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the SQL commands from `database-setup.sql`

## Usage

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Project Structure

```
buget-manager/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, videos, and other media
│   ├── components/      # React components
│   │   ├── Analytics/   # Charts and reports
│   │   ├── Auth/        # Authentication components
│   │   ├── Dashboard/   # Main dashboard
│   │   ├── Home/        # Landing page
│   │   ├── Layout/      # Layout components
│   │   └── ProtectedRoute/ # Route protection
│   ├── context/         # React context providers
│   ├── lib/             # Library configurations
│   ├── services/        # API services
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── database-setup.sql   # Database schema
├── .env                 # Environment variables (not in git)
├── package.json         # Project dependencies
└── vite.config.js       # Vite configuration
```

## Database Schema

The application uses the following main tables:

- **profiles** - User profile information (currency, language, theme)
- **transactions** - Income and expense records
- **categories** - User-defined transaction categories
- **budgets** - Budget limits for categories (weekly/monthly)

## Key Features Explained

### Authentication

- Email/password authentication
- Google OAuth integration
- Password reset functionality
- Protected routes for authenticated users

### Transaction Management

- Add, view, and categorize transactions
- Track both income and expenses
- Date-based transaction history

### Budget Tracking

- Set budgets by category
- Weekly or monthly budget periods
- Monitor spending against budget limits

### Analytics

- Visual spending charts
- Monthly financial reports
- Category-wise expense breakdown

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue in the repository.

## Acknowledgments

- Built with [React](https://react.dev/)
- Database and auth powered by [Supabase](https://supabase.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- 3D graphics with [Three.js](https://threejs.org/)
