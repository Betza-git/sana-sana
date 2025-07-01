const API_URL = "http://127.0.0.1:8000/api";

// GET todos los datos de admin dashboard
const getAdmin = async () => {
  const response = await fetch(`${API_URL}/admin/`);
  if (!response.ok) throw new Error('Error al obtener administradores');
  return response.json();
};

// GET un admin por ID
const getAdminById = async (id) => {
  const response = await fetch(`${API_URL}/admin/${id}/`);
  if (!response.ok) throw new Error('Error al obtener administrador');
  return response.json();
};

// GET todos los usuarios
const getUsuarios = async () => {
  const response = await fetch(`${API_URL}/clientes/`);
  if (!response.ok) throw new Error('Error al obtener usuarios');
  return response.json();
};

// GET todos los especialistas
const getEspecialistas = async () => {
  const response = await fetch(`${API_URL}/especialistas/`);
  if (!response.ok) throw new Error('Error al obtener especialistas');
  return response.json();
};
// GET todos los empleados
const getEmpleados = async () => {
  const response = await fetch(`${API_URL}/empleados/`);
  if (!response.ok) throw new Error('Error al obtener empleados');
  return response.json();
};


// POST crear usuario/admin/empleado/especialista según urlSuffix dinámico
const postAdmin = async (urlSuffix, data) => {
  const response = await fetch(`${API_URL}/${urlSuffix}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error(`Error al agregar en ${urlSuffix}:`, errorData);
    throw new Error(`Error al agregar en ${urlSuffix}`);
  }
  return response.json();
};

// PATCH actualizar usuario/admin/empleado/especialista según urlSuffix e id
const patchAdmin = async (urlSuffix, id, data) => {
  const response = await fetch(`${API_URL}/${urlSuffix}/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error(`Error al editar en ${urlSuffix}:`, errorData);
    throw new Error(`Error al editar en ${urlSuffix}`);
  }
  return response.json();
};

// DELETE eliminar usuario/admin/empleado/especialista según urlSuffix e id
const deleteAdmin = async (urlSuffix, id) => {
  const response = await fetch(`${API_URL}/${urlSuffix}/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error(`Error al eliminar en ${urlSuffix}:`, errorData);
    throw new Error(`Error al eliminar en ${urlSuffix}`);
  }
  return response;
};

export { getAdmin, getAdminById, getUsuarios, getEspecialistas, getEmpleados, postAdmin, patchAdmin, deleteAdmin };
