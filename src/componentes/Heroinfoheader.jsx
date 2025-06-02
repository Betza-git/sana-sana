import React, { use, useEffect } from 'react'
import '../styles/Hero.css'
import { getData } from '../services/llamados'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Heroinfoheader() { 
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(()=>{
    async function especialidad() { 
      const datos = await getData("api/especialidades/")
     console.log(datos) 

    
      setEspecialidades(datos)

      
    }
especialidad()

  },[])
  
  return (
    <>
    <div className='cont-hero'>
      <img src="../src/imagenes/Hero.png" alt=""  />
      <div className='cont-text'>
        <h1>Bienvenidos a su sitio web para en tratamiento del estrés laboral </h1>
        <div className='hero-busqueda'>
      <input className='busq' placeholder='Buscar por palabra' type="text" name="" id="" />
      

      <select name="" id=""> 

        <option value="">Seleccione una especialidad</option>
        {especialidades.map((esp)=>{
          return(
            <>
            <option value={esp.nombre}>{esp.nombre}</option>
            </>
          )
        })}
      </select>
      <Link to='/servicios'><button className="hero">Buscar</button></Link>
    </div>
    </div>
    </div>
    </>
  )
}

export default Heroinfoheader