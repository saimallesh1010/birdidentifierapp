import React, { useEffect, useState } from 'react';
import './HistoryPage.css';

const HistoryPage = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:5000/uploads');
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    try {
      const res = await fetch('http://localhost:5000/uploads', {
        method: 'DELETE',
      });
      const data = await res.json();
      alert(data.message);
      setImages([]);
    } catch (err) {
      alert('Failed to delete history');
    }
  };

  return (
    <div className="history-page">
      <h2>User Upload History</h2>
      <button className="clear-btn" onClick={handleClearHistory}>
        Delete All History
      </button>
      <div className="image-grid">
        {images.map((url, idx) => (
          <div key={idx} className="image-card">
            <img src={`http://localhost:5000${url}`} alt={`Upload ${idx}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
