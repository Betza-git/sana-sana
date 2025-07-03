import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postLogin } from '../services/loginservice' 
import { Link } from 'react-router-dom'
import '../styles/Login.css'

function FormLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function iniciarSesion(e) {
    e.preventDefault()

    try {
      const token = await postLogin({ email, password })
      console.log("Token recibido:", token)

      if (token.access) {
        localStorage.setItem("token", token.access)
        localStorage.setItem("userid", token.user.id)
        localStorage.setItem("rol", token.user.tipo)

        // Redirección según rol
        switch (token.user.tipo) {
          case 'admin':
            navigate('/Admin')
            break
          case 'cliente':
            navigate('/Usuarios')
            break
          case 'especialista':
            navigate('/Especialistas')
            break
          case 'empleado':
            navigate('/Especialistas')
            break
          default:
            navigate('/') // Redirige a inicio si el rol es desconocido
        }
      } else {
        alert("Credenciales inválidas. Verifica tus datos.")
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      alert("Error al iniciar sesión. Verifica tu conexión o tus datos.")
    }
  }

  return (
    <div className='contenedorLogin'>
      <div>
        <h1 className='titulo'>Inicio de Sesión</h1>
        <form className='loginForm' onSubmit={iniciarSesion}>
          <input
            type="text"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className='botonLogin' type="submit">Iniciar Sesión</button>
        </form>

        <div className='contenedor2'>
          <Link to="/recuperar-contrasena" className='linkRecuperar'>¿Olvidaste tu contraseña?</Link>
          <h4 className='titulo1'>¿No tienes cuenta?</h4>
          <Link to="/registro" className='linkRegistro'>Regístrate</Link>
        </div>
      </div>
    </div>
  )
}

export default FormLogin
