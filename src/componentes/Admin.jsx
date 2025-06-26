import React, { useEffect, useState } from "react";
import { getAdmin, postAdmin, patchAdmin, deleteAdmin } from "../services/Admin";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "../styles/Admin.css"; 

const Admin = () => {
  // Cargar estados desde localStorage o iniciar vacío
  const [usuarios, setUsuarios] = useState(() => {
    const saved = localStorage.getItem("usuarios");
    return saved ? JSON.parse(saved) : [];
  });
  const [especialistas, setEspecialistas] = useState(() => {
    const saved = localStorage.getItem("especialistas");
    return saved ? JSON.parse(saved) : [];
  });
  const [especialidades, setEspecialidades] = useState(() => {
    const saved = localStorage.getItem("especialidades");
    return saved ? JSON.parse(saved) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "", numero_identificacion: "", fecha_nacimiento: "", telefono: "",
    cargo: "", email: "", password: "", confirmPassword: "", fecha_contratacion: "",
    estado: "activo", rol: "usuario", activo: true, especialidades: "", genero1: "",
  });

  // Guardar en localStorage cuando cambien los estados
  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem("especialistas", JSON.stringify(especialistas));
  }, [especialistas]);

  useEffect(() => {
    localStorage.setItem("especialidades", JSON.stringify(especialidades));
  }, [especialidades]);

  // Cargar datos de API solo si localStorage está vacío
  useEffect(() => {
    if (usuarios.length === 0 && especialistas.length === 0 && especialidades.length === 0) {
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
        throw new Error("La respuesta del servidor no es válida");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudieron cargar los datos",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePasswords = () => {
    if (!editingUser && formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return false;
    }
    return true;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    try {
      setLoading(true);
      let dataToSend = {};
      let urlSuffix = "";
      const commonFields = {
        nombre: formData.nombre, numero_identificacion: formData.numero_identificacion,
        fechaNac: formData.fecha_nacimiento, email: formData.email,
        password: formData.password,
        fechaContratacion: formData.fecha_contratacion || new Date().toISOString().split("T")[0],
        estado: formData.estado, activo: formData.activo, genero1: formData.genero1,
      };

      switch (formData.rol) {
        case "usuario":
          urlSuffix = "clientes";
          dataToSend = {
            ...commonFields,
            telefono: formData.telefono,
          };
          break;
        case "especialista":
          urlSuffix = "especialistas";
          dataToSend = {
            ...commonFields,
            especialidades: formData.especialidades,
          };
          break;
        case "empleado":
          urlSuffix = "empleados";
          dataToSend = {
            ...commonFields,
            telefono: formData.telefono,
            cargo: formData.cargo,
          };
          break;
        default:
          throw new Error("Rol no soportado");
      }
      const response = await postAdmin(urlSuffix, dataToSend);

      if (formData.rol === "usuario") setUsuarios([...usuarios, response]);
      else if (formData.rol === "especialista") setEspecialistas([...especialistas, response]);
      else if (formData.rol === "empleado") setUsuarios([...usuarios, response]); // Ajusta si manejas empleados en otro estado

      resetForm();
      Swal.fire({ title: "¡Éxito!", text: "Usuario creado correctamente", icon: "success", confirmButtonText: "Aceptar" });
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message || "No se pudo crear el usuario", icon: "error", confirmButtonText: "Aceptar" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.password && !validatePasswords()) return;
    try {
      setLoading(true);
      let dataToSend = {};
      let urlSuffix = "";
      const commonFields = {
        nombre: formData.nombre,
        numero_identificacion: formData.numero_identificacion,
        fechaNac: formData.fecha_nacimiento,
        email: formData.email,
        fechaContratacion: formData.fecha_contratacion,
        estado: formData.estado,
        activo: formData.activo,
        genero1: formData.genero1,
      };
      if (formData.password) {
        commonFields.password = formData.password;
      }
      switch (formData.rol) {
        case "usuario":
          urlSuffix = "clientes";
          dataToSend = {
            ...commonFields,
            telefono: formData.telefono,
          };
          break;
        case "especialista":
          urlSuffix = "especialistas";
          dataToSend = {
            ...commonFields,
            especialidades: formData.especialidades,
          };
          break;
        case "empleado":
          urlSuffix = "empleados";
          dataToSend = {
            ...commonFields,
            telefono: formData.telefono,
            cargo: formData.cargo,
          };
          break;
        default:
          throw new Error("Rol no soportado");
      }
      const response = await patchAdmin(urlSuffix, editingUser.id, dataToSend);

      if (formData.rol === "usuario") {
        setUsuarios(usuarios.map((user) => (user.id === editingUser.id ? response : user)));
      } else if (formData.rol === "especialista") {
        setEspecialistas(especialistas.map((esp) => (esp.id === editingUser.id ? response : esp)));
      } else if (formData.rol === "empleado") {
        setUsuarios(usuarios.map((user) => (user.id === editingUser.id ? response : user))); // Ajusta si manejas empleados en otro estado
      }

      resetForm();
      Swal.fire({ title: "¡Éxito!", text: "Usuario actualizado correctamente", icon: "success", confirmButtonText: "Aceptar" });
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message || "No se pudo actualizar el usuario", icon: "error", confirmButtonText: "Aceptar" });
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
          if (user.rol === "usuario")
            setUsuarios(usuarios.filter((user) => user.id !== userId));
          else if (user.rol === "especialista")
            setEspecialistas(especialistas.filter((esp) => esp.id !== userId));
          else if (user.rol === "empleado")
            setUsuarios(usuarios.filter((user) => user.id !== userId)); // Ajusta si manejas empleados en otro estado

          Swal.fire({ title: "¡Eliminado!", text: "El usuario ha sido eliminado correctamente", icon: "success", confirmButtonText: "Aceptar" });
        } else {
          throw new Error("Error al eliminar el usuario");
        }
      } catch (error) {
        Swal.fire({ title: "Error", text: error.message || "No se pudo eliminar el usuario", icon: "error", confirmButtonText: "Aceptar" });
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
      fecha_nacimiento: user.fechaNac || "",
      telefono: user.telefono || "",
      cargo: user.cargo || "",
      email: user.email || "",
      password: "",
      confirmPassword: "",
      fecha_contratacion: user.fechaContratacion
        ? new Date(user.fechaContratacion).toISOString().split("T")[0]
        : "",
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
            <li style={{ margin: "20px 0" }}>
              <Link to="/admin" style={{ color: "#fff", textDecoration: "none" }}>
                Dashboard
              </Link>
            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
                Home
              </Link>
            </li>
            <li style={{ margin: "20px 0" }}>
              <Link to="/usuarios" style={{ color: "#fff", textDecoration: "none" }}>
                Usuarios
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
        <header style={{display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 40,
          }}>
          <h1>Panel de Administración</h1>
          <div>
            <img alt="Admin" style={{ width: 40, height: 40, borderRadius: "50%" }} />
          </div>
        </header>

        {loading && (<div style={{textAlign: "center", padding: "20px",
              background: "#fff", borderRadius: 12, marginBottom: 20,
              border: "2px solid #6c63ff",
            }}
          >
            <p>Cargando datos...</p>
          </div>
        )}

        <section style={{ display: "flex", gap: 24, marginBottom: 40 }}>
          <div style={{background: "#fff", borderRadius: 12, padding: 24,
              flex: 1, textAlign: "center",}}>
            <h4 style={{ color: "#6c63ff" }}>Usuarios</h4>
            <h2>{usuarios.length}</h2>
          </div>
          <div style={{background: "#fff", borderRadius: 12, padding: 24,
              flex: 1,textAlign: "center",}}>
            <h4 style={{ color: "#6c63ff" }}>Especialistas</h4>
            <h2>{especialistas.length}</h2>
          </div>
          <div
            style={{background: "#fff", borderRadius: 12, padding: 24, flex: 1,
              textAlign: "center",
            }}>
            <h4 style={{ color: "#6c63ff" }}>Especialidades</h4>
            <h2>{especialidades.length}</h2>
          </div>
        </section>
        <section style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 16,}}>
            <h3>Usuarios Registrados</h3>
            <button onClick={handleAdd} disabled={loading}
            style={{background: "#6c63ff", color: "#fff", border: "none", borderRadius: 8,
            padding: "10px 20px",cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px", fontWeight: "500", opacity: loading ? 0.6 : 1,
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
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>
                      Nombre
                    </th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>
                      Identificación
                    </th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>
                      Email
                    </th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>
                      Rol
                    </th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>
                      Estado
                    </th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>
                      Fecha Contratación
                    </th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>
                      Acciones
                    </th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>
                      Género
                    </th>
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
                      <td style={{ padding: 8 }}>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: 12,
                            background: user.estado === "activo" ? "#e0ffe0" : "#ffe0e0",
                            color: user.estado === "activo" ? "#2ecc40" : "#e74c3c",
                            fontSize: "0.9em",
                          }}
                        >
                          {user.estado}
                        </span>
                      </td>
                      <td style={{ padding: 8 }}>{user.fecha_contratacion}</td>
                      <td style={{ padding: 8 }}>
                        <button
                          onClick={() => handleEdit(user)}
                          disabled={loading}
                          style={{
                            background: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "6px 12px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: "12px",
                            marginRight: 8,
                            opacity: loading ? 0.6 : 1,
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={loading}
                          style={{
                            background: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "6px 12px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: "12px",
                            opacity: loading ? 0.6 : 1,
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={resetForm}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 24,
                width: "90%",
                maxWidth: 600,
                maxHeight: "90vh",
                overflow: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
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
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#666",
                  }}
                ></button>
              </div>
              <form onSubmit={editingUser ? handleUpdate : handleCreate}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>
                      Nombre:
                    </label>
                    <input
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
                    /></div>
                  <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>
                      Número de Identificación:
                    </label>
                    <input
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
                    <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>
                      Email:
                    </label>
                    <input
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
                    <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>
                      Fecha de Nacimiento:
                    </label>
                    <input
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
                    <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>
                      Rol:
                    </label>
                    <select
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
                    <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>
                      Estado:
                    </label>
                    <select
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
                  <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>
                    Fecha de Contratación:
                  </label>
                  <input
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

                {/* Campos específicos según rol */}
                {formData.rol === "usuario" && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>
                      Teléfono:
                    </label>
                    <input
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
                    <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>
                      Especialidades:
                    </label>
                    <input
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
                      <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>
                        Cargo:
                      </label>
                      <input
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
                  <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>
                    Género:
                  </label>
                  <select
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
                  <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>
                    Contraseña:
                  </label>
                  <input
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
                  <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>
                    Confirmar Contraseña:
                  </label>
                  <input
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
}


export default Admin; 