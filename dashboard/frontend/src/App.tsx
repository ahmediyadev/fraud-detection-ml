import './App.css'
import './index.css'
import Home from './components/Home/Home'
import Detection from './components/Detection/Detection'
import Navbar from './components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/detection' element={<Detection />} />
      </Routes>
    </>
  )
}

export default App