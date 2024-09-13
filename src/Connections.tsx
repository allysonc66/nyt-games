import React, { useState } from "react";
import "./App.css";

// Define a word type with text, category, and display name for the category
type Word = {
  text: string;
  category: string;
};

type Category = {
  name: string;
  words: string[];
}

const Connections: React.FC = () => {
  // Define 4 categories with their respective words and labels
  const categories: { [key: string]: Category } = {
    blue: { name: "U2 Songs", words: ["Desire", "Bad", "One", "Invisible"] },
    yellow: { name: "Circle Geometry Terms", words: ["Chord", "Arc", "Tangent", "Area"] },
    green: { name: "Words that mean 'Teach'", words: ["Illuminate", "Verse", "Coach", "Guide"] },
    purple: { name: "Palindromes", words: ["Noon", "Mom", "Civic", "Level"] },
  };

  type CategoryKey = keyof typeof categories;


  // Create a list of words by flattening the categories
  const words: Word[] = Object.entries(categories).flatMap(([category, { words }]) =>
    words.map((word) => ({ text: word, category }))
  );

  // Shuffle words for randomness
  const shuffleArray = (array: Word[]) => [...array].sort(() => Math.random() - 0.5);

  // State for shuffled words, selected words, correct groups, and the answer key
  const [shuffledWords, setShuffledWords] = useState<Word[]>(shuffleArray(words));
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [correctGroups, setCorrectGroups] = useState<Word[]>([]);
  const [answerKey, setAnswerKey] = useState<CategoryKey[]>([]); // Change type to CategoryKey[]
  const [shake, setShake] = useState(false);

  // Handle word selection (toggle on/off)
  const handleWordClick = (word: Word) => {
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
      <h1>Connections Game</h1>
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
        {answerKey.map((category: CategoryKey) => ( // Specify the type for category
  <div key={category} className={`answer-bubble ${category}`}>
    {categories[category].name} {/* Show the category name in the answer key */}
  </div>
))}
      </div>
    </div>
  );
};

export default Connections;
