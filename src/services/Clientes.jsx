const API_URL = "http://127.0.0.1:8000"

const getClientes = async () => {
  const response = await fetch(`${API_URL}/api/clientes/`);
  if (!response.ok) throw new Error('Error al obtener clientes');
  return response.json();
};

const postCliente = async (cliente) => {
  const response = await fetch(`${API_URL}/api/clientes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente)
  });

 
  if (!response.ok) throw new Error('Error al agregar cliente');
  return response.json();
};




const patchCliente = async (id, cliente) => {
  const response = await fetch(`${API_URL}/api/clientes/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente)
  });
  if (!response.ok) throw new Error('Error al editar cliente');
  return response.json();
};

const deleteCliente = async (id) => {
  const response = await fetch(`${API_URL}/api/clientes/${id}/`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Error al eliminar cliente');
  return response.json();
};

export { getClientes, postCliente, patchCliente, deleteCliente };