import '../styles/Empleados.css';
import { getmetodopago, postmetodopago, patchmetodopago, deletemetodopago } from '../services/MetodosDePago';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

const MetodosDePago = () => {
  const [metodos, setMetodos] = useState([]);
  const [nuevoMetodo, setNuevoMetodo] = useState('');
  const [editarMetodo, setEditarMetodo] = useState({ id: null, nombre: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarMetodos();
  }, []);

  const cargarMetodos = async () => {
    try {
      const data = await getmetodopago();
      setMetodos(data);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const agregarMetodo = async () => {
    if (!nuevoMetodo.trim()) return;
    try {
      const data = await postmetodopago({ nombre: nuevoMetodo });
      setMetodos([...metodos, data]);
      setNuevoMetodo('');
      Swal.fire('Éxito', 'Método de pago agregado', 'success');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const editarMetodoHandler = (metodo) => {
    setEditarMetodo(metodo);
  };

  const actualizarMetodo = async () => {
    if (!editarMetodo.nombre.trim()) return;
    try {
      const data = await patchmetodopago(editarMetodo.id, { nombre: editarMetodo.nombre });
      setMetodos(metodos.map(m => (m.id === data.id ? data : m)));
      setEditarMetodo({ id: null, nombre: '' });
      Swal.fire('Éxito', 'Método de pago actualizado', 'success');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const eliminarMetodo = async (id) => {
    try {
      await deletemetodopago(id);
      setMetodos(metodos.filter(m => m.id !== id));
      Swal.fire('Éxito', 'Método de pago eliminado', 'success');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  if (loading) return <p>Cargando métodos de pago...</p>;

  return (
    <div className="metodos-de-pago">
      <h1>Métodos de Pago</h1>
      
      <div className="nuevo-metodo">
        <input
          type="text"
          value={nuevoMetodo}
          onChange={(e) => setNuevoMetodo(e.target.value)}
          placeholder="Nuevo método de pago"
        />
        <button onClick={agregarMetodo}>Agregar</button>
      </div>

      <div className="lista-metodos">
        {metodos.map(metodo => (
          <div key={metodo.id} className="metodo">
            <span>{metodo.nombre}</span>
            <button onClick={() => editarMetodoHandler(metodo)}>Editar</button>
            <button onClick={() => eliminarMetodo(metodo.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetodosDePago;