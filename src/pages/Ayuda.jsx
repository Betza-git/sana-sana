import React from 'react'
import '../styles/Ayudacitas.css'
import { useState, useEffect } from 'react'
import { getData, patchData, postData } from '../services/llamados'
import Swal from 'sweetalert2'

// definición  
function Ayuda() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [especialidad, setEspecialidad] = useState('')

  const [citas, setCitas] = useState([])
  useEffect(() => {
    const getCitas = async () => {
      const citas = await getData("auida")
      setCitas(citas)
    }
    getCitas()
  }, [])


  async function enviarDatos(e) {
    e.preventDefault()
    const citaData = {
      nombre: nombre,
      email: email,
      telefono: telefono,
      especialidad: especialidad,
      mensaje: mensaje
    }
    await postData(citaData, 'auida')
    Swal.fire({
      title: 'Éxito',
      text: 'Los datos han sido enviados correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    })

    // Aqui se debe hacer el llamado a la base de datos para editar los datos de la cita
    const editcitaData = {
      nombre: nombre,
      email: email,
      telefono: telefono,
      especialidad: especialidad,
      mensaje: mensaje
    }
    await patchData(editcitaData, 'auida')
    Swal.fire({
      title: 'Éxito',
      text: 'Los datos han sido editados correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    })

    // Aqui se debe hacer el llamado a la base de datos para eliminar los datos de la cita
    await deleteData('auida')


    }
  
  return (
    <div className='contenedorcitas'>
      <h1>Formulario de Contacto</h1>
      <form className='formulariocitas'>
        <input onChange={(e) => setNombre(e.target.value)} type="text" placeholder="Ingrese su nombre" />
        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Ingrese su correo electrónico" />
        <input onChange={(e) => setTelefono(e.target.value)} type="tel" placeholder="Ingrese su número de teléfono" />
        <input onChange={(e) => setEspecialidad(e.target.value)} type="text" placeholder="Ingrese la especialidad" />
        <textarea onChange={(e) => setMensaje(e.target.value)} placeholder="Escriba su mensaje"></textarea>

        <button type="submit" onClick={enviarDatos}>Enviar</button>
        <button type="editar">Editar</button>

        <button type="button">Cancelar</button>
      </form>
    </div>
  )
}

export default Ayuda