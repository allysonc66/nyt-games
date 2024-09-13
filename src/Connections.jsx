import { useState } from "react";
import "./App.css";

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
  const [shuffledWords, setShuffledWords] = useState(shuffleArray(words));
  const [selectedWords, setSelectedWords] = useState([]);
  const [correctGroups, setCorrectGroups] = useState([]);
  const [answerKey, setAnswerKey] = useState([]); // Change type to CategoryKey[]
  const [shake, setShake] = useState(false);

  // Handle word selection (toggle on/off)
  const handleWordClick = (word) => {
    if (correctGroups.includes(word)) return;
    if (selectedWords.includes(word)) {
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
      } else {
        // Trigger shake animation and clear selection
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }
  };

  // Handle shuffle
  const handleShuffle = () => {
    setShuffledWords(shuffleArray(shuffledWords));
  };

  return (
    <div className="App">
      <h1>Connections</h1>
      <div className="word-grid">
        {shuffledWords.map((word) => (
          <button
            key={word.text}
            onClick={() => handleWordClick(word)}
            className={`word ${
              correctGroups.includes(word)
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
    </div>
  );
};

export default Connections;
