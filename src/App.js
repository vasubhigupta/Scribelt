import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from './components/Navbar';
import Home from './components/Home'
import About from './components/About'
import NoteState from './context/notes/NotesState';

function App() {
  return (
    <BrowserRouter>
     <NoteState >   
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
              </Routes> 
    </NoteState>
    </BrowserRouter >
  )
}

export default App;
