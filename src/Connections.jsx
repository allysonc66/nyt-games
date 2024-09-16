import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";
import useLocalStorage from './hooks/useLocalStorage';
import useAlert from './hooks/useAlert';
import InfoModal from "./components/InfoModal";
import StatsModal from "./components/StatsModal";
import SettingModal from "./components/SettingModal";
import { addStatsForCompletedGame } from "./lib/words";

const MAX_GUESSES = 4;

const Connections = () => {
  // Define 4 categories with their respective words and labels
  const categories = {
    blue: { name: "U2 Songs", words: ["Desire", "Bad", "One", "Invisible"] },
    yellow: { name: "Circle Geometry Terms", words: ["Chord", "Arc", "Tangent", "Area"] },
    green: { name: "Words that mean 'Teach'", words: ["Illuminate", "Verse", "Coach", "Guide"] },
    purple: { name: "Palindromes", words: ["Noon", "Mom", "Civic", "Level"] },
  };

  // Create a list of words by flattening the categories
  const words = Object.entries(categories).flatMap(([category, { words }]) =>
    words.map((word) => ({ text: word, category }))
  );

  // Shuffle words for randomness
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  // State for shuffled words, selected words, correct groups, and the answer key
  const [highContrast, setHighContrast] = useLocalStorage(
    'high-contrast',
    false
  );
  const [stats, setStats] = useLocalStorage('gameStatsConnections', {
    winDistribution: Array.from(new Array(MAX_GUESSES), () => 0),
    gamesFailed: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalGames: 0,
    successRate: 0,
  });
  const [shuffledWords, setShuffledWords] = useState(shuffleArray(words));
  const [selectedWords, setSelectedWords] = useState([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [correctGroups, setCorrectGroups] = useLocalStorage('correctGroupsConnections', []);
  const [answerKey, setAnswerKey] = useLocalStorage('answerKeyConnections', []);
  const [shake, setShake] = useState(false);
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const [isHighContrastMode, setIsHighContrastMode] = useState(highContrast);
  const [guesses, setGuesses] = useLocalStorage('guessesConnections', []);
  let showAlert = useAlert();
  if (!showAlert) {
    showAlert = false
  } else {
    showAlert = showAlert.showAlert
  }

  // Handle word selection (toggle on/off)
  const handleWordClick = (word) => {
    if (correctGroups.some(item => item.text === word.text)) return;
    if (selectedWords.some((w) => w.text === word.text)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  // Handle submission
  const handleSubmit = () => {
    if (selectedWords.length === 4) {
      // Check if all selected words are from the same category
      const category = selectedWords[0].category;
      const allSameCategory = selectedWords.every(
        (word) => word.category === category
      );

      if (allSameCategory) {
        // Add the words to the correct group
        setCorrectGroups([...correctGroups, ...selectedWords]);
        setAnswerKey([...answerKey, category]); // Add the category to the answer key
        setSelectedWords([]);
        setStats(addStatsForCompletedGame(stats, guesses.length));
      } else {
        // Trigger shake animation and clear selection
        setGuesses(guesses + 1);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }

      if (guesses >= MAX_GUESSES) {
        setStats(addStatsForCompletedGame(stats, guesses.length));
      }
    }
  };

  useEffect(() => {
    if (correctGroups.length === 4) {
      setIsGameWon(true);
      setTimeout(() => setIsStatsModalOpen(true), 1000);
    }

    if (guesses >= MAX_GUESSES) {
      setIsGameLost(true);
      setTimeout(() => setIsStatsModalOpen(true), 1000);
    }
    // eslint-disable-next-line
  }, correctGroups);

  useEffect(() => {
    if (isDarkMode) document.body.setAttribute('data-theme', 'dark');
    else document.body.removeAttribute('data-theme');

    if (isHighContrastMode)
      document.body.setAttribute('data-mode', 'high-contrast');
    else document.body.removeAttribute('data-mode');
  }, [isDarkMode, isHighContrastMode]);

  const handleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const handleHighContrastMode = () => {
    setIsHighContrastMode(!isHighContrastMode);
    setHighContrast(!isHighContrastMode);
  };

  // Handle shuffle
  const handleShuffle = () => {
    setShuffledWords(shuffleArray(shuffledWords));
  };

  return (
    <div className="App">
      <Header
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        gameName="CONNECTIONS"
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        gameName="CONNECTIONS"
      />
      <div className="word-grid">
        {shuffledWords.map((word) => (
          <button
            key={word.text}
            onClick={() => handleWordClick(word)}
            className={`word ${correctGroups.some(item => item.text === word.text)
                ? word.category
                : selectedWords.includes(word)
                  ? "selected"
                  : "gray"
              } ${shake && selectedWords.includes(word) ? "shake" : ""}`}
          >
            {word.text}
          </button>
        ))}
      </div>
      <div className="mistakes-remaining">
        Mistakes Remaining:  
        <div className="dots" style={{ display: 'inline-flex', gap: '5px' }}>
          {Array.from({ length: MAX_GUESSES - guesses }, (_, index) => (
            <span key={index} className="dot"></span>
          ))}
        </div>
      </div>
      <div className="controls">
        <button onClick={handleSubmit} disabled={selectedWords.length !== 4}>
          Submit
        </button>
        <button onClick={handleShuffle}>Shuffle</button>
      </div>
      {/* Answer Key Section */}
      <div className="answer-key">
        {answerKey.map((category) => ( // Specify the type for category
          <div key={category} className={`answer-bubble ${category}`}>
            {categories[category].name} {/* Show the category name in the answer key */}
          </div>
        ))}
      </div>
      <SettingModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        isHardMode={false}
        isDarkMode={isDarkMode}
        isHighContrastMode={isHighContrastMode}
        setIsHardMode={false}
        setIsDarkMode={handleDarkMode}
        setIsHighContrastMode={handleHighContrastMode}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        gameStats={stats}
        numberOfGuessesMade={guesses.length}
        isGameWon={isGameWon}
        isGameLost={isGameLost}
        isHardMode={false}
        guesses={guesses}
        showAlert={showAlert.showAlert}
      />
    </div>
  );
};

export default Connections;
