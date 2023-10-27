import React, { useRef, useState } from 'react';
import axios from 'axios';
import EmotionVideo from './components/EmotionVideo';
import './App.css'; // Import your CSS file

function App() {
  const [emotion, setEmotion] = useState('');
  const videoRef = useRef();
  const canvasRef = useRef();

  const capture = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const takePicture = async () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 640, 480);

    canvasRef.current.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob);

      try {
        const response = await axios.post('http://localhost:5000/predict_emotion', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setEmotion(response.data.emotion);
      } catch (error) {
        console.error(error);
      }
    }, 'image/jpeg');
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Facial Emotion Recognition</h1>
      <div className="video-container">
        <video ref={videoRef} autoPlay />
      </div>
      <div className="button-container">
        <button className="capture-button" onClick={capture}>Start Camera</button>
        <button className="capture-button" onClick={takePicture}>Take Picture</button>
      </div>
      {emotion && (
        <p className="emotion-text">
          Emotion: <span className="emotion">{emotion}</span>
        </p>
      )}
      {emotion && <EmotionVideo emotion={emotion} />}
      <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
