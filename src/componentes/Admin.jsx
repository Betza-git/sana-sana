import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Usuarios from "./Usuarioscomponent";

const datosSimulados = {
  usuarios: [
    { id: 1, nombre: "Ana López", email: "ana@correo.com", rol: "admin", activo: true },
    { id: 2, nombre: "Carlos Ruiz", email: "carlos@correo.com", rol: "usuario", activo: true },
    { id: 3, nombre: "Marta Díaz", email: "marta@correo.com", rol: "especialista", activo: false },
  ],
  especialistas: [
    { id: 1, nombre: "Dr. Juan Pérez", especialidad: "Psicología" },
    { id: 2, nombre: "Dra. Laura Gómez", especialidad: "Psiquiatría" },
  ],
  especialidades: [
    { id: 1, nombre: "Psicología" },
    { id: 2, nombre: "Psiquiatría" },
    { id: 3, nombre: "Terapia Ocupacional" },
  ],
};

const Admin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [especialistas, setEspecialistas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    // Simulación de carga de datos
    setUsuarios(datosSimulados.usuarios);
    setEspecialistas(datosSimulados.especialistas);
    setEspecialidades(datosSimulados.especialidades);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f5fa" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: "#191c24", color: "#fff", padding: 20 }}>
        <h2 style={{ textAlign: "center", marginBottom: 30 }}>ADMIN</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ margin: "20px 0" }}>
              <Link to="/admin" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link>
            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/especialistas" style={{ color: "#fff", textDecoration: "none" }}>Especialistas</Link>
            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/Dates" style={{ color: "#fff", textDecoration: "none" }}>Citas</Link>

            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/usuarios" style={{ color: "#fff", textDecoration: "none" }}>Usuarios</Link>
            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/Registro" style={{ color: "#fff", textDecoration: "none" }}>Registro</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <h1>Panel de Administración</h1>
          <div>
            <img
              alt="Admin"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          </div>
        </header>

        {/* Cards */}
        <section style={{ display: "flex", gap: 24, marginBottom: 40 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, flex: 1, textAlign: "center" }}>
            <h4 style={{ color: "#6c63ff" }}>Usuarios</h4>
            <h2>{usuarios.length}</h2>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, flex: 1, textAlign: "center" }}>
            <h4 style={{ color: "#6c63ff" }}>Especialistas</h4>
            <h2>{especialistas.length}</h2>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, flex: 1, textAlign: "center" }}>
            <h4 style={{ color: "#6c63ff" }}>Especialidades</h4>
            <h2>{especialidades.length}</h2>
          </div>
        </section>

        {/* Table */}
        <section style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Usuarios Registrados</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8 }}>Nombre</th>
                <th style={{ textAlign: "left", padding: 8 }}>Email</th>
                <th style={{ textAlign: "left", padding: 8 }}>Rol</th>
                <th style={{ textAlign: "left", padding: 8 }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: 8 }}>{user.nombre}</td>
                  <td style={{ padding: 8 }}>{user.email}</td>
                  <td style={{ padding: 8 }}>{user.rol}</td>
                  <td style={{ padding: 8 }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: 12,
                        background: user.activo ? "#e0ffe0" : "#ffe0e0",
                        color: user.activo ? "#2ecc40" : "#e74c3c",
                        fontSize: "0.9em",
                      }}
                    >
                      {user.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Admin;