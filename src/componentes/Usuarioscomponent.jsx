import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { getUsuario, patchUsuario, deleteUsuario } from '../services/usuarioservices';
import { getCitasUsuario, postCita, patchCita, deleteCita } from '../services/citas';
import { getespecialistas } from '../services/Especialistas';
import { getServicios } from '../services/Servicios';
import { getEspecialidades } from '../services/especialidadesservices';

import '../styles/usuario.css';

const Usuarios = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem('userid');

  const [usuario, setUsuario] = useState(null);
  const [especialistas, setEspecialistas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [citas, setCitas] = useState([]);

  const [form, setForm] = useState({
    nombre: '', numero_identificacion: '', email: '', password: '',
    fechaNac: '', genero1: '', telefono: ''
  });

  const [nuevaCita, setNuevaCita] = useState({
    cliente: id, especialista: '', servicio: '', fecha: '',
    hora: '', estado: 'pendiente', observaciones: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [editCitaId, setEditCitaId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!id) throw new Error('No se encontró ID de usuario en localStorage');

        const [userData, citasData, especialistasData, serviciosData, especialidadesData] = await Promise.all([
          getUsuario(id),
          getCitasUsuario(id),
          getespecialistas(),
          getServicios(),
          getEspecialidades()
        ]);

        if (!userData) throw new Error('Usuario no encontrado');

        setUsuario(userData);
        setForm({
          nombre: userData.nombre || '',
          numero_identificacion: userData.numero_identificacion || '',
          email: userData.email || '',
          password: '',
          fechaNac: userData.fechaNac || '',
          genero1: userData.genero1 || '',
          telefono: userData.telefono || ''
        });

        setCitas(citasData);
        setEspecialistas(especialistasData);
        setServicios(serviciosData);
        setEspecialidades(especialidadesData);
      } catch (error) {
        Swal.fire('Error', error.message || 'Error cargando datos', 'error');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const handleInputChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGuardarUsuario = async () => {
    try {
      const updated = await patchUsuario(id, form);
      setUsuario(updated);
      setEditMode(false);
      Swal.fire('Éxito', 'Información actualizada', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo actualizar la información', 'error');
    }
  };

  const handleEliminarUsuario = async () => {
    const confirm = await Swal.fire({
      title: '¿Eliminar cuenta?',
      text: 'Esta acción eliminará todos tus datos. ¿Deseas continuar?',
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (confirm.isConfirmed) {
      try {
        await deleteUsuario(id);
        localStorage.clear();
        Swal.fire('Cuenta eliminada', 'Tu cuenta ha sido eliminada exitosamente.', 'success');
        navigate('/');
      } catch {
        Swal.fire('Error', 'No se pudo eliminar la cuenta', 'error');
      }
    }
  };

  const handleCitaChange = e =>
    setNuevaCita(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGuardarCita = async () => {
    const { especialista, servicio, fecha, hora, observaciones } = nuevaCita;
    if (!especialista || !servicio || !fecha || !hora || !observaciones)
      return Swal.fire('Error', 'Todos los campos son obligatorios', 'error');

    try {
      if (editCitaId) {
        await patchCita(editCitaId, nuevaCita);
        Swal.fire('Éxito', 'Cita actualizada', 'success');
      } else {
        await postCita(nuevaCita);
        Swal.fire('Éxito', 'Cita creada', 'success');
      }
      setEditCitaId(null);
      setNuevaCita({
        cliente: id, especialista: '', servicio: '', fecha: '',
        hora: '', estado: 'pendiente', observaciones: ''
      });
      setCitas(await getCitasUsuario(id));
    } catch {
      Swal.fire('Error', 'No se pudo guardar la cita', 'error');
    }
  };

  const handleEditarCita = cita => {
    setNuevaCita({
      cliente: id,
      especialista: cita.especialista,
      servicio: cita.servicio,
      fecha: cita.fecha,
      hora: cita.hora,
      estado: cita.estado,
      observaciones: cita.observaciones
    });
    setEditCitaId(cita.id);
  };

  const handleEliminarCita = async citaId => {
    const confirm = await Swal.fire({
      title: '¿Eliminar cita?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (confirm.isConfirmed) {
      try {
        await deleteCita(citaId);
        Swal.fire('Eliminada', 'Cita eliminada con éxito', 'success');
        setCitas(await getCitasUsuario(id));
      } catch {
        Swal.fire('Error', 'No se pudo eliminar la cita', 'error');
      }
    }
  };

  if (loading) return <p className="clientes-admin loading">Cargando datos...</p>;

  return (
    <div className="clientes-admin">
      <Link to="/" className="btn btn-cancel mb-3">Volver a inicio</Link>

      <h1>Perfil de Usuario</h1>
      <div className="formulario-container">
        {editMode ? (
          <div className="cliente-form">
            {['nombre', 'numero_identificacion', 'email', 'password', 'fechaNac', 'telefono'].map(field => (
              <div key={field} className="form-group">
                <label>{field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}:</label>
                <input
                  name={field}
                  type={field === 'email' ? 'email' : field === 'password' ? 'password' : field === 'fechaNac' ? 'date' : 'text'}
                  value={form[field]}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                />
              </div>
            ))}
            <div className="form-group">
              <label>Género:</label>
              <select name="genero1" value={form.genero1} onChange={handleInputChange} className="form-input">
                <option value="">Seleccione género</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="form-buttons">
              <button className="btn btn-success" onClick={handleGuardarUsuario}>Guardar Cambios</button>
              <button className="btn btn-cancel" onClick={() => setEditMode(false)}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="cliente-info">
            {Object.entries(usuario).map(([key, value]) =>
              <p key={key}><strong>{key.replace('_', ' ').toUpperCase()}:</strong> {key === 'password' ? '********' : value}</p>
            )}
            <div className="form-buttons">
              <button className="btn btn-edit" onClick={() => setEditMode(true)}>Editar Información</button>
              <button className="btn btn-delete" onClick={handleEliminarUsuario}>Eliminar Cuenta</button>
            </div>
          </div>
        )}
      </div>

      <div className="clientes-lista">
        <h2>Citas Agendadas</h2>
        {citas.length === 0 ? <p className="no-clientes">No tienes citas registradas.</p> : (
          <div className="clientes-grid">
            {citas.map(cita => (
              <div key={cita.id} className="cliente-card">
                <div className="cliente-info">
                  <p><strong>Fecha:</strong> {cita.fecha}</p>
                  <p><strong>Hora:</strong> {cita.hora}</p>
                  <p><strong>Servicio:</strong> {servicios.find(s => s.id === cita.servicio)?.nombre || cita.servicio}</p>
                  <p><strong>Especialista:</strong> {especialistas.find(e => e.id === cita.especialista)?.nombre || cita.especialista}</p>
                  <p><strong>Estado:</strong> {cita.estado}</p>
                  <p><strong>Observaciones:</strong> {cita.observaciones}</p>
                </div>
                <div className="cliente-actions">
                  <button className="btn btn-edit" onClick={() => handleEditarCita(cita)}>Editar</button>
                  <button className="btn btn-delete" onClick={() => handleEliminarCita(cita.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="formulario-container">
        <h2>{editCitaId ? 'Editar Cita' : 'Agendar Nueva Cita'}</h2>
        <div className="cliente-form">
          {[{
            name: 'especialista', options: especialistas
          }, {
            name: 'servicio', options: servicios
          }].map(({ name, options }) => (
            <div key={name} className="form-group">
              <label>{name.charAt(0).toUpperCase() + name.slice(1)}:</label>
              <select
                name={name}
                value={nuevaCita[name]}
                onChange={handleCitaChange}
                className="form-input"
              >
                <option value="">Seleccione {name}</option>
                {options.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.nombre}</option>
                ))}
              </select>
            </div>
          ))}
          <div className="form-group">
            <label>Fecha:</label>
            <input name="fecha" type="date" value={nuevaCita.fecha} onChange={handleCitaChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Hora:</label>
            <input name="hora" type="time" value={nuevaCita.hora} onChange={handleCitaChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Observaciones:</label>
            <textarea name="observaciones" value={nuevaCita.observaciones} onChange={handleCitaChange} className="form-input" placeholder="Observaciones" />
          </div>
          <div className="form-buttons">
            <button className="btn btn-success" onClick={handleGuardarCita}>
              {editCitaId ? 'Actualizar Cita' : 'Agendar Cita'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
