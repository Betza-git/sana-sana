import React from 'react'
import { useState, useEffect } from 'react'
import { getData } from '../services/llamados' 
import  '../styles/servicios.css' 



function Servicios() {
    const [servicios, setServicios] = useState([])  //estado para guardar los servicios
    useEffect(() => {                            //useEffect para que se ejecute la función de traer los servicios
        const getServicios = async () => {         //y guardarlos en el estado servicios async () => { para que se ejecute de manera asincrona
            const servicios = await getData("especialistas")      // await getData("servicios") para que espere a que se ejecute la función getData("servicios")
            setServicios(servicios)
        }
        getServicios()
    }, [])



     /*
        Hacer useEffect para que se ejecute la función de traer los servicios
        y guardarlos en el estado servicios

        luego, hacer dentro del div un map de los servicios para mostrarlos
        hacer el llamado solo con el nombre y luego hacer un link a la página de detalle del servicio para conectarlo con la página de detalle del servicio
     */
  return ( 
    <div className='contservicios'>
    <div className='servicios'>
        <h1>Servicios</h1>
        <div>
            {
                servicios.map(servicio => (              //map es para recorrer el arreglo de servicios
                    <div key={servicio.id}>                 //key es para que no se repitan los elementos
                        <h3>{servicio.nombre}</h3>               
                        <h3>{servicio.especialidad}</h3>           
                    </div>
                ))
            }

        </div>
    </div>
    </div>
  ) 
}

export default Servicios