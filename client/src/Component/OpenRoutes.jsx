import React from 'react'
import { Navigate } from 'react-router-dom'

const OpenRoutes = ({children}) => {
    const accessToken = localStorage.getItem('accessToken')
    if(accessToken){
        return <Navigate to ="/"/>
    }
  return (
    <div>
        {children}
    </div>
  )
}

export default OpenRoutes