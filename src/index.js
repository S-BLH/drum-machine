import React, { useState, useEffect } from 'react'; // Ensure React, useState, useEffect are imported
import ReactDOM from 'react-dom/client'; // Ensure ReactDOM is imported
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import './index.css'; // Import the CSS file

const drumPads = [
  { key: 'Q', sound: 'Heater 1', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3' },
  { key: 'W', sound: 'Heater 2', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3' },
  { key: 'E', sound: 'Heater 3', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3' },
  { key: 'A', sound: 'Heater 4', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3' },
  { key: 'S', sound: 'Clap', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3' },
  { key: 'D', sound: 'Open-HH', src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3' },
  { key: 'Z', sound: 'Kick-n\'-Hat', src: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3' },
  { key: 'X', sound: 'Kick', src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3' },
  { key: 'C', sound: 'Closed-HH', src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3' },
];

function DrumPad({ pad, playSound }) {
  return (
    <div
      id={pad.sound}
      className="drum-pad"
      onClick={() => playSound(pad.key)}
      onKeyDown={(e) => e.key === 'Enter' && playSound(pad.key)} // Add keyboard support
      aria-label={pad.sound}
      role="button"
      tabIndex="0" // Ensure tabIndex is present for focusability
    >
      {pad.key}
      <audio className="clip" id={pad.key} src={pad.src} />
    </div>
  );
}

DrumPad.propTypes = {
  pad: PropTypes.shape({
    key: PropTypes.string.isRequired,
    sound: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
  }).isRequired,
  playSound: PropTypes.func.isRequired,
};

function DrumMachine() {
  const [display, setDisplay] = useState('');

  const playSound = (key) => {
    // Stop any currently playing audio
    const currentlyPlaying = document.querySelector('.clip[playing="true"]');
    if (currentlyPlaying) {
      currentlyPlaying.pause();
      currentlyPlaying.currentTime = 0;
      currentlyPlaying.removeAttribute('playing');
    }

    const audioElement = document.getElementById(key);
    if (audioElement) {
      audioElement.currentTime = 0; // Reset audio to start
      audioElement.play().catch(() => {
        // Error handling can be more sophisticated or use a logger
      });
      audioElement.setAttribute('playing', 'true');

      const pad = drumPads.find((pad) => pad.key === key);
      setDisplay(pad.sound);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toUpperCase();
      if (drumPads.some((pad) => pad.key === key)) {
        playSound(key);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div id="drum-machine">
      <div id="display">{display}</div>
      {drumPads.map((pad) => (
        <DrumPad key={pad.key} pad={pad} playSound={playSound} />
      ))}
    </div>
  );
}

// Update to use ReactDOM.createRoot
ReactDOM.createRoot(document.getElementById('root')).render(<DrumMachine />);
