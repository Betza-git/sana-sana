import React, { useEffect, useState } from 'react';
import { getData, postData, deleteData, patchData } from '../services/llamados';
import Swal from 'sweetalert2'
import '../styles/Admin.css';



function Administrador() {
    // Estado para almacenar la especialidad, uso de useState para manejar el estado de la especialidad
    const [especialidad, setEspecialidad] = useState('');

    const [nombre, setNombre] = useState('');
    const [especialidadEspecialista, setEspecialidadEspecialista] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [genero, setGenero] = useState('');
    const [especialidadesL, setEspecialidadesL] = useState([]);
    const [recargar, setRecargar] = useState(false);

// Función para guardar la especialidad en el servidor
    const guardarEspecialidad = async (e) => {
        console.log("entra")
        e.preventDefault()
        const especialidadData = {
            nombre: especialidad // Cambiado de 'especialidad' a 'nombre' para evitar conflicto
        };
        const filtro = especialidadesL.find(especialidad => especialidad.nombre === especialidadData.nombre); // Verifica si ya existe la especialidad => es para evitar que se repita el nombre de la especialidad
//* find es un método de los arrays que devuelve el primer elemento que cumple con la condición dada. 
// En este caso, busca si hay alguna especialidad con el mismo nombre que la que se está intentando agregar.
//  Si no encuentra ninguna, devuelve undefined. */
// Si ya existe la especialidad, muestra un mensaje de error
        if (filtro) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ya se encuentra registrado!",
            });
        }
// postData es para guardar la especialidad en el servidor local        
        else {
            await postData(especialidadData, 'especialidades');
            setEspecialidad('');
            Swal.fire({
                icon: "success",
                title: "Especialidad registrada",
                text: "Especialidad registrada con éxito",
            });
            setRecargar(!recargar);
        }

        /*  Agregar la funcion y el form de los datos de los especialistas       */
    }
    const subirImagen=(evento)=>{
        const archivo = evento.target.files[0] /*tiene 0 porque se capta solo la primera informacion de la imagen.*/
        if (archivo) {
            const lector = new FileReader()   // FileReader es una API de JavaScript que permite leer archivos de forma asíncrona.
            lector.onloadend = ()=>{         //cuando termina de cargar la imagen, se ejecuta la funcion
                setImagen(lector.readAsDataURL(archivo))
            }
        
        }
    }

const manejarEnvioEspecialista = async (e) => {  // Función para guardar el especialista en el servidor local
    e.preventDefault();                         // Evita que la página se recargue
    const especialista = {
        nombre: nombre,
        especialidad: especialidad,
        email: email,
        password: password,
        fechaNacimiento: fechaNacimiento,
        genero: genero
    }
    await postData(especialista, "especialistas")     // await para que espere a que se ejecute la función postData
    // ACA VA EL SWEET ALERT
    Swal.fire({
        icon: "success",
        title: "Especialista registrado",
        text: "Especialista registrado con éxito",
    });
    setRecargar(!recargar);  //Recarga la página para mostrar el nuevo especialista, 
// ! es para cambiar el estado de recargar a true o false

}
 
 // useEffect para que se ejecute la función de traer las especialidades y guardarlas en el estado especialidadesL

useEffect(() => { 
    const obtenerEspecialidades = async () => {
        const listaEspecialidades = await getData('especialidades');
// Va hacer un filtro que solamente devuelva las especialidades que no sean iguales
        setEspecialidadesL(listaEspecialidades);
    }

    obtenerEspecialidades();
}, [especialidadesL]); // especialidadesL es el estado que se va a actualizar cuando se agregue una
//  nueva especialidad o se elimine una

async function eliminarEspecialidad(id) {         // deleteData es para eliminar la especialidad
    const { isConfirmed } = await Swal.fire({
        title: "¿Está seguro de eliminar la especialidad?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
    }); 
    if (isConfirmed) {
        await deleteData(id,'especialidades');
        Swal.fire({
            icon: "success",
            title: "Especialidad eliminada",
            text: "Especialidad eliminada con éxito",
        });
        setRecargar(!recargar);
    }
}

async function editarEspecialidad(id) {        // patchData es para editar la especialidad 
    const { value: formValues } = await Swal.fire({
        title: "Editar especialidad",
        html: `
          <input id="swal-input1" class="swal2-input" placeholder="Ingrese la nueva especialidad">
        `,
        focusConfirm: false,
        preConfirm: () => {  // Se ejecuta cuando se confirma el formulario       
          return [
            document.getElementById("swal-input1").value // Captura el valor del input
          ];
        }
      });
      if (formValues) {                      // Si se confirma el formulario
        const especialidadEditada = {
            nombre: document.getElementById("swal-input1").value              // Cambiado de 'especialidad' a 'nombre' para evitar conflicto
        }
        await patchData(id, especialidadEditada, 'especialidades');
        Swal.fire({
            icon: "success",
            title: "Especialidad editada",
            text: "Especialidad editada con éxito",
        });
        setRecargar(!recargar);
      }
    setRecargar(!recargar);
}

return (
    <section className='contenedor-ad'>                       
    <div className='contenedor-admin'>
        <h2>Agregue su especialidad</h2>
        <input                        //* onChange es un evento que se ejecuta cuando el valor de un input cambia.
            onChange={(e) => setEspecialidad(e.target.value)}            //e.target.value es el que capta el evento
            type="text"
            placeholder="Ingrese la especialidad"
        />
        <button onClick={guardarEspecialidad} className='btn-especialidad'  >GUARDAR ESPECIALIDAD</button>
        <h2>Agregue el especialista</h2>
        <input onChange={(e) => setNombre(e.target.value)} type="text" placeholder="Ingrese el nombre del especialista" />
        <select onChange={(e) => setEspecialidadEspecialista(e.target.value)} name="" id="">
            <option value="" selected disabled>Seleccione la especialidad</option>
            {especialidadesL.map((especialidad) => {                                   // Se recorre el arreglo de especialidadesL con el map y se muestra en el select. 
                return <option value={especialidad.nombre}>{especialidad.nombre}</option>
            })}
        </select>
        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Ingrese el correo electrónico" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Ingrese la contraseña" />
        <input onChange={(e) => setFechaNacimiento(e.target.value)} type="date" placeholder="Ingrese la fecha de nacimiento" />
        <input onChange={subirImagen} type="file" />
        <select name="" id="" onChange={(e) => setGenero(e.target.value)}>
            <option value="" selected disabled>Seleccione su género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="NR">Prefiero no decirlo</option>
        </select>
        <button onClick={manejarEnvioEspecialista} className='btn-especialidad'  >
            Guardar Especialista </button>
    </div>
    <div className='lista-admin'>
        <h2>Lista de especialidades</h2>
        <ul>
            {especialidadesL.map((especialidad) => {
                return <ul key={especialidad.id}>                  
                    <li>{especialidad.nombre}</li>                 
                    <li><button onClick={() => editarEspecialidad(especialidad.id)}>editar</button></li>
                    <li><button onClick={() => eliminarEspecialidad(especialidad.id)}>eliminar</button></li>  
                    </ul>
                    //* key es para que no se repitan los elementos y se le asigna un id a cada elemento de la lista.
                
            })}          
        </ul>
    </div>
    </section>
);
}

export default Administrador;