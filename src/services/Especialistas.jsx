import axios from 'axios';


const API_URL = 'http://127.0.0.1:8000/api/especialistas/';

// Obtener el token del localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Obtener todas las especialidades
export async function getEspecialistas() {
  const token = getToken();
  const response = await fetch(API_URL, {
    headers: {
  
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al obtener especialistas');
  return await response.json();
}

// Crear un nuevo especialista
export async function postEspecialistas(data) {
  const token = getToken();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {

      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al agregar especialista');
  return await response.json();
}

// Editar un especialista existente
export async function patchEspecialistas(id, data) {
  const token = getToken();
  const response = await fetch(`${API_URL}${id}/`, {
    method: 'PATCH',
    headers: {
      
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al editar especialista');
  return await response.json();
}

// Eliminar un especialista
export async function deleteEspecialistas(id) {
  const token = getToken();
  const response = await fetch(`${API_URL}${id}/`, {
    method: 'DELETE',
    headers: {
      
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al eliminar especialista');
  return true;
}

export const getespecialistas = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};





export default {
  getEspecialistas,
  postEspecialistas,
  patchEspecialistas,
  deleteEspecialistas,
  getespecialistas
};