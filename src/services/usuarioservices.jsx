const API_URL = "http://127.0.0.1:8000/";

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("Token no encontrado en localStorage.");
    return null;
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

export async function getMiUsuario() {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await fetch(`${API_URL}api/clientes/me/`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener usuario autenticado:", error);
    return null;
  }
}

export async function patchMiUsuario(data) {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await fetch(`${API_URL}api/clientes/me/`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar usuario autenticado:", error);
    return null;
  }
}

export async function deleteMiUsuario() {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await fetch(`${API_URL}api/clientes/me/`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // En delete usualmente no hay json, depende de la API
    return true;
  } catch (error) {
    console.error("Error al eliminar usuario autenticado:", error);
    return false;
  }
}

// Si quieres listar todos los usuarios (solo admins)
// usa el endpoint normal con token
export async function getAllUsuarios() {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await fetch(`${API_URL}api/clientes/`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener lista de usuarios:", error);
    return null;
  }
}



export default {
  getMiUsuario,
  patchMiUsuario,
  deleteMiUsuario,
  getAllUsuarios,
};
