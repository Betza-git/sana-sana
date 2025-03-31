import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getData } from '../services/llamados'
import { Link } from 'react-router-dom' 

function FormLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  async function iniciarSesion(e) {
    e.preventDefault()
   const usuarios = await getData("usuarios")
   const usuario = usuarios.find(usuario => usuario.email === email && usuario.password === password)
    
   console.log(usuario);
   
   
   if(usuario){
      navigate('/')
      localStorage.setItem("idUsuario",usuario.id)
    }

  }

  return ( 
    <div className='contenedorLogin'>
      <div>
        <h1 className='titulo'>Inicio de Sesión</h1>
        <form className='loginForm'>
          <input type="text" placeholder="Correo Electrónico" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
          <button className='btnlogin'    onClick={iniciarSesion}><Link to='/admin'>Iniciar Sesión</Link></button>
        </form>
      </div>
    </div>
  )
}

export default FormLogin