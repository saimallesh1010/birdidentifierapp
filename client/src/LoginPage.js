import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/main');
      } else {
        setMessage(data.message || 'Invalid credentials. Please sign up.');
      }
    } catch (error) {
      setMessage('❌ Something went wrong.');
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: "url('/login-background.jpg')", backgroundSize: 'cover', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="login-box" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '30px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.2)', maxWidth: '400px', width: '100%' }}>
        <h2 className="login-title" style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" className="login-btn" style={{ width: '100%', padding: '12px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
            Login
          </button>
        </form>
        {message && <div className="login-message" style={{ marginTop: '15px', textAlign: 'center', color: 'red' }}>{message}</div>}
        <p className="login-link" style={{ textAlign: 'center', marginTop: '15px' }}>Don't have an account? <a href="/signup">Sign up</a></p>
        <p className="login-link" style={{ textAlign: 'center' }}><a href="/forgot-password">Forgot Password?</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
