const API_URL = "http://127.0.0.1:8000"


async function postData(obj,endpoint) {
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

async function getData(endpoint) {
    try {
        const peticion = await fetch(`${API_URL}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        return await peticion.json();
    } catch (error) {
        console.error(error);
    }
}

async function patchData(id, usuarios,endpoint) {
    console.log(usuarios);
    try {
        const peticion = await fetch(API_URL+endpoint + "/"+ id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuarios)
        })
        const datos = await peticion.json();
        console.log(datos);
        return datos;

    } catch (error) {
        console.error(error);
    }
}

async function deleteData(id,endpoint) {
    try {
        const peticion = await fetch(API_URL + endpoint +"/"+id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const datos = await peticion.json();
        console.log(datos);
        return datos;
        
    } catch (error) {
        console.error(error);
    }
}


export { postData, getData, patchData, deleteData }