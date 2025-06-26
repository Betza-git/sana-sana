import React, { useEffect, useState } from 'react';
import { getUsuario, patchUsuario } from '../services/usuarioservices';
import { getCitasUsuario, postCita, patchCita, deleteCita } from '../services/citas';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/usuario.css'


const Usuarios = () => {
  const id = localStorage.getItem('userid');

  // Estado usuario, form edición, citas y especialistas
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    numero_identificacion: '',
    email: '',
    password: '',
    fechaNac: '',
    genero1: '',
    telefono: ''
  });
  const [editMode, setEditMode] = useState(false);

  const [citas, setCitas] = useState([]);
  const [nuevaCita, setNuevaCita] = useState({
    cliente: id,
    especialista: '',
    servicio: '',
    fecha: '',
    hora: '',
    estado: 'pendiente',
    observaciones: ''
  });
  const [editCitaId, setEditCitaId] = useState(null);

  const [especialistas, setEspecialistas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga inicial usuario, citas y especialistas
  useEffect(() => {
    async function cargarDatos() {
      try {
        if (!id) throw new Error('No se encontró ID de usuario en localStorage');
        const userData = await getUsuario(id);
        if (!userData) throw new Error('Usuario no encontrado');

        setUsuario(userData);
        setForm({
          nombre: userData.nombre || '',
          numero_identificacion: userData.numero_identificacion || '',
          email: userData.email || '',
          password: '', // no mostramos password real
          fechaNac: userData.fechaNac || '',
          genero1: userData.genero1 || '',
          telefono: userData.telefono || ''
        });

        const citasData = await getCitasUsuario(id);
        setCitas(citasData);

        const espRes = await axios.get('http://localhost:8000/api/especialistas/');
        setEspecialistas(espRes.data);
      } catch (error) {
        Swal.fire('Error', error.message || 'Error cargando datos', 'error');
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [id]);

  // Manejo inputs usuario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Guardar cambios usuario
  const handleGuardarUsuario = async () => {
    try {
      // Crear objeto con campos que quieres actualizar
      const updateData = { ...form };
      if (!updateData.password) delete updateData.password; // si vacío no actualizar pass

      const updated = await patchUsuario(id, updateData);
      setUsuario(updated);
      setEditMode(false);
      Swal.fire('Éxito', 'Información actualizada', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar la información', 'error');
    }
  };

  // Manejo inputs cita
  const handleCitaChange = (e) => {
    const { name, value } = e.target;
    setNuevaCita(prev => ({ ...prev, [name]: value }));
  };

  // Agregar o editar cita
  const handleAgregarOEditarCita = async () => {
    // Validar campos obligatorios
    const { especialista, servicio, fecha, hora, observaciones } = nuevaCita;
    if (!especialista || !servicio || !fecha || !hora || !observaciones) {
      Swal.fire('Error', 'Todos los campos de la cita son obligatorios', 'error');
      return;
    }

    try {
      if (editCitaId) {
        await patchCita(editCitaId, nuevaCita);
        Swal.fire('Éxito', 'Cita actualizada', 'success');
      } else {
        await postCita(nuevaCita);
        Swal.fire('Éxito', 'Cita agregada', 'success');
      }
      setNuevaCita({
        cliente: id,
        especialista: '',
        servicio: '',
        fecha: '',
        hora: '',
        estado: 'pendiente',
        observaciones: ''
      });
      setEditCitaId(null);

      const citasActualizadas = await getCitasUsuario(id);
      setCitas(citasActualizadas);
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la cita', 'error');
    }
  };

  // Preparar cita para editar
  const handleEditarCita = (cita) => {
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

  // Eliminar cita
  const handleEliminarCita = async (citaId) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar cita?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (confirm.isConfirmed) {
      try {
        await deleteCita(citaId);
        Swal.fire('Eliminada', 'Cita eliminada con éxito', 'success');
        const citasActualizadas = await getCitasUsuario(id);
        setCitas(citasActualizadas);
      } catch {
        Swal.fire('Error', 'No se pudo eliminar la cita', 'error');
      }
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando datos...</p>;
  if (!usuario) return <p className="text-center text-danger mt-4">Usuario no encontrado</p>;

  return (
    <div className="container mt-4">
      <h2>Perfil de Usuario</h2>
      <div className="card p-3 mt-3">
        {editMode ? (
          <>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                name="nombre"
                className="form-control"
                value={form.nombre}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Número Identificación</label>
              <input
                name="numero_identificacion"
                className="form-control"
                value={form.numero_identificacion}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleInputChange}
                placeholder="Dejar vacío para no cambiar"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fechaNac"
                className="form-control"
                value={form.fechaNac}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Género</label>
              <select
                name="genero1"
                className="form-select"
                value={form.genero1}
                onChange={handleInputChange}
              >
                <option value="">Seleccione</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                name="telefono"
                className="form-control"
                value={form.telefono}
                onChange={handleInputChange}
              />
            </div>

            <button className="btn btn-success me-2" onClick={handleGuardarUsuario}>
              Guardar Cambios
            </button>
            <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
              Cancelar
            </button>
          </>
        ) : (
          <>
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Número Identificación:</strong> {usuario.numero_identificacion}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Fecha de Nacimiento:</strong> {usuario.fechaNac}</p>
            <p><strong>Género:</strong> {usuario.genero1}</p>
            <p><strong>Teléfono:</strong> {usuario.telefono}</p>
            <button className="btn btn-primary" onClick={() => setEditMode(true)}>
              Editar Información
            </button>
          </>
        )}
      </div>

      <h3 className="mt-5">Citas Agendadas</h3>
      {citas.length === 0 ? (
        <p>No tienes citas registradas.</p>
      ) : (
        <ul className="list-group mt-3">
          {citas.map((cita) => (
            <li key={cita.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{cita.fecha}</strong> {cita.hora} - {cita.servicio} <br/>
                <small>Especialista: {especialistas.find(e => e.id === cita.especialista)?.nombre || 'Desconocido'}</small><br/>
                <small>Estado: {cita.estado}</small><br/>
                <small>Observaciones: {cita.observaciones}</small>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEditarCita(cita)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleEliminarCita(cita.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h4 className="mt-5">{editCitaId ? 'Editar Cita' : 'Agendar Nueva Cita'}</h4>
      <div className="card p-3 mb-5">
        <div className="mb-3">
          <label className="form-label">Especialista</label>
          <select
            name="especialista"
            className="form-select"
            value={nuevaCita.especialista}
            onChange={handleCitaChange}
            required
          >
            <option value="">Seleccione especialista</option>
            {especialistas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Servicio</label>
          <input
            name="servicio"
            type="text"
            className="form-control"
            value={nuevaCita.servicio}
            onChange={handleCitaChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha</label>
          <input
            name="fecha"
            type="date"
            className="form-control"
            value={nuevaCita.fecha}
            onChange={handleCitaChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Hora</label>
          <input
            name="hora"
            type="time"
            className="form-control"
            value={nuevaCita.hora}
            onChange={handleCitaChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Observaciones</label>
          <textarea
            name="observaciones"
            className="form-control"
            value={nuevaCita.observaciones}
            onChange={handleCitaChange}
            required
          />
        </div>

        <button className="btn btn-success" onClick={handleAgregarOEditarCita}>
          {editCitaId ? 'Actualizar Cita' : 'Agendar Cita'}
        </button>
      </div>
    </div>
  );
};

export default Usuarios;
