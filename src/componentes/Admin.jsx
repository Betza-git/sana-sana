import React, { useEffect, useState } from "react";
import { getAdmin, postAdmin, patchAdmin, deleteAdmin } from "../services/Admin";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "../styles/Admin.css";


const Admin = () => {
  // Estados cargados desde localStorage o vacíos
  const [usuarios, setUsuarios] = useState(() => JSON.parse(localStorage.getItem("usuarios")) || []);
  const [especialistas, setEspecialistas] = useState(() => JSON.parse(localStorage.getItem("especialistas")) || []);
  const [especialidades, setEspecialidades] = useState(() => JSON.parse(localStorage.getItem("especialidades")) || []);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    numero_identificacion: "",
    fecha_nacimiento: "",
    telefono: "",
    cargo: "",
    email: "",
    password: "",
    confirmPassword: "",
    fecha_contratacion: "",
    estado: "activo",
    rol: "usuario",
    activo: true,
    especialidades: "",
    genero1: "",
  });

  // Sincronizar con localStorage
  useEffect(() => { localStorage.setItem("usuarios", JSON.stringify(usuarios)); }, [usuarios]);
  useEffect(() => { localStorage.setItem("especialistas", JSON.stringify(especialistas)); }, [especialistas]);
  useEffect(() => { localStorage.setItem("especialidades", JSON.stringify(especialidades)); }, [especialidades]);

  // Cargar datos desde API si no hay datos locales
  useEffect(() => {
    if (!usuarios.length && !especialistas.length && !especialidades.length) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdmin();
      if (data && typeof data === "object") {
        setUsuarios(data.usuarios || []);
        setEspecialistas(data.especialistas || []);
        setEspecialidades(data.especialidades || []);
      } else {
        throw new Error("Respuesta inválida del servidor");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudieron cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  const validatePasswords = () => {
    if (!editingUser && formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return false;
    }
    return true;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    try {
      setLoading(true);
      const commonFields = {
        nombre: formData.nombre,
        numero_identificacion: formData.numero_identificacion,
        fechaNac: formData.fecha_nacimiento,
        email: formData.email,
        password: formData.password,
        fechaContratacion: formData.fecha_contratacion || new Date().toISOString().split("T")[0],
        estado: formData.estado,
        activo: formData.activo,
        genero1: formData.genero1,
      };

      let urlSuffix = "";
      let dataToSend = {};

      switch (formData.rol) {
        case "usuario":
          urlSuffix = "clientes";
          dataToSend = { ...commonFields, telefono: formData.telefono };
          break;
        case "especialista":
          urlSuffix = "especialistas";
          dataToSend = { ...commonFields, especialidades: formData.especialidades };
          break;
        case "empleado":
          urlSuffix = "empleados";
          dataToSend = { ...commonFields, telefono: formData.telefono, cargo: formData.cargo };
          break;
        default:
          throw new Error("Rol no soportado");
      }

      const response = await postAdmin(urlSuffix, dataToSend);

      if (formData.rol === "usuario") setUsuarios((prev) => [...prev, response]);
      else if (formData.rol === "especialista") setEspecialistas((prev) => [...prev, response]);
      else if (formData.rol === "empleado") setUsuarios((prev) => [...prev, response]); // Ajustar si usas otro estado para empleados

      resetForm();
      Swal.fire("¡Éxito!", "Usuario creado correctamente", "success");
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo crear el usuario", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.password && !validatePasswords()) return;
    try {
      setLoading(true);
      const commonFields = {
        nombre: formData.nombre,
        numero_identificacion: formData.numero_identificacion,
        fecha_nacimiento: formData.fecha_nacimiento,
        email: formData.email,
        fechaContratacion: formData.fecha_contratacion,
        estado: formData.estado,
        activo: formData.activo,
        genero1: formData.genero1,
        ...(formData.password && { password: formData.password }),
      };

      let urlSuffix = "";
      let dataToSend = {};

      switch (formData.rol) {
        case "usuario":
          urlSuffix = "clientes";
          dataToSend = { ...commonFields, telefono: formData.telefono };
          break;
        case "especialista":
          urlSuffix = "especialistas";
          dataToSend = { ...commonFields, especialidades: formData.especialidades };
          break;
        case "empleado":
          urlSuffix = "empleados";
          dataToSend = { ...commonFields, telefono: formData.telefono, cargo: formData.cargo };
          break;
        default:
          throw new Error("Rol no soportado");
      }

      const response = await patchAdmin(urlSuffix, editingUser.id, dataToSend);

      if (formData.rol === "usuario") {
        setUsuarios((prev) => prev.map((u) => (u.id === editingUser.id ? response : u)));
      } else if (formData.rol === "especialista") {
        setEspecialistas((prev) => prev.map((e) => (e.id === editingUser.id ? response : e)));
      } else if (formData.rol === "empleado") {
        setUsuarios((prev) => prev.map((u) => (u.id === editingUser.id ? response : u)));
      }

      resetForm();
      Swal.fire("¡Éxito!", "Usuario actualizado correctamente", "success");
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo actualizar el usuario", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const user =
          usuarios.find((u) => u.id === userId) ||
          especialistas.find((e) => e.id === userId);
        if (!user) throw new Error("Usuario no encontrado");

        let urlSuffix = "";
        switch (user.rol) {
          case "usuario":
            urlSuffix = "clientes";
            break;
          case "especialista":
            urlSuffix = "especialistas";
            break;
          case "empleado":
            urlSuffix = "empleados";
            break;
          default:
            throw new Error("Rol no soportado");
        }

        const response = await deleteAdmin(urlSuffix, userId);

        if (response !== false) {
          if (user.rol === "usuario") setUsuarios((prev) => prev.filter((u) => u.id !== userId));
          else if (user.rol === "especialista") setEspecialistas((prev) => prev.filter((e) => e.id !== userId));
          else if (user.rol === "empleado") setUsuarios((prev) => prev.filter((u) => u.id !== userId));
          Swal.fire("¡Eliminado!", "El usuario ha sido eliminado correctamente", "success");
        } else {
          throw new Error("Error al eliminar el usuario");
        }
      } catch (error) {
        Swal.fire("Error", error.message || "No se pudo eliminar el usuario", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre || "",
      numero_identificacion: user.numero_identificacion || "",
      fecha_nacimiento: user.fecha_nacimiento || "",
      telefono: user.telefono || "",
      cargo: user.cargo || "",
      email: user.email || "",
      password: "",
      confirmPassword: "",
      fecha_contratacion: user.fechaContratacion ? new Date(user.fechaContratacion).toISOString().split("T")[0] : "",
      estado: user.estado || "activo",
      rol: user.rol || "usuario",
      activo: user.activo ?? true,
      especialidades: user.especialidades || "",
      genero1: user.genero1 || "",
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      nombre: "",
      numero_identificacion: "",
      fecha_nacimiento: "",
      telefono: "",
      cargo: "",
      email: "",
      password: "",
      confirmPassword: "",
      fecha_contratacion: new Date().toISOString().split("T")[0],
      estado: "activo",
      rol: "usuario",
      activo: true,
      especialidades: "",
      genero1: "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      numero_identificacion: "",
      fecha_nacimiento: "",
      telefono: "",
      cargo: "",
      email: "",
      password: "",
      confirmPassword: "",
      fecha_contratacion: "",
      estado: "activo",
      rol: "usuario",
      activo: true,
      especialidades: "",
      genero1: "",
    });
    setEditingUser(null);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f5fa" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: "#191c24", color: "#fff", padding: 20 }}>
        <h2 style={{ textAlign: "center", marginBottom: 30 }}>ADMIN</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ margin: "20px 0" }}>Dashboard</li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
                Home
              </Link>
            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/Clientes" style={{ color: "#fff", textDecoration: "none" }}>
                Clientes
              </Link>
            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/especialistas" style={{ color: "#fff", textDecoration: "none" }}>
                Especialistas
              </Link>
            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/empleados" style={{ color: "#fff", textDecoration: "none" }}>
                Empleados
              </Link>
            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/pagos" style={{ color: "#fff", textDecoration: "none" }}>
                Pagos
              </Link>
            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/serviciosdash" style={{ color: "#fff", textDecoration: "none" }}>
                Servicios
              </Link>
            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/Dates" style={{ color: "#fff", textDecoration: "none" }}>
                Citas
              </Link>
            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/Registro" style={{ color: "#fff", textDecoration: "none" }}>
                Registro
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "40px" }}>
        <header
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}
        >
          <h1>Panel de Administración</h1>
          <div>
            <p> Bienvenido</p>
 
          </div>
        </header>

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              background: "#fff",
              borderRadius: 12,
              marginBottom: 20,
              border: "2px solid #6c63ff",
            }}
          >
            <p>Cargando datos...</p>
          </div>
        )}

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

        <section style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3>Usuarios Registrados</h3>
            <button
              onClick={handleAdd}
              disabled={loading}
              style={{
                background: "#6c63ff",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Cargando..." : "Agregar Usuario"}
            </button>
          </div>

          {usuarios.length === 0 && !loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <p>No hay usuarios registrados o hubo un error al cargar los datos.</p>
              <button
                onClick={loadData}
                style={{
                  background: "#6c63ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                  marginTop: 10,
                }}
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>Nombre</th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>Identificación</th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>Email</th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>Rol</th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>Género</th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>Estado</th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>Fecha Contratación</th>
                    <th style={{ textAlign: "center", padding: 8, borderBottom: "2px solid #e9ecef" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((user) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid #e9ecef" }}>
                      <td style={{ padding: 8 }}>{user.nombre}</td>
                      <td style={{ padding: 8 }}>{user.numero_identificacion}</td>
                      <td style={{ padding: 8 }}>{user.email}</td>
                      <td style={{ padding: 8 }}>{user.rol}</td>
                      <td style={{ padding: 8 }}>{user.genero1}</td>
                      <td style={{ padding: 8 }}>{user.estado}</td> 
                      <td style={{ padding: 8 }}>
                        {user.fecha_contratacion
                          ? new Date(user.fecha_contratacion).toLocaleDateString()
                          : ""}
                      </td>
                      <td style={{ padding: 8, textAlign: "center" }}>
                        <button
                          onClick={() => handleEdit(user)}
                          disabled={loading}
                          style={{
                            marginRight: 8,
                            cursor: loading ? "not-allowed" : "pointer",
                            background: "#6c63ff",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 12px",
                            color: "#fff",
                            fontSize: 14,
                          }}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={loading}
                          style={{
                            cursor: loading ? "not-allowed" : "pointer",
                            background: "#ff4d4f",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 12px",
                            color: "#fff",
                            fontSize: 14,
                          }}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Modal */}
        {showModal && (
          <div
            onClick={resetForm}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "600px",
                background: "#fff",
                padding: 24,
                borderRadius: 12,
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {editingUser ? "Editar Usuario" : "Crear Usuario"}
                </h3>
                <button
                  onClick={resetForm}
                  aria-label="Cerrar modal"
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#666",
                    fontWeight: "700",
                  }}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={editingUser ? handleUpdate : handleCreate}>
                {/* Form rows */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label
                      htmlFor="nombre"
                      style={{ display: "block", marginBottom: 8, fontWeight: "500" }}
                    >
                      Nombre:
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="numero_identificacion"
                      style={{ display: "block", marginBottom: 8, fontWeight: "500" }}
                    >
                      Número de Identificación:
                    </label>
                    <input
                      id="numero_identificacion"
                      type="text"
                      name="numero_identificacion"
                      value={formData.numero_identificacion}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label
                      htmlFor="email"
                      style={{ display: "block", marginBottom: 8, fontWeight: "500" }}
                    >
                      Email:
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fecha_nacimiento"
                      style={{ display: "block", marginBottom: 8, fontWeight: "500" }}
                    >
                      Fecha de Nacimiento:
                    </label>
                    <input
                      id="fecha_nacimiento"
                      type="date"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label
                      htmlFor="rol"
                      style={{ display: "block", marginBottom: 8, fontWeight: "500" }}
                    >
                      Rol:
                    </label>
                    <select
                      id="rol"
                      name="rol"
                      value={formData.rol}
                      onChange={handleInputChange}
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="usuario">Usuario</option>
                      <option value="especialista">Especialista</option>
                      <option value="empleado">Empleado</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="estado"
                      style={{ display: "block", marginBottom: 8, fontWeight: "500" }}
                    >
                      Estado:
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="suspendido">Suspendido</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    htmlFor="fecha_contratacion"
                    style={{ display: "block", marginBottom: 8, fontWeight: "500" }}
                  >
                    Fecha de Contratación:
                  </label>
                  <input
                    id="fecha_contratacion"
                    type="date"
                    name="fecha_contratacion"
                    value={formData.fecha_contratacion}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Campos específicos por rol */}
                {formData.rol === "usuario" && (
                  <div style={{ marginBottom: 16 }}>
                    <label
                      htmlFor="telefono"
                      style={{ display: "block", marginBottom: 8, fontWeight: "500" }}
                    >
                      Teléfono:
                    </label>
                    <input
                      id="telefono"
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                )}

                {formData.rol === "especialista" && (
                  <div style={{ marginBottom: 16 }}>
                    <label
                      htmlFor="especialidades"
                      style={{ display: "block", marginBottom: 8, fontWeight: "500" }}
                    >
                      Especialidades:
                    </label>
                    <input
                      id="especialidades"
                      type="text"
                      name="especialidades"
                      value={formData.especialidades}
                      onChange={handleInputChange}
                      disabled={loading}
                      placeholder="Ejemplo: Psicología, Terapia"
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                )}

                {formData.rol === "empleado" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label
                        htmlFor="cargo"
                        style={{ display: "block", marginBottom: 8, fontWeight: "500" }}
                      >
                        Cargo:
                      </label>
                      <input
                        id="cargo"
                        type="text"
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleInputChange}
                        disabled={loading}
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ddd",
                          borderRadius: 4,
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <label
                    htmlFor="genero1"
                    style={{ display: "block", marginBottom: 8, fontWeight: "500" }}
                  >
                    Género:
                  </label>
                  <select
                    id="genero1"
                    name="genero1"
                    value={formData.genero1}
                    onChange={handleInputChange}
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">Seleccione un género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    htmlFor="password"
                    style={{ display: "block", marginBottom: 8, fontWeight: "500" }}
                  >
                    Contraseña:
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    required={!editingUser}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label
                    htmlFor="confirmPassword"
                    style={{ display: "block", marginBottom: 8, fontWeight: "500" }}
                  >
                    Confirmar Contraseña:
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    required={!editingUser}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ textAlign: "right" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: "#6c63ff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 20px",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
