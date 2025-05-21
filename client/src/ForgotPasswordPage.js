import React, { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordHintVisible, setPasswordHintVisible] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');

  const isPasswordValid = (password) => {
    const lengthRegex = /^.{6,}$/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*]/;
    return lengthRegex.test(password) && numberRegex.test(password) && specialCharRegex.test(password);
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!isPasswordValid(newPassword)) {
      setMessage('❌ Password must be at least 6 characters long and include a number and a special character (!@#$%^&*).');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMatchError('❌ Passwords do not match.');
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Password reset successful. You can now log in.');
        setPasswordMatchError('');
      } else {
        setMessage(data.message || '❌ Password reset failed.');
      }
    } catch (err) {
      setMessage('❌ Something went wrong.');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '100px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Reset Your Password</h2>
      <form onSubmit={handleReset}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>New Password</label>
        <input
          type="password"
          value={newPassword}
          onFocus={() => setPasswordHintVisible(true)}
          onBlur={() => setPasswordHintVisible(false)}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        {passwordHintVisible && (
          <div style={{ fontSize: '12px', color: '#555', marginBottom: '15px' }}>
            Password must be at least 6 characters and include a number and a special character (!@#$%^&*).
          </div>
        )}

        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (e.target.value !== newPassword) {
              setPasswordMatchError('❌ Passwords do not match.');
            } else {
              setPasswordMatchError('');
            }
          }}
          required
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        {passwordMatchError && (
          <div style={{ fontSize: '13px', color: '#c00', marginTop: '5px', marginBottom: '10px' }}>{passwordMatchError}</div>
        )}

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
          Reset Password
        </button>
      </form>
      {message && <div style={{ marginTop: '20px', textAlign: 'center', color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
};

export default ForgotPasswordPage;
