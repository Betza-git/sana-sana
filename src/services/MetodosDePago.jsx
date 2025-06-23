const API_URL = "http://127.0.0.1:8000"

const getmetodopago = async () => {
  const response = await fetch(`${API_URL}/api/metodopago/`);
  if (!response.ok) throw new Error('Error al obtener métodos de pago');
  return response.json();
};

const postmetodopago = async (metodo) => {
  const response = await fetch(`${API_URL}/api/metodopago/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metodo)
  });

  if (!response.ok) throw new Error('Error al agregar método de pago');
  return response.json();
};

const patchmetodopago = async (id, metodo) => {
  const response = await fetch(`${API_URL}/api/metodopago/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metodo)
  });
  if (!response.ok) throw new Error('Error al editar método de pago');
  return response.json();
};

const deletemetodopago = async (id) => {
  const response = await fetch(`${API_URL}/api/metodopago/${id}/`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Error al eliminar método de pago');
  return response.json();
};

export { getmetodopago, postmetodopago, patchmetodopago, deletemetodopago };