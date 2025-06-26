const API_URL = "http://127.0.0.1:8000/api";

export async function getUsuario(id) {
  try {
    const token = localStorage.getItem('token');
    

    if (!token || !id) {
      console.error("Token o ID de usuario no encontrados en localStorage.");
      return null;
    }

    const peticion = await fetch(`${API_URL}/clientes/${id}/`, {
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

export async function patchUsuario(id, data) {
  try {
    const token = localStorage.getItem('token');

    if (!token || !id) {
      console.error("Token o ID de usuario no encontrados en localStorage.");
      return null;
    }

    const peticion = await fetch(`${API_URL}/clientes/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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





export default {
  getUsuario,
  patchUsuario
};
