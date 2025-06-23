const API_URL = "http://127.0.0.1:8000"

const getEmpleados = async () => {
  const response = await fetch(`${API_URL}/api/empleados/`);
  if (!response.ok) throw new Error('Error al obtener empleados');
  return response.json();
};

const postEmpleado = async (empleado) => {
  const response = await fetch(`${API_URL}/api/empleados/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empleado)
  });

  if (!response.ok) throw new Error('Error al agregar empleado');
  return response.json();
};

const patchEmpleado = async (id, empleado) => {
  const response = await fetch(`${API_URL}/api/empleados/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empleado)
  });
  if (!response.ok) throw new Error('Error al editar empleado');
  return response.json();
};

const deleteEmpleado = async (id) => {
  const response = await fetch(`${API_URL}/api/empleados/${id}/`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Error al eliminar empleado');
  return response.json();
};

export { getEmpleados, postEmpleado, patchEmpleado, deleteEmpleado };