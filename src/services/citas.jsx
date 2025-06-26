
// src/services/citaservices.js
import axios from 'axios';
const API_URL = 'http://localhost:8000/api';

export const getCitasUsuario = async (userId) => {
  const response = await axios.get(`${API_URL}/citas/?usuario_id=${userId}`);
  return response.data;
};

export const postCita = async (cita) => {
  const response = await axios.post(`${API_URL}/citas/`, cita);
  return response.data;
};

export const patchCita = async (id, cita) => {
  const response = await axios.patch(`${API_URL}/citas/${id}/`, cita);
  return response.data;
};

export const deleteCita = async (id) => {
  const response = await axios.delete(`${API_URL}/citas/${id}/`);
  return response.data;
};
export const getCita = async (id) => {
  const response = await axios.get(`${API_URL}/citas/${id}/`);
  return response.data;
};


export default {
  getCitasUsuario,
  postCita,
  patchCita,
  deleteCita,
  getCita,
};