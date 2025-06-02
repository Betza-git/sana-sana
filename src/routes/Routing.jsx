import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Registro from '../pages/Registro'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Especialistas from '../pages/Especialistas'
import Ayuda from '../pages/Ayuda'
import Servicios from '../pages/Servicios'
import Aboutus from '../pages/Aboutus'
function Routing() {
  return (
    <Router>
        <Routes>

          {/* rutas privadas */}

           
            {/* rutas publicas */}
            {/*<Route path='/' element={<Privada children={<Home/>}/>}/> */}
          <Route path='/' element={<Home/>}/> 
              
             {/* rutas publicas */}
            <Route path='/login' element={<Login/>}/>  
            <Route path='/registro' element={<Registro/>}/>  
            <Route path='/NavHome' element={<Home/>}/>
            <Route path='/Especialistas' element={<Especialistas/>}/> 
            <Route path='/Ayuda' element={<Ayuda/>}/> 
            <Route path='/Servicios' element={<Servicios/>}/> 
            <Route path='/Aboutus' element={<Aboutus/>}/> 

            {/* El path="" tiene entre las comillas la ruta a la que va a ir
                si se coloca solamente la / es la primera página que mostrará
                
                el element, es el contenido de lo que mostrará dentro de esa ruta
            */}
        </Routes>
    </Router>
  )
}

export default Routing