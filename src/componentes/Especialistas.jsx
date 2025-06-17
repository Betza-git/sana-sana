import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/Especialista.css'



const Especialistasc = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    especialidades: "",
    email: "",
    password: "",
    genero: "",
    estado: true,
  });

  const [especialidades, setEspecialidades] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // Obtener especialidades desde el backend
    axios.get("http://localhost:8000/api/especialidades/")
      .then((res) => setEspecialidades(res.data))
      .catch((err) => console.error("Error cargando especialidades", err));
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

    try {
      await axios.post("http://localhost:8000/api/especialistas/", formData);
      setMensaje("Especialista registrado correctamente.");
      setFormData({
        nombre: "",
        especialidades: "",
        email: "",
        password: "",
        genero: "",
        estado: true,
      });
    } catch (error) {
      console.error("Error al guardar especialista", error);
      setMensaje("Error al registrar especialista.");
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Area de Profesionales</h1>
      <p className="text-center">Bienvenido</p>
      <div className="row mb-5">
        <div className="col-md-8 offset-md-2">
          <h4 className="mb-3">Registrate</h4>
          {mensaje && <div className="alert alert-info">{mensaje}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Especialidad</label>
                <input
                    type="text"
                    name="especialidades"
                    className="form-control"
                    value={formData.especialidades}
                    onChange={handleChange}
                    required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Guardar Especialista</button>
          </form>
        </div>
      </div>
        <div className="row">
            <div className="col-md-8 offset-md-2">
            <h4 className="mb-3">Datos</h4>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Especialidad</th>
                    <th>Email</th>
                    <th>Género</th>
                </tr>
                </thead>
                <tbody>
                {especialidades.map((esp) => (
                    <tr key={esp.id}>
                    <td>{esp.nombre}</td>
                    <td>{esp.especialidades}</td>
                    <td>{esp.email}</td>
                    <td>{esp.genero}</td>
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
