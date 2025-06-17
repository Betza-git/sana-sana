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
        'Authorization': `Bearer ${token}`,
   
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

export default getUsuario;

