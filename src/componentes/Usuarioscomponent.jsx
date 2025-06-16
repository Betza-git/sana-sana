import React, { useEffect, useState } from 'react';
import { getUsuario } from '../services/usuarioservices';

const Usuarios = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      const id = localStorage.getItem('userid');
      if (!id) { 
        setError('ID de usuario no encontrado en localStorage');
        setLoading(false);
        return;
      }

      try {
        const data = await getUsuario(id);
        console.log(data)
        if (!data) {
          setError('No se encontró usuario con ese ID');
        } else {
          setUsuario(data);
        }
      } catch (e) {
        setError('Error al obtener usuario');
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, []);

  if (loading) return <p>Cargando usuario...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Datos del Usuario</h1>
      <p>Nombre: {usuario.nombre}</p>
      <p>Email: {usuario.email}</p>


    </div>
  );
};

export default Usuarios;
