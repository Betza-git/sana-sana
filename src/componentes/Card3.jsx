import React from 'react'
import '../styles/Card3.css'

const Card3 = ({ titulo,icono,cantidad }) => {
  return (
    <div className='card3-container'>
      <section className='cont-icono'>
      <i className={icono}></i>
      </section>
      <div>
      <h2>{titulo}</h2>
      <p>{cantidad}</p>
      </div>
    </div> 
    
  )
} 

export default Card3