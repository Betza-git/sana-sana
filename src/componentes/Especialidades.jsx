import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {getEspecialidades, postEspecialidad, patchEspecialidad,deleteEspecialidad} 
from '../services/especialidadesservices';

const Especialidadesc = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState({ nombre: '', descripcion: '' });
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    const cargarEspecialidades = async () => {
      try {
        const data = await getEspecialidades();
        setEspecialidades(data);
      } catch (e) {
        Swal.fire('Error', 'Error al obtener especialidades', 'error');
      } finally {
        setLoading(false);
      }
    };
    cargarEspecialidades();
  }, []);

  const handleInputChange = (e) => {
    setNuevaEspecialidad({ ...nuevaEspecialidad, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const agregarEspecialidad = async () => {
    if (!nuevaEspecialidad.nombre.trim() || !nuevaEspecialidad.descripcion.trim()) {
      Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning');
      return;
    }
    try {
      const nueva = await postEspecialidad(nuevaEspecialidad);
      setEspecialidades([...especialidades, nueva]);
      setNuevaEspecialidad({ nombre: '', descripcion: '' });
      Swal.fire('¡Éxito!', 'Especialidad agregada', 'success');
    } catch (e) {
      Swal.fire('Error', 'Error al agregar especialidad', 'error');
    }
  };

  const eliminarEspecialidad = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (confirm.isConfirmed) {
      try {
        await deleteEspecialidad(id);
        setEspecialidades(especialidades.filter(e => e.id !== id));
        Swal.fire('Eliminado', 'Especialidad eliminada', 'success');
      } catch (e) {
        Swal.fire('Error', 'Error al eliminar especialidad', 'error');
      }
    }
  };

  const iniciarEdicion = (esp) => {
    setEditando(esp.id);
    setEditData({ nombre: esp.nombre, descripcion: esp.descripcion });
  };

  const guardarEdicion = async (id) => {
    if (!editData.nombre.trim() || !editData.descripcion.trim()) {
      Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning');
      return;
    }
    try {
      const actualizada = await patchEspecialidad(id, editData);
      setEspecialidades(especialidades.map(e => e.id === id ? actualizada : e));
      setEditando(null);
      setEditData({ nombre: '', descripcion: '' });
      Swal.fire('¡Éxito!', 'Especialidad editada', 'success');
    } catch (e) {
      Swal.fire('Error', 'Error al editar especialidad', 'error');
    }
  };

  if (loading) return <p>Cargando especialidades...</p>;

  return (
    <div className="especialistas-container">
      <h1 className="especialistas-title">Especialidades</h1>
      <form className="especialista-form" onSubmit={e => { e.preventDefault(); agregarEspecialidad(); }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la especialidad"
          value={nuevaEspecialidad.nombre}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={nuevaEspecialidad.descripcion}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Agregar</button>
      </form>
      <ul className="especialistas-list">
        {especialidades.map(esp => (
          <li className="especialista-card" key={esp.id}>
            {editando === esp.id ? (
              <>
                <input
                  name="nombre"
                  value={editData.nombre}
                  onChange={handleEditChange}
                  required
                />
                <input
                  name="descripcion"
                  value={editData.descripcion}
                  onChange={handleEditChange}
                  required
                />
                <div className="especialista-actions">
                  <button onClick={() => guardarEdicion(esp.id)}>Guardar</button>
                  <button onClick={() => setEditando(null)}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <div className="especialista-info">
                  <span className="especialista-nombre">{esp.nombre}</span>
                  <span className="especialista-especialidad">{esp.descripcion}</span>
                </div>
                <div className="especialista-actions">
                  <button onClick={() => iniciarEdicion(esp)}>Editar</button>
                  <button className="eliminar" onClick={() => eliminarEspecialidad(esp.id)}>Eliminar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Especialidadesc; 