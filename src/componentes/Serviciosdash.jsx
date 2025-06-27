import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { getServicios, postServicios, patchServicios, deleteServicios } from '../services/Servicios'
import { Link } from 'react-router-dom'

function Serviciosdash() {
  const [servicios, setServicios] = useState([])

  useEffect(() => {
    const getServiciosData = async () => {
      const serviciosData = await getServicios()
      setServicios(serviciosData)
    }
    getServiciosData()
  }, [])

  const limpiarPrecio = (precioTexto) => {
    const limpio = precioTexto.replace(/\./g, '').replace(',', '.')
    const numero = parseFloat(limpio)
    return isNaN(numero) ? 0 : numero
  }

  const agregarServicio = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Agregar Servicio',
      html: `
        <input id="nombre" className="swal2-input" placeholder="Nombre de la especialidad">
        <input id="descripcion" className="swal2-input" placeholder="Descripción">
        <input id="precio" className="swal2-input" placeholder="Precio (ej: 60,000)">
        <input id="duracion" className="swal2-input" placeholder="Duración (ej: 45 minutos)">
      `,
      focusConfirm: false,
      confirmButtonText: 'Guardar',
      preConfirm: () => {
        const nombre = document.getElementById('nombre').value.trim()
        const descripcion = document.getElementById('descripcion').value.trim()
        const precioTexto = document.getElementById('precio').value.trim()
        const duracion = document.getElementById('duracion').value.trim()

        if (!nombre || !descripcion || !precioTexto || !duracion) {
          Swal.showValidationMessage('Todos los campos son obligatorios')
          return false
        }

        const precio = limpiarPrecio(precioTexto)
        if (precio >= 10000000) {
          Swal.showValidationMessage('El precio no puede tener más de 7 dígitos antes del punto decimal')
          return false
        }

        return { nombre, descripcion, precio, duracion }
      }
    })

    if (formValues) {
      try {
        const nuevo = await postServicios(formValues)
        setServicios([...servicios, nuevo])
        Swal.fire('¡Agregado!', 'El servicio ha sido agregado.', 'success')
      } catch (error) {
        Swal.fire('Error', 'No se pudo agregar el servicio.', 'error')
      }
    }
  }

  const editarServicio = async (servicio) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Servicio',
      html: `
        <input id="nombre" className="swal2-input" value="${servicio.nombre}">
        <input id="descripcion" className="swal2-input" value="${servicio.descripcion}">
        <input id="precio" className="swal2-input" value="${Number(servicio.precio).toLocaleString('es-CR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}">
        <input id="duracion" className="swal2-input" value="${servicio.duracion}">
      `,
      focusConfirm: false,
      confirmButtonText: 'Actualizar',
      preConfirm: () => {
        const nombre = document.getElementById('nombre').value.trim()
        const descripcion = document.getElementById('descripcion').value.trim()
        const precioTexto = document.getElementById('precio').value.trim()
        const duracion = document.getElementById('duracion').value.trim()

        if (!nombre || !descripcion || !precioTexto || !duracion) {
          Swal.showValidationMessage('Todos los campos son obligatorios')
          return false
        }

        const precio = limpiarPrecio(precioTexto)
        if (precio >= 10000000) {
          Swal.showValidationMessage('El precio no puede tener más de 7 dígitos antes del punto decimal')
          return false
        }

        return { nombre, descripcion, precio, duracion }
      }
    })

    if (formValues) {
      try {
        const actualizado = await patchServicios(servicio.id, formValues)
        setServicios(servicios.map(s => s.id === servicio.id ? actualizado : s))
        Swal.fire('¡Actualizado!', 'El servicio ha sido modificado.', 'success')
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar el servicio.', 'error')
      }
    }
  }

  const eliminarServicio = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#fc5494',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar'
    })

    if (confirm.isConfirmed) {
      try {
        await deleteServicios(id)
        setServicios(servicios.filter(s => s.id !== id))
        Swal.fire('¡Eliminado!', 'El servicio ha sido eliminado.', 'success')
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el servicio.', 'error')
      }
    }
  }

  return (
    <div className='contservicios'>
      <div className='servicios'>
        <h1>Servicios</h1><br/>
        <button onClick={agregarServicio} className='btn-agregar'>
          Agregar Servicio
        </button>
        <Link to="/Admin" className='btn-volver'>Admin</Link>
        <div className='tarjetas-container'>
          {
            servicios.map(servicio => (
              <div key={servicio.id} className='tarjeta-servicio'>
                <h3>{servicio.nombre}</h3>
                <p><strong>Nombre de la Especialidad:</strong> {servicio.nombre}</p>
                <p><strong>Descripción:</strong> {servicio.descripcion}</p>
                <p><strong>Precio:</strong> ₡{Number(servicio.precio).toLocaleString('es-CR', { minimumFractionDigits: 3 })}</p>
                <p><strong>Duración:</strong> {servicio.duracion}</p>
                <button onClick={() => editarServicio(servicio)} className='btn-editar'>Editar</button>
                <button onClick={() => eliminarServicio(servicio.id)} className='btn-eliminar'>Eliminar</button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Serviciosdash
