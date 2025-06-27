import React from 'react'
import '../styles/Card5.css'


const Card5 = ({icono}) => {
    
  return (
    <div className='container-card5'>
        <h1>Lo que cuentan nuestros usuarios</h1>
        <p>ʻʻ Me encanta esta plataforma, me ha ayudado mucho a controlar mis emociones y a tener una vida más tranquila.ʻʻ</p>
        <div>
        <i className={icono}></i>
        <i className={icono}></i>
        <i className={icono}></i>
        </div>
        <h3>Especialidad de Psicología</h3>
    </div>
  )
}

export default Card5