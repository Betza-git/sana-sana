import React, { useEffect, useState } from 'react';
import '../styles/Hero.css';
import { getData } from '../services/llamados';
import { Link } from 'react-router-dom';

function Heroinfoheader() { 
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    const cargarEspecialidades = async () => { 
      try {
        const datos = await getData("api/especialidades/");
        console.log(datos);
        setEspecialidades(datos);
      } catch (error) {
        console.error("Error cargando especialidades:", error);
      }
    };
    cargarEspecialidades();
  }, []);
  
  return (
    <div className='cont-hero'>
      <img src="../src/imagenes/Hero.png" alt="Imagen Hero" />
      <div className='cont-text'>
        <h1>Bienvenidos a su sitio web para el tratamiento del estrés laboral</h1>
        <div className='hero-busqueda'>
          <input
            className='busq'
            placeholder='Buscar por palabra'
            type="text"
          />

          <select className='form-select'>
            <option value="">Seleccione una especialidad</option>
            {especialidades.map((esp) => (
              <option key={esp.id} value={esp.nombre}>
                {esp.nombre}
              </option>
            ))}
          </select>

          <Link to='/servicios'>
            <button className="hero">Buscar</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Heroinfoheader;
