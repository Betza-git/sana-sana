const API_URL = "http://127.0.0.1:8000"

const getAdmin = async () => {
  const response = await fetch(`${API_URL}/admin/`);
  if (!response.ok) throw new Error('Error al obtener administradores');
  return response.json();
};

const postAdmin = async (admin) => {
  const response = await fetch(`${API_URL}/admin/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(admin)
  });

  if (!response.ok) throw new Error('Error al agregar administrador');
  return response.json();
};

const patchAdmin = async (id, admin) => {
  const response = await fetch(`${API_URL}/admin/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(admin)
  });
  if (!response.ok) throw new Error('Error al editar administrador');
  return response.json();
};

const deleteAdmin = async (id) => {
  const response = await fetch(`${API_URL}/admin/${id}/`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Error al eliminar administrador');
  return response.json();
};

export { getAdmin, postAdmin, patchAdmin, deleteAdmin };