import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateItem = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
      const token = sessionStorage.getItem('JWT');

      if (!token) {
        console.log('JWT token not found in sessionStorage');
        return navigate('/login');
      }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newItem = {
      name: name,
      price: parseFloat(price)
    };

    try {
      const token = sessionStorage.getItem('JWT');

      if (!token) {
        console.log('JWT token not found in sessionStorage');
        return navigate('/login');
      }

      const response = await fetch('/api/items/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        navigate('/items');
      } else {
        console.error(response);
        navigate('/error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      navigate('/error');
    }
  };

  return (
    <div>
      <h2>Create Item</h2>
      <form onSubmit={handleSubmit}>
        <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Name'
              required
        />
        <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder='Price (£)'
              required
        />
        <br />
        <button type="submit" className='create'>Create Item</button>
      </form>
      <a href='/items' className='back'>
        <button>Back</button>
      </a>
    </div>
  );
};

export default CreateItem;
