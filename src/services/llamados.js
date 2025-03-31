const API_URL = "http://localhost:3000/"


async function postData(obj,endpoint) {
    try {
        const peticion = await fetch(API_URL+endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        const datos = await peticion.json();
        return datos;
    } catch (error) {
        console.error(error);
    }
}

async function getData(endpoint) {
    try {
        const peticion = await fetch(API_URL+endpoint)
        const datos = await peticion.json()
       // console.log(datos);
        return datos
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