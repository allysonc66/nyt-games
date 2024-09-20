import { useState, useRef, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import StatsModal from "./components/StatsModal";
import Header from "./components/Header";
import InfoModal from "./components/InfoModal";

const crosswordData = {
  grid: [
    ["T", "A", "N", "", "G"],
    ["", "N", "", "", "R"],
    ["A", "G", "I", "T", "A"],
    ["", "L", "", "A", "P"],
    ["B", "E", "A", "C", "H"],
  ],
  numbering: [
    [1, 2, null, null, 3],
    [null, null, null, null, null],
    [4, null, null, 5, null],
    [null, null, null, 6, null],
    [7, null, null, null, null]
  ],
  clues: {
    across: [
      { number: 1, clue: "Opposite/Adjacent", answer: "TAN", directionName: "1 Across" },
      { number: 4, clue: "What seeing Mikko with another hat might give you", answer: "AGITA", directionName: "4 Across" },
      { number: 6, clue: "The creepiest man taught __ Euro", answer: "AP", directionName: "6 Across" },
      { number: 7, clue: "The fourth best place for pickleball, the best for a tan!", answer: "BEACH", directionName: "7 Across" },
    ],
    down: [
      { number: 2, clue: "It's acute or obtuse", answer: "ANGLE", directionName: "2 Down" },
      { number: 3, clue: "X and Y are often shown here", answer: "GRAPH", directionName: "3 Down" },
      { number: 5, clue: "Not tic or toe", answer: "TAC", directionName: "5 Down" },
    ]
  }
};

const TheMini = () => {
  const [userGrid, setUserGrid] = useLocalStorage("miniUserGrid",
    Array(5).fill(null).map(() => Array(5).fill(""))
  );
  const [stats, setStats] = useLocalStorage('gameStatsMini', {
    winDistribution: Array.from(new Array(0), () => 0),
    gamesFailed: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalGames: 0,
    successRate: 0,
  });
  const [selectedClue, setSelectedClue] = useLocalStorage('selectedClue', null);
  const [selectedCell, setSelectedCell] = useLocalStorage('cwSelectedCell', { row: null, col: null });
  const [direction, setDirection] = useState("across");
  const [isGameWon, setIsGameWon] = useState(false);
  const inputRefs = useRef(Array(5).fill(null).map(() => Array(5).fill(null)));
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);


  const handleInputChange = (e, rowIndex, colIndex) => {
    const value = e.target.value.toUpperCase();
    setUserGrid((prevGrid) => {
      const newGrid = prevGrid.map((row, rIdx) =>
        row.map((col, cIdx) =>
          rowIndex === rIdx && colIndex === cIdx ? value : col
        )
      );
      return newGrid;
    });

    // Move to the next cell and focus it
    if (direction === "across" || crosswordData.grid[rowIndex][colIndex + 1] === "") {
      if (value === "") {
        if (colIndex > 0) {
          inputRefs.current[rowIndex][colIndex - 1]?.focus();
          setSelectedCell({ row: rowIndex, col: colIndex - 1 });
        }
      } else if (colIndex < 4) {
        inputRefs.current[rowIndex][colIndex + 1]?.focus();
        setSelectedCell({ row: rowIndex, col: colIndex + 1 });
      }
    } else {
      if (value === "") {
        if (rowIndex > 0) {
          inputRefs.current[rowIndex - 1][colIndex]?.focus();
          setSelectedCell({ row: rowIndex - 1, col: colIndex });
        }
      } else if (rowIndex < 4) {
        inputRefs.current[rowIndex + 1][colIndex]?.focus();
        setSelectedCell({ row: rowIndex + 1, col: colIndex });
      }
    }
  };

  const handleCellClick = (rowIndex, colIndex) => {
    let newDirection = direction
    if (selectedCell.row === rowIndex && selectedCell.col === colIndex) {
      if ((colIndex - 1 < 0 || crosswordData.grid[rowIndex][colIndex - 1] === "") && (colIndex + 1 > 4 || crosswordData.grid[rowIndex][colIndex + 1] === "")) {
        newDirection = "down";
        setDirection(newDirection);
      } else if ((rowIndex - 1 < 0 || crosswordData.grid[rowIndex - 1][colIndex] === "") && (rowIndex + 1 > 4 || crosswordData.grid[rowIndex + 1][colIndex] === "")) {
        newDirection = "across";
        setDirection(newDirection);
      } else {
        newDirection = newDirection === "across" ? "down" : "across";
        setDirection(newDirection);
      }

    }
    else {
      setSelectedCell({ row: rowIndex, col: colIndex });
      if ((colIndex - 1 < 0 || crosswordData.grid[rowIndex][colIndex - 1] === "") && (colIndex + 1 > 4 || crosswordData.grid[rowIndex][colIndex + 1] === "")) {
        newDirection = "down";
        setDirection(newDirection);
      } else if ((rowIndex - 1 < 0 || crosswordData.grid[rowIndex - 1][colIndex] === "") && (rowIndex + 1 > 4 || crosswordData.grid[rowIndex + 1][colIndex] === "")) {
        newDirection = "across";
        setDirection(newDirection);
      }
    }
    // Set selected clue
    setClue(rowIndex, colIndex, newDirection);
  };

  const setClue = (row, col, curDirection) => {
    const { grid, numbering, clues } = crosswordData;
    
    if (curDirection === "across") {
      // Find the leftmost numbered cell in the same row, that is not separated by an empty string
      let startCol = col;
      while (startCol > 0 && grid[row][startCol - 1] !== "") {
        startCol--;
      }
      const clueNumber = numbering[row][startCol];
      const selectedClue = clues.across.find(clue => clue.number === clueNumber);
      setSelectedClue(selectedClue)
    }
  
    if (curDirection === "down") {
      // Find the topmost numbered cell in the same column, that is not separated by an empty string
      let startRow = row;
      while (startRow > 0 && grid[startRow - 1][col] !== "") {
        startRow--;
      }
      const clueNumber = numbering[startRow][col];
      const selectedClue = clues.down.find(clue => clue.number === clueNumber);
      setSelectedClue(selectedClue)
    }
  
    return null;
  }

  // Check game winning or losing
  useEffect(() => {
    let isEqual = true;
    for (let i = 0; i < userGrid.length; i++) {
      for (let j = 0; j < userGrid[i].length; j++) {
        // Check if elements at the same position are equal
        if (userGrid[i][j] !== crosswordData.grid[i][j]) {
          isEqual = false;
        };
      }
    }
    // check if user won by checking the userGrid against crosswordData.grid
    if (isEqual) {
      setIsGameWon(true);
      setTimeout(() => setIsStatsModalOpen(true), 1000);
    }
    // eslint-disable-next-line
  }, userGrid);

  const isHighlighted = (rowIndex, colIndex) => {
    // Function to check if the cell is part of the "across" sequence
    function highlightAcross() {
      // Check if the current cell is in the same row
      if (rowIndex !== selectedCell.row) return false;

      // Check if the cells between the selected cell and the current cell are non-empty
      const start = Math.min(selectedCell.col, colIndex);
      const end = Math.max(selectedCell.col, colIndex);

      for (let i = start; i <= end; i++) {
        if (crosswordData.grid[rowIndex][i] === "") return false;
      }

      return true;
    }

    // Function to check if the cell is part of the "down" sequence
    function highlightDown() {
      // Check if the current cell is in the same column
      if (colIndex !== selectedCell.col) return false;

      // Check if the cells between the selected cell and the current cell are non-empty
      const start = Math.min(selectedCell.row, rowIndex);
      const end = Math.max(selectedCell.row, rowIndex);

      for (let i = start; i <= end; i++) {
        if (crosswordData.grid[i][colIndex] === "") return false;
      }

      return true;
    }

    // Determine whether to highlight based on direction
    if (direction === "across") {
      return highlightAcross();
    } else if (direction === "down") {
      return highlightDown();
    }

    return false;
  }

  return (
    <div className="crossword-container">
      <Header
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        gameName="THE MINI"
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        gameName="THE MINI"
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        gameStats={stats}
        numberOfGuessesMade={0}
        isGameWon={isGameWon}
        isGameLost={false}
        isHardMode={false}
        guesses={0}
        showAlert={false}
        gameName="THE MINI"
      />
      <div className="crossword-grid">
        <table>
          <tbody>
            {crosswordData.grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => {
                  const clueNum = crosswordData.numbering[rowIndex][colIndex];
                  const isSelected = selectedCell.row === rowIndex && selectedCell.col === colIndex;
                  return (
                    <td
                      key={colIndex}
                      className={cell === "" ? "black-cell" : isSelected ? "selected-cell" : isHighlighted(rowIndex, colIndex) ? "highlighted-cell" : "white-cell"}
                      onClick={() => cell !== null && handleCellClick(rowIndex, colIndex)}
                    >
                      {cell !== "" && clueNum && (
                        <div className="clue-number">{clueNum}</div>
                      )}
                      {cell !== "" && (
                        <input
                          type="text"
                          maxLength="1"
                          value={userGrid[rowIndex][colIndex]}
                          onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                          className="crossword-input"
                          ref={(el) => (inputRefs.current[rowIndex][colIndex] = el)}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClue && (
        <div className="selected-clue">
          <strong>{selectedClue.directionName}: </strong>{selectedClue.clue}
        </div>
      )}

      <div className="all-clues">
        <h3>All Hints</h3>
        <h4>Across</h4>
        <ul>
          {crosswordData.clues.across.map((clue, idx) => (
            <li key={idx}>
              <strong>{clue.number}</strong>. {clue.clue}
            </li>
          ))}
        </ul>
        <h4>Down</h4>
        <ul>
          {crosswordData.clues.down.map((clue, idx) => (
            <li key={idx}>
              <strong>{clue.number}</strong>. {clue.clue}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TheMini;
