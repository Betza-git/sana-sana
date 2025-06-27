import { useState, useEffect } from 'react'
import { getServicios } from '../services/Servicios'
import { Link } from 'react-router-dom'

function Servicios() {
  const [servicios, setServicios] = useState([])

  useEffect(() => {
    const getServiciosData = async () => {
      const serviciosData = await getServicios()
      setServicios(serviciosData)
    }
    getServiciosData()
  }, [])

  return (
    <div className='contservicios'>
      <div className='servicios'>
        <h1>Servicios de Nuestra red</h1>
        <div className='tarjetas-container'>
          {
            servicios.map(servicio => (
              <div key={servicio.id} className='tarjeta-servicio'>
                <h3><strong>{servicio.nombre}</strong> </h3>
                <h4>{servicio.especialidad}</h4>
                <p>{servicio.descripcion}</p>
                <p><strong>Precio:</strong> ₡{Number(servicio.precio).toLocaleString('es-CR', { minimumFractionDigits: 3 })}</p>
                <p><strong>Duración:</strong> {servicio.duracion}</p>
                <Link to={`/login`} className='link-servicio'>Agendar</Link><br/>
                <Link to={`/`} className='link-servicio'>Home</Link>
              </div>
              
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Servicios
