import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './Components/Navbar';
import Home from './Components/Home';
import About from './Components/About';
import Login from './Components/Login'; 
import Signup from './Components/Signup';
import NoteState from './contex/notes/NoteState';
import Alert from './Components/Alert';

function App() {
  return (
    <>
    <NoteState>
      <Router>
        <Navbar/> 
        <Alert message="This is Amazing React Project"/>
        <div className="container">
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        </div>
        
      </Router>
      </NoteState>
    </>
  );
}

export default App;
