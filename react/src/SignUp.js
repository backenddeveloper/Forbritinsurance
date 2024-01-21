import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const jwtToken = sessionStorage.getItem('JWT');
    if (jwtToken) {
      navigate('/items');
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok)
      {
        navigate('/signup/sent')
      }
      else
      {
        console.error(response);
        navigate('/signup/failed')
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
      <a href='/login' className='logout'>
        <button>Or login</button>
      </a>
      <h1>Sign Up Form</h1>
      <form onSubmit={handleSignup}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
          />
        <button type="submit" className='signup'>Signup</button>
      </form>
    </div>
  );
};

const SignUpSent = () => (
    <div className="App">
        <h1>User Setup Requested</h1>
        <h2>Please check your email for a password creation link</h2>
        <a href='/login'>
          <button>Or login</button>
        </a>
    </div>
);

export { SignUp, SignUpSent };
