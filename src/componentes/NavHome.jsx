import React from 'react'
import '../styles/Home.css';
import { Link } from 'react-router-dom';


function NavHome() {
  return (
    <nav className='nav-home' >
      
      <ul className='nav-home-ul1'>
      <img  className='icono' src= "../src/imagenes/icono.png" alt="" width="35px"/>
        <li><Link to="/Login"><i className="fa-solid fa-user-shield"></i>Admin</Link></li>
        <li><Link to="/registro"><i className="fa-solid fa-address-card"   ></i> Registro</Link></li>
        <li><Link to="/login"><i className="fa-solid fa-right-to-bracket"   ></i>  Login </Link></li>
        <li> <i className="fa-solid fa-star"></i> Principal</li>
        <li> <i className="fa-solid fa-heart"></i> Favoritos</li>

        
      </ul>

      <ul className='nav-home-ul2'>
  <li>Home</li>
  <li><Link to="/Aboutus">Sobre Nosotros</Link></li>
  <li>Contacto</li>
  <li><Link to="/servicios">Servicios</Link></li>
  <li className='btnProfesional'>
    <Link to="/Ayuda">
      <button className="agregar-button">
        <i className="fa-solid fa-hospital"></i>
        Hablar con un profesional
      </button>
    </Link>
  </li>
</ul>

    </nav>
  )
}

export default NavHome