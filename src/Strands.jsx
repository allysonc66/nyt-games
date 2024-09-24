// components/Strands.js
import { useState, useEffect } from "react";
import StatsModal from "./components/StatsModal";
import Header from "./components/Header";
import InfoModal from "./components/InfoModal";
import "./styles/strands.css";

const initialBoard = [
  ["L", "R", "E", "S", "B", "O", "L"],
  ["I", "E", "S", "T", "F", "H", "F"],
  ["C", "C", "E", "R", "C", "R", "N"],
  ["O", "I", "I", "V", "N", "E", "W"],
  ["F", "R", "A", "O", "T", "O", "R"],
  ["O", "L", "O", "R", "O", "P", "I"],
  ["H", "C", "L", "P", "C", "O", "B"],
  ["C", "A", "T", "E", "R", "N", "S"]
];

const correctWords = [
  "POPCORN",
  "RIBS",
  "LICORICE",
  "CHOCOLATE",
  "LOBSTER",
  "FRENCHFRIES"
];

const spangram = "FLAVORTOWN";

export default function Strands() {
  const [selectedWord, setSelectedWord] = useState("");
  const [letterElems, setLetterElems] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [draggedLetters, setDraggedLetters] = useState([]);
  const [lines, setLines] = useState([]);
  const [finalLines, setFinalLines] = useState([]);
  const [spangramLines, setSpangramLines] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [foundSpangram, setFoundSpangram] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [done, setDone] = useState(false);

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  useEffect(() => {
    if (dragging && letterElems.length > 1) {
      const newLines = letterElems.map((elem, index) => {
        if (index === 0) return null;
        const start = letterElems[index - 1].getBoundingClientRect();
        const end = elem.getBoundingClientRect();
        return {
          x1: start.left + start.width / 2,
          y1: start.top + start.height / 2,
          x2: end.left + end.width / 2,
          y2: end.top + end.height / 2,
        };
      });
      setLines(newLines.filter(Boolean));
    }
  }, [letterElems, dragging]);

  useEffect(() => {
    if (wordCount >= 7) {
      setDone(true);
      setTimeout(() => setIsStatsModalOpen(true), 100);
    }
  }, [wordCount]);

  function handleMouseDown(e) {
    e.preventDefault();
    setDragging(true);
    setSelectedWord("");
    setLetterElems([e.currentTarget]);
    setDraggedLetters([e.currentTarget.id]);
    e.currentTarget.classList.add("strands-selected");
  }

  function handleMouseOver(e) {
    if (dragging) {
      const newLetter = e.currentTarget.id;
      if (draggedLetters.includes(newLetter)) {
        const newDraggedLetters = [...draggedLetters];
        newDraggedLetters.pop();
        setDraggedLetters(newDraggedLetters);
        letterElems[letterElems.length - 1]?.classList.remove("strands-selected");
        const newLetterElems = [...letterElems];
        newLetterElems.pop();
        setLetterElems(newLetterElems);
        setSelectedWord(
          newDraggedLetters
            .map((id) => document.getElementById(id)?.innerText)
            .join("")
        );
        const newLines = [...lines];
        newLines.pop();
        setLines(newLines);
      } else {
        const newDraggedLetters = [...draggedLetters, newLetter];
        setLetterElems([...letterElems, e.currentTarget]);
        setDraggedLetters(newDraggedLetters);
        e.currentTarget.classList.add("strands-selected");
        setSelectedWord(
          newDraggedLetters
            .map((id) => document.getElementById(id)?.innerText)
            .join("") + e.currentTarget.innerText
        );
      }
    } else {
      letterElems.forEach((e) => e.classList.remove("strands-selected"));
    }
  }

  function handleMouseUp() {
    setDragging(false);
    setSelectedWord(
      draggedLetters
        .map((id) => document.getElementById(id)?.innerText)
        .join("")
    );

    checkWord();
    letterElems.forEach((e) => e.classList.remove("strands-selected"));
    setDraggedLetters([]);
    setLetterElems([]);
    setSelectedWord("");
  }
  
  function handleStart(e) {
    e.preventDefault();
    setDragging(true);
    setSelectedWord("");
    const target = e.targetTouches ? e.targetTouches[0].target : e.currentTarget;
    setLetterElems([target]);
    setDraggedLetters([target.id]);
    target.classList.add("strands-selected");
  }

  function handleMove(e) {
    if (dragging) {
      const target = e.targetTouches ? document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY) : e.currentTarget;
      if (!target || !target.classList.contains("letter")) return;

      const newLetter = target.id;
      if (draggedLetters.includes(newLetter)) {
        const newDraggedLetters = [...draggedLetters];
        newDraggedLetters.pop();
        setDraggedLetters(newDraggedLetters);
        letterElems[letterElems.length - 1]?.classList.remove("strands-selected");
        const newLetterElems = [...letterElems];
        newLetterElems.pop();
        setLetterElems(newLetterElems);
        setSelectedWord(
          newDraggedLetters
            .map((id) => document.getElementById(id)?.innerText)
            .join("")
        );
        const newLines = [...lines];
        newLines.pop();
        setLines(newLines);
      } else {
        const newDraggedLetters = [...draggedLetters, newLetter];
        setLetterElems([...letterElems, target]);
        setDraggedLetters(newDraggedLetters);
        target.classList.add("strands-selected");
        setSelectedWord(
          newDraggedLetters
            .map((id) => document.getElementById(id)?.innerText)
            .join("") + target.innerText
        );
      }
    } else {
      letterElems.forEach((e) => e.classList.remove("strands-selected"));
    }
  }

  function handleEnd() {
    setDragging(false);
    setSelectedWord(
      draggedLetters
        .map((id) => document.getElementById(id)?.innerText)
        .join("")
    );
    checkWord();
    letterElems.forEach((e) => e.classList.remove("strands-selected"));
    setDraggedLetters([]);
    setLetterElems([]);
    setSelectedWord("");
  }

  function checkWord() {
    const chosenWord = draggedLetters
      .map((id) => document.getElementById(id)?.innerText)
      .join("");
    if (correctWords.includes(chosenWord)) {
      letterElems.forEach(
        (e) =>
          (document.getElementById(e.id).style.backgroundColor = "#d6c0dd")
      );
      setFinalLines([...finalLines, ...lines]);
      setWordCount(wordCount + 1);
      setFoundWords([...foundWords, chosenWord]);
    } else if (chosenWord === spangram) {
      letterElems.forEach(
        (e) =>
          (document.getElementById(e.id).style.backgroundColor = "#ADD8E6")
      );
      setSpangramLines(lines);
      setWordCount(wordCount + 1);
      setFoundSpangram(draggedLetters);
    }
    setLines([]);
  }

  return (
    <div className="crossword-container">
      <Header
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        gameName="STRANDS"
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        gameName="STRANDS"
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        wordCount={wordCount}
        gameName="STRANDS"
      />
      <div className="riddle">
        <div className="theme">Lisa's Favorites</div>
      </div>
      <input className="display-word" readOnly value={selectedWord} />
      <div className="strands-body">
        <svg className="strands-svg">
          {finalLines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#d6c0dd"
              strokeWidth="8"
            />
          ))}
          {spangramLines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#ADD8E6"
              strokeWidth="8"
            />
          ))}
          {lines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgb(219, 216, 197)"
              strokeWidth="8"
            />
          ))}
        </svg>
        <div
          className="strands-board"
          onMouseLeave={handleMouseUp}
          onMouseUp={handleMouseUp}
        >
          {initialBoard.map((row, rowIndex) => (
            <div className="strands-row" key={rowIndex}>
              {row.map((letter, colIndex) => {
                const id = `${letter}-${rowIndex}-${colIndex}`;
                return (
                  <p
                    className="letter"
                    id={id}
                    key={id}
                    onMouseDown={handleMouseDown}
                    onMouseOver={handleMouseOver}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                    style={{
                      backgroundColor: foundWords.includes(id)
                        ? "#d6c0dd"
                        : foundSpangram.includes(id)
                        ? "#ADD8E6"
                        : "none",
                    }}
                  >
                    {letter}
                  </p>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="word-count-display">
        {wordCount} / 7 words found
    </div>
    </div>
  );  
}
