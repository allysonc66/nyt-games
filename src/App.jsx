import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { FaLink, FaBolt, FaTable, FaQuoteLeft } from "react-icons/fa";
import "./App.css";
import Connections from "./Connections"; // Assuming this is your existing game component
import Strands from "./Strands"; // Placeholder for Strands game
import TheMini from "./TheMini"; // Placeholder for The Mini game
import Wordle from "./Wordle"; // Placeholder for Wordle game

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <ul>
          <li>
              <Link to="/connections"><FaLink /> Connections</Link>
            </li>
            <li>
              <Link to="/strands"><FaBolt /> Strands</Link>
            </li>
            <li>
              <Link to="/the-mini"><FaTable /> The Mini</Link>
            </li>
            <li>
              <Link to="/wordle"><FaQuoteLeft /> Wordle</Link>
            </li>
          </ul>
        </nav>
        <div className="game-container">
          <Routes>
            <Route path="/connections" element={<Connections />}/>
            <Route path="/strands"  element={<Strands />} />
            <Route path="/the-mini"  element={<TheMini />} />
            <Route path="/wordle"  element={<Wordle />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;