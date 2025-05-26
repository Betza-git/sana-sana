import React from 'react'
import { Link } from 'react-router-dom'



function Privada({children}) {
    function usuarioValido(){
        const usuario = localStorage.getItem("idUsuario")

        if (usuario) {
            return true
        }else{
            return false
        }
    }
// ? children es para que se muestre el contenido de la página privada 
    return (
    <>
     {usuarioValido() ? children : <div>USTED NO ESTÁ REGISTRADO <Link to={"/registro"}>registro</Link></div>}
    </>
  )
}

export default Privada