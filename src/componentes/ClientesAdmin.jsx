import React, { useEffect, useState } from 'react';
import { getClientes, postCliente, patchCliente, deleteCliente } from '../services/Clientes';
import Swal from 'sweetalert2';

function ClientesAdmin() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [numero_identificacion, setNumero_identificacion] = useState('');
  const [fechaNac, setFechaNac] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [genero1, setGenero1] = useState('');
  const [telefono, setTelefono] = useState('');
  const [idEditar, setIdEditar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const cargarClientes = async () => {
      const id = localStorage.getItem('userid');
      setLoading(true);

      if (!id) {
        setError('ID de usuario no encontrado en localStorage');
        setLoading(false);
        return;
      }

      try {
        const response = await getClientes();
        setClientes(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    cargarClientes();
  }, []);

  // Función para agregar cliente
  const handleAgregarCliente = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !telefono.trim()) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    const cliente = { nombre, email, telefono, fechaNac, numero_identificacion, password, genero1 };

    try {
      await postCliente(cliente);
      Swal.fire('¡Éxito!', 'Cliente agregado correctamente', 'success');
      limpiarFormulario();
      const response = await getClientes();
      setClientes(response);
      console.log('Fecha de Nacimiento:', cliente.fechaNac);
    } catch (error) {
      console.error('Error al agregar cliente:', error);
      Swal.fire('Error', 'No se pudo agregar el cliente', 'error');
      setError(error);
    
    }
  };

  // Función para editar cliente
  const handleEditarCliente = async (e) => {
    e.preventDefault();

    const cliente = { nombre, numero_identificacion , email, password, fechaNac,  genero1, telefono };

    try {
      await patchCliente(idEditar, cliente);
      Swal.fire('¡Éxito!', 'Cliente actualizado correctamente', 'success');
      limpiarFormulario();
      const response = await getClientes();
      setClientes(response);
    } catch (error) {
      console.error('Error al editar cliente:', error);
      Swal.fire('Error', 'No se pudo actualizar el cliente', 'error');
      setError(error);
    }
  };

  // Preparar formulario para edición
  const handleEditar = (cliente) => {
    setNombre(cliente.nombre || '');
    setNumero_identificacion(cliente.numero_identificacion || '');
    setEmail(cliente.email || '');
    setPassword(cliente.password || '');
    setFechaNac(cliente.fechaNac || '');
    setGenero1(cliente.genero1 || '');
    setTelefono(cliente.telefono || '');
    setIdEditar(cliente.id);
    setMostrarFormulario(true);
  };

  const handleAgregar = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setNumero_identificacion('');
    setEmail('');
    setPassword('');
    setTelefono('');
    setFechaNac('');
    setGenero1('');
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
        await deleteCliente(id);
        Swal.fire('¡Eliminado!', 'Cliente eliminado correctamente', 'success');
        const response = await getClientes();
        setClientes(response);
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        Swal.fire('Error', 'No se pudo eliminar el cliente', 'error');
        setError(error);
      }
    }
  };

  return (
    <div className="clientes-admin">
      <h1>Administración de Clientes</h1>

      {loading && <p className="loading">Cargando clientes...</p>}
      {error && <p className="error">Error: {error.message}</p>}

      {!mostrarFormulario && (
        <button className="btn btn-primary" onClick={handleAgregar}>
          Agregar Nuevo Cliente
        </button>
      )}

      {mostrarFormulario && (
        <div className="formulario-container">
          <h2>{idEditar ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</h2>
          <form onSubmit={idEditar ? handleEditarCliente : handleAgregarCliente} className="cliente-form">
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
                <input type="Date" value={fechaNac} onChange={(e) => setFechaNac(e.target.value)} className="form-input"  />
              </label>

            </div>

            <div className="form-group">
              <label>Género:
                <select value={genero1} onChange={(e) => setGenero1(e.target.value)} className="form-input" required>
                  <option value="">Seleccione el género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </label>
            </div>

            <div className="form-group">
              <label>Teléfono:
                <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="form-input" required />
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

      <div className="clientes-lista">
        <h2>Lista de Clientes</h2>
        {clientes.length === 0 ? (
          <p className="no-clientes">No hay clientes registrados.</p>
        ) : (
          <div className="clientes-grid">
            {clientes.map(cliente => (
              <div key={cliente.id} className="cliente-card">
                <div className="cliente-info">
                  <p><strong>Nombre:</strong> {cliente.nombre}</p>
                  <p><strong>ID:</strong> {cliente.numero_identificacion}</p>
                  <p><strong>Email:</strong> {cliente.email}</p>
                  <p><strong>Contraseña:</strong> {cliente.password}</p>
                  <p><strong>Fecha de Nacimiento:</strong> {cliente.fechaNac}</p>
                  <p><strong>Género:</strong> {cliente.genero1}</p>
                  <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                </div>
                <div className="cliente-actions">
                  <button onClick={() => handleEditar(cliente)} className="btn btn-edit">Editar</button>
                  <button onClick={() => handleEliminar(cliente.id)} className="btn btn-delete">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientesAdmin;
