
import React from 'react';
import YouTube from 'react-youtube';
import './EmotionVideo.css';

const EmotionVideo = ({ emotion }) => {
  const videoOptions = {
    width: 640,
    height: 360,
  };

  const videoId = getVideoIdForEmotion(emotion);

  return (
    <div>
      <YouTube videoId={videoId} opts={videoOptions} />
    </div>
  );
};

function getVideoIdForEmotion(emotion) {
  switch (emotion) {
    case 'happy':
      return '1N9EFGj_x0Y';
    case 'sad':
      return 'xicvuiThi4Y';
    case 'angry':
      return 'Vbu_K41efvY';
    default:
      return 'Fy2wwyZMBEQ'; 
  }
}

export default EmotionVideo;
