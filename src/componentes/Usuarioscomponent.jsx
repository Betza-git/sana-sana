import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {getMiUsuario,
  patchMiUsuario,
  deleteMiUsuario,
  getAllUsuarios } from '../services/usuarioservices';
import { getCitasUsuario,
  postCita, 
  patchCita,
  deleteCita,
  getCita } from '../services/citas';
import '../styles/usuario.css';


function Usuario() {
  // Estado cliente
  const [cliente, setCliente] = useState(null);
  const [editandoCliente, setEditandoCliente] = useState(false);

  // Estado citas
  const [citas, setCitas] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formulario citas
  const [formCita, setFormCita] = useState({
    id: null,
    servicio: '',
    fecha: '',
    hora: '',
    observaciones: '',
  });
  const [editandoCita, setEditandoCita] = useState(false);

  // Cargar perfil y citas al montar
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const perfilData = await getMiUsuario();
      setCliente(perfilData);
      const citasData = await getCitasUsuario();
      setCitas(citasData);
      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  };

  // Manejo formulario cliente
  const handleChangeCliente = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const guardarCliente = async () => {
    try {
      await patchMiUsuario(cliente);
      Swal.fire('¡Éxito!', 'Perfil actualizado correctamente', 'success');
      setEditandoCliente(false);
      cargarDatos();
    } catch (e) {
      Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
    }
  };

  const eliminarCliente = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar tu cuenta?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteMiUsuario();
        Swal.fire('Cuenta eliminada', 'Tu cuenta ha sido eliminada', 'success');
        // Redirigir o hacer logout aquí
      } catch {
        Swal.fire('Error', 'No se pudo eliminar la cuenta', 'error');
      }
    }
  };

  // Manejo formulario citas
  const handleChangeCita = (e) => {
    setFormCita({ ...formCita, [e.target.name]: e.target.value });
  };

  const agregarCita = async () => {
    if (!formCita.servicio || !formCita.fecha || !formCita.hora) {
      Swal.fire('Error', 'Completa todos los campos requeridos', 'error');
      return;
    }
    try {
      await postCita(formCita);
      Swal.fire('¡Éxito!', 'Cita agregada', 'success');
      setFormCita({ id: null, servicio: '', fecha: '', hora: '', observaciones: '' });
      cargarDatos();
    } catch {
      Swal.fire('Error', 'No se pudo agregar la cita', 'error');
    }
  };

  const editarCita = (cita) => {
    setFormCita({
      id: cita.id,
      servicio: cita.servicio,
      fecha: cita.fecha,
      hora: cita.hora,
      observaciones: cita.observaciones,
    });
    setEditandoCita(true);
  };

  const guardarCitaEditada = async () => {
    try {
      await patchCita(formCita.id, formCita);
      Swal.fire('¡Éxito!', 'Cita actualizada', 'success');
      setFormCita({ id: null, servicio: '', fecha: '', hora: '', observaciones: '' });
      setEditandoCita(false);
      cargarDatos();
    } catch {
      Swal.fire('Error', 'No se pudo actualizar la cita', 'error');
    }
  };

  const eliminarCita = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar esta cita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteCita(id);
        Swal.fire('Eliminada', 'Cita eliminada correctamente', 'success');
        cargarDatos();
      } catch {
        Swal.fire('Error', 'No se pudo eliminar la cita', 'error');
      }
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message || error.toString()}</p>;

  return (
    <div className="cliente-dashboard">
      <h1>Mi Perfil</h1>

      {!editandoCliente ? (
        <div>
          <p><b>Nombre:</b> {cliente.nombre}</p>
          <p><b>Email:</b> {cliente.email}</p>
          <p><b>Teléfono:</b> {cliente.telefono}</p>
          <p><b>Fecha de Nacimiento:</b> {cliente.fechaNac}</p>
          <p><b>Género:</b> {cliente.genero1}</p>

          <button onClick={() => setEditandoCliente(true)}>Editar Perfil</button>
          <button onClick={eliminarCliente} style={{ marginLeft: 10, color: 'red' }}>Eliminar Cuenta</button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); guardarCliente(); }}>
          <label>
            Nombre:
            <input name="nombre" value={cliente.nombre} onChange={handleChangeCliente} required />
          </label>
          <label>
            Email:
            <input name="email" type="email" value={cliente.email} onChange={handleChangeCliente} required />
          </label>
          <label>
            Teléfono:
            <input name="telefono" value={cliente.telefono} onChange={handleChangeCliente} required />
          </label>
          <label>
            Fecha de Nacimiento:
            <input name="fechaNac" type="date" value={cliente.fechaNac || ''} onChange={handleChangeCliente} />
          </label>
          <label>
            Género:
            <select name="genero1" value={cliente.genero1 || ''} onChange={handleChangeCliente} required>
              <option value="">Seleccione</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </label>
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => setEditandoCliente(false)}>Cancelar</button>
        </form>
      )}

      <hr />

      <h2>Mis Citas</h2>
      <button onClick={() => setFormCita({ id: null, servicio: '', fecha: '', hora: '', observaciones: '' }) && setEditandoCita(false)}>
        Agregar Nueva Cita
      </button>

      {editandoCita && (
        <form onSubmit={e => {
          e.preventDefault();
          editandoCita ? guardarCitaEditada() : agregarCita();
        }}>
          <label>
            Servicio:
            <input name="servicio" value={formCita.servicio} onChange={handleChangeCita} required />
          </label>
          <label>
            Fecha:
            <input name="fecha" type="date" value={formCita.fecha} onChange={handleChangeCita} required />
          </label>
          <label>
            Hora:
            <input name="hora" type="time" value={formCita.hora} onChange={handleChangeCita} required />
          </label>
          <label>
            Observaciones:
            <textarea name="observaciones" value={formCita.observaciones} onChange={handleChangeCita} />
          </label>
          <button type="submit">{editandoCita ? 'Guardar Cambios' : 'Agregar Cita'}</button>
          <button type="button" onClick={() => {
            setEditandoCita(false);
            setFormCita({ id: null, servicio: '', fecha: '', hora: '', observaciones: '' });
          }}>Cancelar</button>
        </form>
      )}

      <div>
        {citas.length === 0 ? (
          <p>No tienes citas registradas.</p>
        ) : (
          <ul>
            {citas.map((cita) => (
              <li key={cita.id}>
                <b>{cita.servicio}</b> - {cita.fecha} {cita.hora}  
                <button onClick={() => editarCita(cita)} style={{ marginLeft: 10 }}>Editar</button>
                <button onClick={() => eliminarCita(cita.id)} style={{ marginLeft: 5, color: 'red' }}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Usuario;
