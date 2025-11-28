import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Home from './Component/Home'
import Main from './Component/Main';
import Register from './pages/Register';


const App = () => {
  return (
   <>
    <Router>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/main" element={<Main/>} />
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>

      </Routes>
      
    </Router>
   
   </>
  )
}

export default App