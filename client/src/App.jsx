import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Register from './Component/Register';
import Login from './Component/Login';


const App = () => {
  return (
   <>
    <Router>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/Login' element={<Login/>}/>
      </Routes>
      
    </Router>
   
   </>
  )
}

export default App