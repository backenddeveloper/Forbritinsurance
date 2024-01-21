import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {

  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem('JWT')
    navigate('/login');
  }, [navigate]);

  return (
    <div className="App">
      <h1>You have logged out</h1>
      <a href='/login'>If you are not automatically redirected, click here...</a>
    </div>
  );
};

export default Logout;
