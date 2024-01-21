import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Items = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = sessionStorage.getItem('JWT');

        if (!token) {
          console.log('JWT token not found in sessionStorage');
          return navigate('/login');
        }

        const response = await fetch('/api/items', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error(response);
          navigate('/error');
        }

        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/error');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [navigate]);

  return (
    <div>
      <a href='/logout' className='logout'>
        <button>Logout</button>
      </a>
      <h2>Item List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : items.length ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price (£)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <a href='/items/create' className='new'>
            <button>New</button>
          </a>
          <a href='/items/total' className='summary'>
            <button>Summary</button>
          </a>
        </div>
      ) : (
        <div>
          <h2>currently no items to show</h2>
          <a href='/items/create' className='new'>
            <button>New</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Items;
