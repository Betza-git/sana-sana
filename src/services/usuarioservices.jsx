const API_URL = "http://127.0.0.1:8000/";

export async function getUsuario(id) {
  try {
    const token = localStorage.getItem('token');
    if (!token || !id) {
      console.error("Token o ID de usuario no encontrados en localStorage.");
      return null;
    }

    const peticion = await fetch(`${API_URL}api/clientes/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!peticion.ok) {
      throw new Error(`Error: ${peticion.status} ${peticion.statusText}`);
    }

    return await peticion.json();
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    return null;
  }
}

export const getAllUsuarios = async () => {
  const response = await fetch(`${API_URL}api/clientes/`);
  if (!response.ok) throw new Error('Error al obtener usuarios');
  return response.json();
};

export async function patchUsuario(id, data) {
  try {
    const token = localStorage.getItem('token');

    if (!token || !id) {
      console.error("Token o ID de usuario no encontrados en localStorage.");
      return null;
    }

    const peticion = await fetch(`${API_URL}api/clientes/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify(data)
    });

    if (!peticion.ok) {
      throw new Error(`Error: ${peticion.status} ${peticion.statusText}`);
    }

    return await peticion.json();
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return null;
  }
}

export async function postUsuario(data) {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("Token no encontrado en localStorage.");
      return null;
    }

    const peticion = await fetch(`${API_URL}api/clientes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify(data)
    });

    if (!peticion.ok) {
      throw new Error(`Error: ${peticion.status} ${peticion.statusText}`);
    }

    return await peticion.json();
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return null;
  }
}

export async function deleteUsuario(id) {
  try {
    const token = localStorage.getItem('token');

    if (!token || !id) {
      console.error("Token o ID de usuario no encontrados en localStorage.");
      return null;
    }

    const peticion = await fetch(`${API_URL}api/clientes/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
       
      }
    });

    if (!peticion.ok) {
      throw new Error(`Error: ${peticion.status} ${peticion.statusText}`);
    }

    return await peticion.json();
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return null;
  }
}





export default {
  getUsuario,
  patchUsuario,
  postUsuario,
  deleteUsuario
};
