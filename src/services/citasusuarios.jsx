// usuarioservices.js - Actualizado
const API_BASE_URL = 'http://localhost:8000/api'; // Ajusta según tu configuración

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Headers con autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Obtener perfil del usuario autenticado
export const getMiUsuario = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cliente/me/`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener el perfil del usuario');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getMiUsuario:', error);
    throw error;
  }
};

// Actualizar perfil del usuario autenticado
export const patchMiUsuario = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cliente/me/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar el perfil');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en patchMiUsuario:', error);
    throw error;
  }
};

// Eliminar cuenta del usuario autenticado
export const deleteMiUsuario = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cliente/me/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar la cuenta');
    }
    
    // Limpiar el localStorage después de eliminar la cuenta
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    return true;
  } catch (error) {
    console.error('Error en deleteMiUsuario:', error);
    throw error;
  }
};

// citas.js - Servicios para citas
// Obtener citas del usuario autenticado
export const getCitasUsuario = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/mis-citas/`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener las citas');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getCitasUsuario:', error);
    throw error;
  }
};

// Crear nueva cita
export const postCita = async (citaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/crear-cita/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(citaData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear la cita');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en postCita:', error);
    throw error;
  }
};

// Actualizar cita existente
export const patchCita = async (citaId, citaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/actualizar-cita/${citaId}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(citaData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar la cita');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en patchCita:', error);
    throw error;
  }
};

// Eliminar cita
export const deleteCita = async (citaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/eliminar-cita/${citaId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar la cita');
    }
    
    return true;
  } catch (error) {
    console.error('Error en deleteCita:', error);
    throw error;
  }
};

// servicios.js - Servicios disponibles
export const getServicios = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/servicios-disponibles/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener los servicios');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getServicios:', error);
    throw error;
  }
};

// especialistas.js - Especialistas disponibles
export const getEspecialistas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/especialistas-disponibles/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener los especialistas');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getEspecialistas:', error);
    throw error;
  }
};

// Obtener especialistas por servicio
export const getEspecialistasPorServicio = async (servicioId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/especialistas-por-servicio/${servicioId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener los especialistas para este servicio');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getEspecialistasPorServicio:', error);
    throw error;
  }
};



export default {
  getMiUsuario,
  getCitasUsuario,
  postCita,
  patchCita,
  deleteCita,
  getServicios,
  getEspecialistas,
  getEspecialistasPorServicio
};