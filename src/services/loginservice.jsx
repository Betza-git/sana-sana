const API_URL = "http://127.0.0.1:8000"


export async function postLogin(endpoint, obj) {
    try {
        const peticion = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        return await peticion.json();
    } catch (error) {
        console.error(error);
    }
}

export default postLogin;