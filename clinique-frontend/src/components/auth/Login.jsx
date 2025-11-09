import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      // Utiliser l'URL de redirection du backend
      const redirectUrl = result.redirectUrl || '/';
      console.log('Redirection vers:', redirectUrl);
      navigate(redirectUrl);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-form">
          <h2>Connexion</h2>
          <p className="auth-subtitle">Accédez à votre espace personnel</p>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="auth-button" 
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="auth-link">
            Pas de compte ? <Link to="/register">S'inscrire</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;