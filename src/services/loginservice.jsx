const API_URL = "http://127.0.0.1:8000"

export async function postLogin(obj) {
  try {
    const peticion = await fetch(`${API_URL}/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });

    if (!peticion.ok) {
      // Lanza error si status no es 200 para entrar en catch
      throw new Error(`Error ${peticion.status}`);
    }

    return await peticion.json();
  } catch (error) {
    console.error("Error en postLogin:", error);
    throw error; 
  }
}

export default postLogin;
