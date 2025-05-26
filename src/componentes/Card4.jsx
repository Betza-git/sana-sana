import React from 'react'
import '../styles/Card4.css'

const Card4 = ({ icono, titulo, button }) => {
  return (
      
    <div className='card4-container'>
      <i class="fa-solid fa-user"></i>
        <h2>{titulo}</h2>
        <button className='btncard4'>{button}</button>
        
    </div>
  )
}

export default Card4 