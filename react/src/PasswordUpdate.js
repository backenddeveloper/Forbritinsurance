import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PasswordUpdate = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmPassword] = useState('');
  const { signupcode } = useParams();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmation) {
      console.error("Passwords don't match");
      return;
    }

    try {
      const response = await fetch('/api/password/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signupcode, password, confirmation }),
      });

      if (response.ok) {
        console.log('Password updated successfully');
        navigate('/login');
      } else {
        console.error('Password update failed');
        navigate('/error');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      navigate('/error');
    }
  };

  return (
    <div className="App">
      <h1>Password Update</h1>
      <form onSubmit={handleUpdatePassword}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
	    placeholder='New Password'
            required
          />
        <br />
          <input
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmPassword(e.target.value)}
	    placeholder='Confirm Password'
            required
          />
        <br />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default PasswordUpdate;
