import React, { useState } from 'react';
import './MainPage.css';
import axios from 'axios';

const MainPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [birdName, setBirdName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
    setBirdName('');
  };

  const handlePredict = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await axios.post('http://localhost:5000/predict', formData);
      setBirdName(res.data.birdName);
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  return (
    <div className="main-page">
      <div className="main-box">
        <h1>Bird Identifier</h1>
        <input type="file" onChange={handleFileChange} />
        {previewURL && (
          <img src={previewURL} alt="Uploaded Bird" className="preview-image" />
        )}

        <div className="result-box">
          {birdName && (
            <>
              <h2>Prediction Result</h2>
              <p className="bird-name">{birdName}</p>
            </>
          )}
        </div>

        <div className="predict-area">
          <button className="predict-btn" onClick={handlePredict}>
            Predict
          </button>
        </div>

        <div className="history-link">
          <button className="history-btn" onClick={() => window.location.href = '/history'}>
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
