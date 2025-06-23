const API_URL = "http://127.0.0.1:8000"

const getpagos = async () => {
  const response = await fetch(`${API_URL}/api/pago/`);
  if (!response.ok) throw new Error('Error al obtener pagos');
  return response.json();
};

const postpagos = async (pago) => {
  const response = await fetch(`${API_URL}/api/pago/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pago)
  });

  if (!response.ok) throw new Error('Error al agregar pago');
  return response.json()
};

const patchpagos = async (id, pago) => {
  const response = await fetch(`${API_URL}/api/pago/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pago) 
  });
  if (!response.ok) throw new Error('Error al editar pago');
  return response.json();
};

const deletepagos = async (id) => {
  const response = await fetch(`${API_URL}/api/pago/${id}/`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Error al eliminar pago');
  return response.json();
};

export { getpagos, postpagos, patchpagos, deletepagos };