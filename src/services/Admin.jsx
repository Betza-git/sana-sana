const API_URL = "http://127.0.0.1:8000/api";

const getAdmin = async () => {
  const response = await fetch(`${API_URL}/admin-dashboard/`);
  if (!response.ok) throw new Error('Error al obtener administradores');
  return response.json();
};

const getAdminById = async (id) => {
  const response = await fetch(`${API_URL}/admin-dashboard/${id}/`);
  if (!response.ok) throw new Error('Error al obtener administrador');
  return response.json();
};

const postAdmin = async (urlSuffix, admin) => {
  const response = await fetch(`${API_URL}/${urlSuffix}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(admin)
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error al agregar administrador:', errorData);
    throw new Error('Error al agregar administrador');
  }
  return response.json();
};

// PATCH con urlSuffix dinámico, id y datos
const patchAdmin = async (urlSuffix, id, admin) => {
  const response = await fetch(`${API_URL}/${urlSuffix}/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(admin)
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error al editar administrador:', errorData);
    throw new Error('Error al editar administrador');
  }
  return response.json();
};

// DELETE con urlSuffix dinámico y id
const deleteAdmin = async (urlSuffix, id) => {
  const response = await fetch(`${API_URL}/${urlSuffix}/${id}/`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error al eliminar administrador:', errorData);
    throw new Error('Error al eliminar administrador');
  }
  return response;
};

export { getAdmin, getAdminById, postAdmin, patchAdmin, deleteAdmin };
