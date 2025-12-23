// src/components/Dashboard/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Dashboard = () => {
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		navigate('/login');
	};

	return React.createElement(
		'div',
		{ style: { padding: 24 } },
		React.createElement('h1', null, 'Dashboard'),
		React.createElement('p', null, 'You are signed in.'),
		React.createElement(
			'button',
			{
				onClick: handleSignOut,
				style: {
					marginTop: 16,
					padding: '10px 16px',
					borderRadius: 8,
					border: 'none',
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					color: '#fff',
					cursor: 'pointer',
				},
			},
			'Sign Out'
		)
	);
};

export default Dashboard;
