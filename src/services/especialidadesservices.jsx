const API_URL = 'http://127.0.0.1:8000/api/especialidades/';

// Obtener el token del localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Obtener todas las especialidades
export async function getEspecialidades() {
  const token = getToken();
  const response = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al obtener especialidades');
  return await response.json();
}

// Crear una nueva especialidad
export async function postEspecialidad(data) {
  const token = getToken();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al agregar especialidad');
  return await response.json();
}

// Editar una especialidad existente
export async function patchEspecialidad(id, data) {
  const token = getToken();
  const response = await fetch(`${API_URL}${id}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al editar especialidad');
  return await response.json();
}

// Eliminar una especialidad
export async function deleteEspecialidad(id) {
  const token = getToken();
  const response = await fetch(`${API_URL}${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al eliminar especialidad');
  return true;
}

export default {
  getEspecialidades,
  postEspecialidad,
  patchEspecialidad,
  deleteEspecialidad
};