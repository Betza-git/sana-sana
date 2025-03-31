import React from 'react'
import '../styles/Card1.css'


const Card1 = ({ titulo,icono,cantidad,lugar,cantidad2,sitio }) => {
  return (
    <>
      <div className='card-container'>
        <section className='card-section'>
        <i className={icono}></i>
          <h3>{titulo}</h3>
        </section>
        <div className='card-info'>
          <div className='card-info-number'>
            <p>{cantidad}</p>
            <p>{lugar}</p>
          </div>
          <div>
            <p>{cantidad2}</p>
            <p>{sitio}</p>
          </div>
        </div>
      </div>
    
    </>

  )
}

export default Card1