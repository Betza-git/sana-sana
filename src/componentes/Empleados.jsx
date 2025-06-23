import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Empleados.css';
import { getEmpleados, postEmpleado, patchEmpleado, deleteEmpleado } from '../services/Empleados';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



    function Empleados() {
      const [empleados, setEmpleados] = useState([]);
      const [nombre, setNombre] = useState('');
      const [numero_identificacion, setNumero_identificacion] = useState('');
      const [fecha_nacimiento, setFecha_nacimiento] = useState('');
      const [telefono, setTelefono] = useState('');
      const [cargo, setCargo] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [fecha_contratacion, setFecha_contratacion] = useState('');
      const [estado, setEstado] = useState('');
      const [idEditar, setIdEditar] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [mostrarFormulario, setMostrarFormulario] = useState(false);



  useEffect(() => {
    const cargarEmpleados = async () => {
      const id = localStorage.getItem('userid');
      setLoading(true);

      if (!id) {
        setError('ID de usuario no encontrado en localStorage');
        setLoading(false);
        return;
      }

      try {
        const response = await getEmpleados();
        setEmpleados(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    cargarEmpleados();
  }, []);

  // Función para agregar empleado
  const handleAgregarEmpleado = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !telefono.trim()) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    const empleado = { nombre, numero_identificacion, fecha_nacimiento, 
        telefono, cargo, email, password, fecha_contratacion, estado };

    try {
      await postEmpleado(empleado);
      Swal.fire('¡Éxito!', 'Empleado agregado correctamente', 'success');
      limpiarFormulario();
      const response = await getEmpleados();
      setEmpleados(response);
      console.log('Fecha de Nacimiento:', empleado.fecha_nacimiento);
    } catch (error) {
      console.error('Error al agregar empleado:', error);
      Swal.fire('Error', 'No se pudo agregar el empleado', 'error');
      setError(error);
    
    }
  };

  // Función para editar empleado
  const handleEditarEmpleado = async (e) => {
    e.preventDefault();

    const empleado = { nombre, numero_identificacion, fecha_nacimiento, 
        telefono, cargo, email, password, fecha_contratacion, estado };

    try {
      await patchEmpleado(idEditar, empleado);
      Swal.fire('¡Éxito!', 'Empleado actualizado correctamente', 'success');
      limpiarFormulario();
      const response = await getEmpleados();
      setEmpleados(response);
    } catch (error) {
      console.error('Error al editar empleado:', error);
      Swal.fire('Error', 'No se pudo actualizar el empleado', 'error');
      setError(error);
    }
  };

  // Preparar formulario para edición
  const handleEditar = (empleado) => {
    setNombre(empleado.nombre || '');
    setNumero_identificacion(empleado.numero_identificacion || '');
    setFecha_nacimiento(empleado.fecha_nacimiento || '');
    setEmail(empleado.email || '');
    setPassword(empleado.password || '');
    setFecha_contratacion(empleado.fecha_contratacion || '');
    setEstado(empleado.estado || '');
    setTelefono(empleado.telefono || '');
    setCargo(empleado.cargo || '');
    setIdEditar(empleado.id);
    setMostrarFormulario(true);
  };

  const handleAgregar = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setNumero_identificacion('');
    setFecha_nacimiento('');
    setEmail('');
    setPassword('');
    setTelefono('');
    setFecha_contratacion('');
    setEstado('');
    setCargo('');
    setIdEditar(null);
    setMostrarFormulario(false);
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteEmpleado(id);
        Swal.fire('¡Eliminado!', 'Empleado eliminado correctamente', 'success');
        const response = await getEmpleados();
        setEmpleados(response);
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
        Swal.fire('Error', 'No se pudo eliminar el empleado', 'error');
        setError(error);
      }
    }
  };

  return (
    <div className="empleados-admin">
      <h1>Administración de Empleados</h1>

      {loading && <p className="loading">Cargando empleados...</p>}
      {error && <p className="error">Error: {error.message}</p>}

      {!mostrarFormulario && (
        <button className="btn btn-primary" onClick={handleAgregar}>
          Agregar Nuevo Empleado
        </button>
      )}

      {mostrarFormulario && (
        <div className="formulario-container">
          <h2>{idEditar ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}</h2>
          <form onSubmit={idEditar ? handleEditarEmpleado : handleAgregarEmpleado} className="empleado-form">
            <div className="form-group">
              <label>Nombre:
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-input" required />
              </label>
            </div>

            <div className="form-group">
              <label>Número de Identificación:
                <input type="text" value={numero_identificacion} onChange={(e) => setNumero_identificacion(e.target.value)} className="form-input" required />
              </label>
            </div>

            <div className="form-group">
              <label>Fecha de Nacimiento:
                <input type="date" value={fecha_nacimiento} onChange={(e) => setFecha_nacimiento(e.target.value)} className="form-input" required />
              </label>
            </div>

            <div className="form-group">
              <label>Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
              </label>
            </div>

            <div className="form-group">
              <label>Contraseña:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
              </label>
            </div>

            <div className="form-group">
              <label>Fecha de Nacimiento:
                <input type="Date" value={fecha_nacimiento} onChange={(e) => setFecha_nacimiento(e.target.value)} className="form-input"  />
              </label>

            </div> 

            <div className="form-group">
              <label>Fecha de Contratación:
                <input type="date" value={fecha_contratacion} onChange={(e) => setFecha_contratacion(e.target.value)} className="form-input" required />
              </label>
            </div> 

            <div className="form-group">
              <label>Teléfono:
                <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="form-input" required />
              </label>
            </div>

            <div className="form-group">
              <label>Cargo:
                <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} className="form-input" required />
              </label>
            </div>

            <div className="form-group">
              <label>Estado:
                <select value={estado} onChange={(e) => setEstado(e.target.value)} className="form-input" required>
                  <option value="">Seleccione el estado</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </label>
            </div>
        <div className="form-buttons">
              <button type="submit" className="btn btn-success">
                {idEditar ? 'Actualizar Cliente' : 'Agregar Cliente'}
              </button>
              <button type="button" onClick={limpiarFormulario} className="btn btn-cancel">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="empleados-lista">
        <h2>Lista de Empleados</h2>
        {empleados.length === 0 ? (
          <p className="no-empleados">No hay empleados registrados.</p>
        ) : (
          <div className="empleados-grid">
            {empleados.map(empleado => (
              <div key={empleado.id} className="empleado-card">
                <div className="empleado-info">
                  <p><strong>Nombre:</strong> {empleado.nombre}</p>
                  <p><strong>ID:</strong> {empleado.numero_identificacion}</p>
                  <p><strong>Email:</strong> {empleado.email}</p>
                  <p><strong>Contraseña:</strong> {empleado.password}</p>
                  <p><strong>Fecha de Nacimiento:</strong> {empleado.fechaNac}</p>
                    <p><strong>Fecha de Contratación:</strong> {empleado.fecha_contratacion}</p>
                  <p><strong>Teléfono:</strong> {empleado.telefono}</p>
                    <p><strong>Cargo:</strong> {empleado.cargo}</p>
                    <p><strong>Estado:</strong> {empleado.estado}</p>
                </div>
                <div className="empleado-actions">

                  <button onClick={() => handleEditar(empleado)} className="btn btn-edit">Editar</button>
                  <button onClick={() => handleEliminar(empleado.id)} className="btn btn-delete">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

 

export default Empleados;