import React from 'react'
import '../styles/FormRegistro.css'
import { postData } from '../services/llamados'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'


function FormRegistro() {
        const [nombre, setNombre] = useState('')
        const [identificacion, setIdentificacion] = useState('')
        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')
        const [fechaNacimiento, setFechaNacimiento] = useState('')
        const [telefono, setTelefono] = useState('')
        const [genero1, setGenero1] = useState('')

        async function guardarUsuario(e) {
          e.preventDefault()
          const usuario = {
            nombre: nombre,
            numero_identificacion: identificacion,
            email: email,
            password: password,
            fechaNacimiento: fechaNacimiento,
            genero1: genero1,
            telefono: telefono
          }
          await postData(usuario, "api/clientes/")
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Usuario registrado correctamente',
            confirmButtonText: 'Aceptar'
          })
        }
        
        
        




  return (
    
<nav className='navRegistro'>
    <div className='contenedorRegistro'>
        <h2> Usuario Nuevo </h2>
        <form className='formularioRegistro'>
            <input onChange={(e) => setNombre(e.target.value)} type="text" placeholder='Nombre completo' /> 
            {/* e.target.value es el que capta el evento */}

            <input onChange={(e) => setIdentificacion(e.target.value)} type="text" placeholder='Número de identificación'/>
            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Correo electrónico'/>
            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Contraseña'/>
            <input onChange={(e) => setFechaNacimiento(e.target.value)} type="date" placeholder='Fecha de nacimiento'/>
            <input onChange={(e) => setTelefono(e.target.value)} type="tel" placeholder='Teléfono'/>

           
            <select onChange={(e) => setGenero1(e.target.value)} name="" id="">
                <option value="" selected disabled>Seleccione su género</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="NR">Prefiero no decirlo</option>
            </select>

            <button onClick={guardarUsuario} className='registro'>Registro</button><br />
            <div className='cont-link'>
        
        <Link className='textoIniciar' to={"/login"}>INICIAR SESIÓN </Link>
        </div>
        </form>
    </div>
   
    
    </nav>
    
  )
}

export default FormRegistro