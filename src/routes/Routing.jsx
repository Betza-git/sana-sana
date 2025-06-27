import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Registro from '../pages/Registro'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Especialistas from '../pages/Especialistas' 
import Ayuda from '../pages/Ayuda'
import Servicios from '../pages/Servicios'
import Aboutus from '../pages/Aboutus'
import Admin from '../pages/Admin'
import Dates from '../pages/Dates'
import Usuario from '../pages/Usuario'
import Especialidades from '../pages/Especialidades'
import Clientes from '../pages/Clientes'
import Empleados from '../pages/Empleados'
import MetodosDePago from '../pages/MetodosDePago'
import Payments from '../componentes/Pagos'
import Serviciosdash from '../pages/Serviciosdash'



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
            <Route path='/servicios' element={<Servicios/>}/> 
            <Route path='/Aboutus' element={<Aboutus/>}/>
            <Route path='/Admin' element={<Admin/>}/>
            <Route path='/Usuarios' element={<Usuario/>}/>
            <Route path='/Dates' element={<Dates/>}/>
            <Route path='/Especialidades' element={<Especialidades/>}/>
            <Route path='/Clientes' element={<Clientes/>}/>
            <Route path='/Empleados' element={<Empleados/>}/>
            <Route path='/MetodosDePago' element={<MetodosDePago/>}/>
            <Route path='/Pagos' element={<Payments/>}/>
            <Route path='/serviciosdash' element={<Serviciosdash/>}/>



            {/* El path="" tiene entre las comillas la ruta a la que va a ir
                si se coloca solamente la / es la primera página que mostrará
                
                el element, es el contenido de lo que mostrará dentro de esa ruta
            */}
        </Routes>
    </Router>
  )
}

export default Routing