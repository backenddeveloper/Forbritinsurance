import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const jwtToken = sessionStorage.getItem('JWT');
    if (jwtToken) {
      navigate('/items');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok)
      {
        const token = await response.json()
        sessionStorage.setItem('JWT', token.JWT)
        navigate('/items')
      }
      else
      {
        navigate('/login/failed')
      }
    }
    catch(e)
    {
        console.log(e)
        navigate('/error')
    };
  };

  return (
    <div className="App">
      <a href='/signup' className='logout'>
        <button>Sign Up</button>
      </a>
      <h1>Login Form</h1>
      <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
          />
        <br />
        <button type="submit" className='login'>Login</button>
      </form>
    </div>
  );
};

export default Login;
