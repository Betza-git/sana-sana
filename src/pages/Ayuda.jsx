import React from 'react'
import '../styles/Ayudacitas.css'
import { useState, useEffect } from 'react'
import { getData, patchData, postData } from '../services/llamados'
import Swal from 'sweetalert2'

// definición de la función Ayuda para el formulario de contacto
// Se importan los hooks useState y useEffect de React para manejar el estado y los efectos secundarios
function Ayuda() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [especialidad, setEspecialidad] = useState('')

  // Se utiliza el hook useEffect para obtener los datos de las citas al cargar el componente
  // Se define una función asincrónica getCitas que llama a la función getData para obtener los datos 

  const [citas, setCitas] = useState([])
  useEffect(() => {
    const getCitas = async () => {
      const citas = await getData("auida")
      setCitas(citas)
    }
    getCitas()
  }, [])

  // Se define una función asincrónica enviarDatos que se ejecuta al enviar el formulario
  // Se utiliza la función postData para enviar los datos del formulario a la base de datos
  async function enviarDatos(e) {
    e.preventDefault()
    const citaData = {
      nombre: nombre,
      email: email,
      telefono: telefono,
      especialidad: especialidad,
      mensaje: mensaje
    }

    // SE espera a que se envíen los datos a la base de datos
    await postData(citaData, 'auida')
    Swal.fire({
      title: 'Éxito',
      text: 'Los datos han sido enviados correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    })

    // Se debe hacer el llamado a la base de datos para editar los datos de la cita
    const editcitaData = {
      nombre: nombre,
      email: email,
      telefono: telefono,
      especialidad: especialidad,
      mensaje: mensaje
    }

    // PatchData se utiliza para editar los datos de la cita
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
  
// onClick del botón de cancelar se debe limpiar el formulario y onchange para realizar un evento de cambios,
// e.target.value se utiliza para obtener el valor del input y set es una función que se utiliza
//  para actualizar el estado del input
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