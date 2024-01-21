import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TotalItems = () => {
  const navigate = useNavigate();
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = sessionStorage.getItem('JWT');

        if (!token) {
          console.log('JWT token not found in sessionStorage');
          return navigate('/login');
        }

        const response = await fetch('/api/items/total', {
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
        setItem(data);
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
      <h2>Item Summary</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item Count</th>
              <th>Total Cost [Sum of all items] (£)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{item.count}</td>
              <td>{item.total}</td>
            </tr>
          </tbody>
        </table>
      )}
      <a href='/items' className='back'>
        <button>Back</button>
      </a>
    </div>
  );
};

export default TotalItems;
