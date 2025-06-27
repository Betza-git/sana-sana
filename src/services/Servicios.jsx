const API_URL = "http://127.0.0.1:8000"

const getServicios = async () => {
  const response = await fetch(`${API_URL}/api/servicios/`);
  if (!response.ok) throw new Error('Error al obtener servicios');
  return response.json();
};

const postServicios = async (servicio) => {
  const response = await fetch(`${API_URL}/api/servicios/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(servicio)
  });

  if (!response.ok) throw new Error('Error al agregar servicio');
  return response.json()
};

const patchServicios = async (nombre, data) => {
  try {
    const response = await fetch(`${API_URL}/api/serviciosdash/${nombre}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text(); 
      console.error('Error backend:', errorText); 
      throw new Error('Error al editar servicio');
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const deleteServicios = async (id) => {
  const response = await fetch(`${API_URL}/api/servicios/${id}/`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Error al eliminar servicio');
  return response.json();
};

export { getServicios, postServicios, patchServicios, deleteServicios };