import { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { FaLink, FaBolt, FaTable, FaQuoteLeft, FaBars, FaTimes } from "react-icons/fa";
import "./App.css";
import Connections from "./Connections"; 
import Strands from "./Strands"; 
import TheMini from "./TheMini"; 
import Wordle from "./Wordle"; 
import BirthdayHeader from "./components/BirthdayHeader";

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Router>
      <div className="App">
        <h1>New York Times Games</h1>
        <BirthdayHeader />
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