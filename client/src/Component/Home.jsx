import React, { useEffect } from 'react'
import axios from 'axios'

const Home = () => {
  console.log(localStorage.getItem('accessToken'));
  

  useEffect(()=>{
    axios.get('http://localhost:3000/menu', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`   // bearer means ye token la jana
      }
    })

  },[])
  return (
    <div>
      homepage
    </div>
  )
}

export default Home