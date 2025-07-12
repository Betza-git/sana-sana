import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  getMiUsuario,
  patchMiUsuario,
  deleteMiUsuario,
} from '../services/usuarioservices';
import {
  getCitasUsuario,
  postCita,
  patchCita,
  deleteCita,
} from '../services/citas';
import { getServicios } from '../services/Servicios';
import { getEspecialistas } from '../services/Especialistas';
import '../styles/usuario.css';

function Usuario() {
  const [cliente, setCliente] = useState(null);
  const [editandoCliente, setEditandoCliente] = useState(false);

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [servicios, setServicios] = useState([]);
  const [especialistas, setEspecialistas] = useState([]);

  const [formCita, setFormCita] = useState({
    id: null,
    servicio: '',
    especialista: '',
    fecha: '',
    hora: '',
    observaciones: '',
  });
  const [editandoCita, setEditandoCita] = useState(false);
  const [mostrandoFormularioCita, setMostrandoFormularioCita] = useState(false);

  useEffect(() => {
    cargarDatos();
    cargarServiciosYEspecialistas();
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

  const cargarServiciosYEspecialistas = async () => {
    try {
      const serviciosData = await getServicios();
      const especialistasData = await getEspecialistas();
      setServicios(serviciosData);
      setEspecialistas(especialistasData);
    } catch (e) {
      console.error("Error cargando servicios o especialistas", e);
    }
  };

  // ===========================
  // Manejadores cliente
  // ===========================

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
        // Redirigir o hacer logout aquí si deseas
      } catch {
        Swal.fire('Error', 'No se pudo eliminar la cuenta', 'error');
      }
    }
  };

  // ===========================
  // Manejadores citas
  // ===========================

  const handleChangeCita = (e) => {
    setFormCita({ ...formCita, [e.target.name]: e.target.value });
  };

  const iniciarAgregarCita = () => {
    setFormCita({
      id: null,
      servicio: '',
      especialista: '',
      fecha: '',
      hora: '',
      observaciones: '',
    });
    setEditandoCita(false);
    setMostrandoFormularioCita(true);
  };

  const iniciarEditarCita = (cita) => {
    setFormCita({
      id: cita.id,
      servicio: cita.servicio,
      especialista: cita.especialista || '',
      fecha: cita.fecha,
      hora: cita.hora,
      observaciones: cita.observaciones,
    });
    setEditandoCita(true);
    setMostrandoFormularioCita(true);
  };

  const cancelarFormularioCita = () => {
    setFormCita({
      id: null,
      servicio: '',
      especialista: '',
      fecha: '',
      hora: '',
      observaciones: '',
    });
    setEditandoCita(false);
    setMostrandoFormularioCita(false);
  };

  const guardarCita = async () => {
    if (!formCita.servicio || !formCita.especialista || !formCita.fecha || !formCita.hora) {
      Swal.fire('Error', 'Completa todos los campos requeridos', 'error');
      return;
    }

    try {
      if (editandoCita) {
        await patchCita(formCita.id, formCita);
        Swal.fire('¡Éxito!', 'Cita actualizada', 'success');
      } else {
        await postCita(formCita);
        Swal.fire('¡Éxito!', 'Cita agregada', 'success');
      }
      cancelarFormularioCita();
      cargarDatos();
    } catch {
      Swal.fire('Error', 'No se pudo guardar la cita', 'error');
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

  // ===========================
  // Render
  // ===========================

  if (loading) return <p className="loading">Cargando...</p>;
  if (error) return <p className="error">Error: {error.message || error.toString()}</p>;

  return (
    <div className="cliente-dashboard">
      <h1>Mi Perfil</h1>

      {!editandoCliente ? (
        <div className="perfil-info">
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
          <label>Nombre:
            <input name="nombre" value={cliente.nombre} onChange={handleChangeCliente} required />
          </label>
          <label>Email:
            <input name="email" type="email" value={cliente.email} onChange={handleChangeCliente} required />
          </label>
          <label>Teléfono:
            <input name="telefono" value={cliente.telefono} onChange={handleChangeCliente} required />
          </label>
          <label>Fecha de Nacimiento:
            <input name="fechaNac" type="date" value={cliente.fechaNac || ''} onChange={handleChangeCliente} />
          </label>
          <label>Género:
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

      <div className="citas-container">
        <h2>Mis Citas</h2>
        <button className="btn-agregar-cita" onClick={iniciarAgregarCita}>Agregar Nueva Cita</button>

        {mostrandoFormularioCita && (
          <form onSubmit={(e) => { e.preventDefault(); guardarCita(); }}>
            <label>Servicio:
              <select name="servicio" value={formCita.servicio} onChange={handleChangeCita} required>
                <option value="">Seleccione un servicio</option>
                {servicios.map(serv => (
                  <option key={serv.id} value={serv.nombre}>{serv.nombre}</option>
                ))}
              </select>
            </label>

            <label>Especialista:
              <select name="especialista" value={formCita.especialista} onChange={handleChangeCita} required>
                <option value="">Seleccione un especialista</option>
                {especialistas.map(esp => (
                  <option key={esp.id} value={esp.nombre}>{esp.nombre}</option>
                ))}
              </select>
            </label>

            <label>Fecha:
              <input name="fecha" type="date" value={formCita.fecha} onChange={handleChangeCita} required />
            </label>
            <label>Hora:
              <input name="hora" type="time" value={formCita.hora} onChange={handleChangeCita} required />
            </label>
            <label>Observaciones:
              <textarea name="observaciones" value={formCita.observaciones} onChange={handleChangeCita} />
            </label>
            <button type="submit">{editandoCita ? 'Guardar Cambios' : 'Agregar Cita'}</button>
            <button type="button" onClick={cancelarFormularioCita}>Cancelar</button>
          </form>
        )}

        <div>
          {citas.length === 0 ? (
            <p>No tienes citas registradas.</p>
          ) : (
            <ul>
              {citas.map((cita) => (
                <li key={cita.id}>
                  <div className="cita-info">
                    <b>{cita.servicio}</b> - {cita.fecha} {cita.hora}
                    {cita.especialista && <span> - {cita.especialista}</span>}
                    {cita.observaciones && <p style={{ margin: '5px 0', color: '#666' }}>{cita.observaciones}</p>}
                  </div>
                  <div className="cita-actions">
                    <button onClick={() => iniciarEditarCita(cita)}>Editar</button>
                    <button onClick={() => eliminarCita(cita.id)} style={{ color: 'red' }}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Usuario;