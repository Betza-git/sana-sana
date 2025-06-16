import React from 'react'
import { useState } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom'
import postLogin from '../services/loginservice' 
import { Link } from 'react-router-dom'
import '../styles/Login.css' 

function FormLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [id, setId] = useState('');
  const navigate = useNavigate()

  async function iniciarSesion(e) { 
    e.preventDefault()
  const token = await postLogin("api/clientes/login/", { id, email, password }) 

  console.log(token)

  if (token.access) {
    localStorage.setItem("token", token.access)
    localStorage.setItem("userid", token.user.id)
    navigate('/Usuarios')
  }
}

return (
  <div className='contenedorLogin'>
    <div>
        <h1 className='titulo'>Inicio de Sesión</h1>
        <form className='loginForm'>
          <input type="text" placeholder="Correo Electrónico" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
        </form>
        <div className='contenedor2'> 
          <Link to="/recuperar-contrasena" className='linkRecuperar'>¿Olvidaste tu contraseña?</Link>
          <button className='botonLogin'  onClick={iniciarSesion}>Iniciar Sesión</button>
          <h4 className='titulo1'>¿No tienes cuenta?</h4>
          <Link to="/registro" className='linkRegistro'>Registrate</Link>
        </div>
      </div>
    </div>
  )
}

export default FormLogin
