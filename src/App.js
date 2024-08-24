import React, { useEffect } from 'react'; // Removed useState import
import PropTypes from 'prop-types'; // Ensure 'prop-types' is listed in dependencies
import './App.css'; // Ensure you have appropriate styles for the drum machine

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

// Debounce function to limit the rate of function calls
const debounce = (func, delay) => {
  let timerId;
  return (...args) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delay);
  };
};

function DrumPad({ pad, playSound }) {
  return (
    <div
      id={pad.sound}
      className="drum-pad"
      onClick={() => playSound(pad.key)}
      aria-label={pad.sound}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => e.key === 'Enter' && playSound(pad.key)} // Added keyboard interaction
    >
      {pad.key}
      <audio className="clip" id={pad.key} src={pad.src}>
        <track kind="captions" label="English" />
      </audio>
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

function App() {
  const playSound = debounce((key) => {
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
      try {
        audioElement.play().then(() => {
          audioElement.setAttribute('playing', 'true');
        });
      } catch {
        // console.error('Error playing audio:', error); // Commented out
      }
    }
  }, 100); // 100ms debounce delay

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
  }, [playSound]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My Drum Machine</h1>
        <p>Get ready to make some beats!</p>
        <nav>
          <ul>
            <li><a href="#drums">Drums</a></li>
            <li><a href="#patterns">Patterns</a></li>
            <li><a href="#settings">Settings</a></li>
          </ul>
        </nav>
        <a
          className="App-link"
          href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn about Web Audio API
        </a>
      </header>
      <main>
        <section id="drums">
          {drumPads.map((pad) => (
            <DrumPad key={pad.key} pad={pad} playSound={playSound} />
          ))}
        </section>
        <section id="patterns">
          {/* Pattern selector will go here */}
        </section>
        <section id="settings">
          {/* Volume and tempo controls will go here */}
        </section>
      </main>
    </div>
  );
}

export default App;
