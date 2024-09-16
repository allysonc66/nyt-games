import { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { FaLink, FaBolt, FaTable, FaQuoteLeft, FaBars, FaTimes } from "react-icons/fa";
import "./App.css";
import Connections from "./Connections"; // Assuming this is your existing game component
import Strands from "./Strands"; // Placeholder for Strands game
import TheMini from "./TheMini"; // Placeholder for The Mini game
import Wordle from "./Wordle"; // Placeholder for Wordle game

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    console.log("HERE", isDrawerOpen)
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Router>
      <div className="App">
        <button className="menu-button" onClick={toggleDrawer}>
          <FaBars />
        </button>
        <nav className={`navbar ${isDrawerOpen ? "open" : ""}`}>
          <button className="close-button" onClick={toggleDrawer}>
            <FaTimes />
          </button>
          <ul>
            <li>
              <Link to="/connections" onClick={toggleDrawer}><FaLink className="nav-icon" /> Connections</Link>
            </li>
            <li>
              <Link to="/strands" onClick={toggleDrawer}><FaBolt className="nav-icon" /> Strands</Link>
            </li>
            <li>
              <Link to="/the-mini" onClick={toggleDrawer}><FaTable className="nav-icon" /> The Mini</Link>
            </li>
            <li>
              <Link to="/wordle" onClick={toggleDrawer}><FaQuoteLeft className="nav-icon" /> Wordle</Link>
            </li>
          </ul>
        </nav>
        <div className="game-container">
          <Routes>
            <Route path="/connections" element={<Connections />} />
            <Route path="/strands" element={<Strands />} />
            <Route path="/the-mini" element={<TheMini />} />
            <Route path="/wordle" element={<Wordle />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;