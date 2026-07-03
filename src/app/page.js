'use client';

import { useState, useEffect } from 'react';

export default function Home() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [user, setUser] = useState(null);
	const [token, setToken] = useState('');

	const fetchUserInfo = async authToken => {
		try {
			const res = await fetch('http://localhost:8000/api/user-info', {
				headers: {
					Authorization: `Bearer ${authToken}`
				}
			});
			if (res.ok) {
				const data = await res.json();
				setUser(data);
				setToken(authToken);
			} else {
				// Token might have expired
				localStorage.removeItem('sportsee_token');
				localStorage.removeItem('sportsee_userId');
			}
		} catch (err) {
			console.error('Error fetching user info:', err);
		}
	};

	// Restore session on mount
	useEffect(() => {
		const savedToken = localStorage.getItem('sportsee_token');
		const savedUserId = localStorage.getItem('sportsee_userId');
		if (savedToken && savedUserId) {
			const restoreSession = async () => {
				await fetchUserInfo(savedToken);
			};
			restoreSession();
		}
	}, []);

	const handleLogin = async e => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await fetch('http://localhost:8000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: email, // Maps email field to the API's username field
					password: password
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Identifiants invalides');
			}

			// Save to localStorage
			localStorage.setItem('sportsee_token', data.token);
			localStorage.setItem('sportsee_userId', data.userId);

			// Fetch details
			await fetchUserInfo(data.token);
		} catch (err) {
			setError(err.message || 'Une erreur est survenue lors de la connexion.');
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('sportsee_token');
		localStorage.removeItem('sportsee_userId');
		setUser(null);
		setToken('');
		setEmail('');
		setPassword('');
	};

	if (user) {
		// Logged-in profile / dashboard view
		return <div>dashboard</div>;
	}

	return (
		<main className="container-signin">
			{/* Left Panel */}
			<section className="left-panel">
				<header className="top-left-header-logo">
					<img src="/logo.png" alt="Sportsee Logo" className="logo-image" />
					<h1 className="brand-title">SPORTSEE</h1>
				</header>

				<div className="form-card">
					<form onSubmit={handleLogin}>
						<h2 className="form-h2">Transformez vos stats en résultats</h2>
						<h3 className="form-h3">Se connecter</h3>

						{error && <p className="error-message">{error}</p>}

						<div className="input-group">
							<label className="input-label" htmlFor="email">
								Adresse e-mail
							</label>
							<input id="email" type="text" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
						</div>

						<div className="input-group">
							<label className="input-label" htmlFor="password">
								Mot de passe
							</label>
							<input id="password" type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
						</div>

						<button type="submit" className="signin-button" disabled={loading}>
							{loading ? 'Connexion...' : 'Se connecter'}
						</button>

						<a
							href="#"
							className="forgot-password"
							onClick={e => {
								e.preventDefault();
								alert('Fonctionnalité non implémentée');
							}}
						>
							Mot de passe oublié ?
						</a>
					</form>
				</div>
			</section>

			{/* Right Panel */}
			<section className="right-panel">
				<div className="round-bubble">
					<p className="bubble-text">Analysez vos performances en un clin d&apos;œil, suivez vos progrès et atteignez vos objectifs.</p>
				</div>
			</section>
		</main>
	);
}
