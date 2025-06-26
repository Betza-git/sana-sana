import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import '../styles/Especialista.css';

const Especialistasc = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    especialidades: "",
    email: "",
    password: "",
    confirmPassword: "",
    genero: "",
    estado: true,
    fecha_registro: new Date().toISOString().slice(0, 10),
  });

  const [especialidades, setEspecialidades] = useState([]);
  const [especialistas, setEspecialistas] = useState([]);
  const [idEditar, setIdEditar] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resEspecialidades = await axios.get("http://localhost:8000/api/especialidades/");
        setEspecialidades(resEspecialidades.data);

        const resEspecialistas = await axios.get("http://localhost:8000/api/especialistas/");
        setEspecialistas(resEspecialistas.data);
      } catch (error) {
        console.error("Error cargando datos", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }

    if (!formData.especialidades) {
      Swal.fire("Error", "Debe seleccionar una especialidad", "error");
      return;
    }

    const payload = {
      nombre: formData.nombre,
      especialidades: formData.especialidades,
      email: formData.email,
      password: formData.password,
      genero: formData.genero,
      estado: formData.estado,
      fecha_registro: formData.fecha_registro,
    };

    try {
      if (idEditar) {
        const res = await axios.patch(`http://localhost:8000/api/especialistas/${idEditar}/`, payload);
        Swal.fire("Actualizado", "Especialista actualizado correctamente.", "success");
        setEspecialistas(prev => prev.map(esp => (esp.id === idEditar ? res.data : esp)));
      } else {
        const res = await axios.post("http://localhost:8000/api/especialistas/", payload);
        Swal.fire("Éxito", "Especialista registrado correctamente.", "success");
        setEspecialistas([...especialistas, res.data]);
      }
      limpiarFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al guardar especialista", error.response?.data || error);
      Swal.fire("Error", JSON.stringify(error.response?.data || "Error desconocido"), "error");
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: "",
      especialidades: "",
      email: "",
      password: "",
      confirmPassword: "",
      genero: "",
      estado: true,
      fecha_registro: new Date().toISOString().slice(0, 10),
    });
    setIdEditar(null);
  };

  const prepararEdicion = (esp) => {
    setFormData({
      nombre: esp.nombre,
      especialidades: esp.especialidades,
      email: esp.email,
      password: esp.password,
      confirmPassword: esp.password,
      genero: esp.genero,
      estado: esp.estado,
      fecha_registro: esp.fecha_registro,
    });
    setIdEditar(esp.id);
    setMostrarFormulario(true);
  };

  const eliminarEspecialista = async (id) => {
    const res = await Swal.fire({
      title: "¿Eliminar?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (res.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/especialistas/${id}/`);
        setEspecialistas(especialistas.filter(e => e.id !== id));
        Swal.fire("Eliminado", "Especialista eliminado", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  return (
    <div className="containerespecialistas">
      <h1 className="text-center my-4">Área de Profesionales</h1>

      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? 'Cerrar Formulario' : 'Registrar Especialista'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="row mb-5">
          <div className="col-md-8 offset-md-2">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Especialidad</label>
                <select name="especialidades" className="form-select" value={formData.especialidades} onChange={handleChange} required>
                  <option value="">Seleccione una especialidad</option>
                  {especialidades.map((esp) => (
                    <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Género</label>
                <select name="genero" className="form-select" value={formData.genero} onChange={handleChange} required>
                  <option value="">Seleccione</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirmar Contraseña</label>
                <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de Registro</label>
                <input type="date" name="fecha_registro" className="form-control" value={formData.fecha_registro} onChange={handleChange} required />
              </div>

              <button type="submit" className="btn btn-success">
                {idEditar ? 'Actualizar Especialista' : 'Guardar Especialista'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-10 offset-md-1">
          <h4 className="mb-3">Lista de Especialistas</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Email</th>
                <th>Género</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {especialistas.map((esp) => (
                <tr key={esp.id}>
                  <td>{esp.nombre}</td>
                  <td>{especialidades.find(e => e.id === esp.especialidades)?.nombre || 'Desconocido'}</td>
                  <td>{esp.email}</td>
                  <td>{esp.genero}</td>
                  <td>{esp.fecha_registro}</td>
                  <td>
                    <button onClick={() => prepararEdicion(esp)} className="btn btn-warning btn-sm">Editar</button>
                    <button onClick={() => eliminarEspecialista(esp.id)} className="btn btn-danger btn-sm ms-2">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Especialistasc;
