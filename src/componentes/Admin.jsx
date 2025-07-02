import React, { useEffect, useState } from "react";
import {
  getAdmin, getAdminById, getUsuarios, getEspecialistas, getEmpleados, postAdmin,
  patchAdmin, deleteAdmin
} from "../services/Admin";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "../styles/Admin.css";


const Admin = () => {
  const [usuarios, setUsuarios] = useState(() => JSON.parse(localStorage.getItem("usuarios")) || []);
  const [especialistas, setEspecialistas] = useState(() => JSON.parse(localStorage.getItem("especialistas")) || []);
  const [especialidades, setEspecialidades] = useState(() => JSON.parse(localStorage.getItem("especialidades")) || []);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [formData, setFormData] = useState(getInitialFormData());

  // Sincronizar con localStorage
  useEffect(() => { localStorage.setItem("usuarios", JSON.stringify(usuarios)); }, [usuarios]);
  useEffect(() => { localStorage.setItem("especialistas", JSON.stringify(especialistas)); }, [especialistas]);
  useEffect(() => { localStorage.setItem("especialidades", JSON.stringify(especialidades)); }, [especialidades]);

  // Cargar datos iniciales
  useEffect(() => {
    if (!dataLoaded) {
      loadData();
    }
  }, [dataLoaded]);

  // Validar consistencia de datos periódicamente
  useEffect(() => {
    if (dataLoaded) {
      validateDataConsistency();
    }
  }, [usuarios, especialistas, dataLoaded]);

  // Obtener datos iniciales del servidor
  function getInitialFormData() {
    return {
      nombre: "", numero_identificacion: "", fecha_nacimiento: "", telefono: "",
      cargo: "", email: "", password: "", confirmPassword: "",
      fecha_contratacion: "", estado: "activo", rol: "usuario",
      activo: true, especialidades: "", genero1: ""
    };
  }

  // Función para recargar datos del servidor
  const refreshDataAfterOperation = async () => {
    try {
      const data = await getAdmin();
      if (data && typeof data === "object") {
        setUsuarios(data.usuarios || []);
        setEspecialistas(data.especialistas || []);
        setEspecialidades(data.especialidades || []);
        return true;
      }
      throw new Error("Respuesta inválida del servidor");
    } catch (error) {
      console.error("Error al refrescar datos:", error);
      return false;
    }
  };


  const loadData = async () => {
    try {
      setLoading(true);
      const [usuariosData, empleadosData, especialistasData] = await Promise.all([
        getUsuarios(),
        getAdmin(), // empleados
        getEspecialistas()

      ]);

      setUsuarios(usuariosData);
      setEspecialistas(especialistasData);


      // Actualizar especialidades desde los especialistas
      setDataLoaded(true);
    } catch (error) {
      console.error("Error cargando datos:", error);
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };


  // Validar consistencia de datos
  const validateDataConsistency = () => {
    const allUsers = [...usuarios, ...especialistas];
    const duplicateIds = allUsers
      .map(u => u.id)
      .filter((id, index, arr) => arr.indexOf(id) !== index);

    if (duplicateIds.length > 0) {
      console.warn("IDs duplicados encontrados:", duplicateIds);
      refreshDataAfterOperation();
    }
  };

  // Manejo de errores de red
  const handleNetworkError = async (operation, operationName = "operación") => {
    try {
      return await operation();
    } catch (error) {
      if (error.name === 'NetworkError' || error.message.includes('fetch') || error.message.includes('network')) {
        const result = await Swal.fire({
          title: "Error de conexión",
          text: `No se pudo conectar con el servidor durante la ${operationName}. ¿Deseas reintentar?`,
          icon: "error",
          showCancelButton: true,
          confirmButtonText: "Reintentar",
          cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
          return await operation();
        }
        return null;
      }
      throw error;
    }
  };

  const validatePasswords = () => {
    if (!editingUser && formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return false;
    }
    return true;
  };

  // Construir datos a enviar 
  const buildDataToSend = () => {
    const commonFields = {
      nombre: formData.nombre,
      numero_identificacion: formData.numero_identificacion,
      fechaNac: formData.fecha_nacimiento,
      email: formData.email,
      fechaContratacion: formData.fecha_contratacion || new Date().toISOString().split("T")[0],
      estado: formData.estado,
      activo: formData.activo,
      cargo: formData.cargo,
      genero1: formData.genero1,
      ...(formData.password && { password: formData.password }),
    };

    const roleSpecific = {
      admin: { url: "admin", data: { ...commonFields, telefono: formData.telefono, cargo: formData.cargo } },
      usuario: { url: "clientes", data: { ...commonFields, telefono: formData.telefono } },
      especialista: { url: "especialistas", data: { ...commonFields, especialidades: formData.especialidades } },
      empleado: { url: "empleados", data: { ...commonFields, telefono: formData.telefono, cargo: formData.cargo } },
    };

    return roleSpecific[formData.rol] || { url: "", data: {} };
  };

  // CREAR usuario/especialista/empleado/admin
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    const { url, data } = buildDataToSend();
    try {
      setLoading(true);
      const response = await postAdmin(url, data);
      if (response && response.id) {
        updateStateByRole(response, formData.rol, "add");
        resetForm();
        Swal.fire("¡Éxito!", "Usuario creado correctamente", "success");
      } else {
        throw new Error("No se pudo crear el usuario");
      }
    } catch (error) {
      console.error("Error en creación:", error);
      Swal.fire("Error", error.message || "No se pudo crear el usuario", "error");
      await refreshDataAfterOperation();
    } finally {
      setLoading(false);
    }
  };

  // ACTUALIZAR usuario/especialista/empleado/admin 
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.password && !validatePasswords()) return;
    const { url, data } = buildDataToSend();
    try {
      setLoading(true);
      const response = await patchAdmin(url, editingUser.id, data);
      if (response && response.id) {
        updateStateByRole(response, formData.rol, "update");
        resetForm();
        Swal.fire("¡Éxito!", "Usuario actualizado correctamente", "success");
      } else {
        throw new Error("No se pudo actualizar el usuario");
      }
    } catch (error) {
      console.error("Error en actualización:", error);
      Swal.fire("Error", error.message || "No se pudo actualizar el usuario", "error");
      await refreshDataAfterOperation();
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
    if (!result.isConfirmed) return;
    const user = getUserById(userId);
    if (!user) {
      Swal.fire("Error", "Usuario no encontrado", "error");
      return;
    }
    const roleMap = {
      admin: "admin",
      usuario: "clientes",
      especialista: "especialistas",
      empleado: "empleados",
    };
    try {
      setLoading(true);
      await deleteAdmin(roleMap[user.rol], userId);
      updateStateByRole(user, user.rol, "delete");
      Swal.fire("¡Eliminado!", "Usuario eliminado correctamente", "success");
    } catch (error) {
      console.error("Error en eliminación:", error);
      Swal.fire("Error", error.message || "No se pudo eliminar el usuario", "error");
      await refreshDataAfterOperation();
    } finally {
      setLoading(false);
    }
  };

  // Actualizar arrays según rol y acción
  const updateStateByRole = (user, rol, action) => {
    const updater = (arr) => {
      if (action === "add") return [...arr, user];
      if (action === "update") return arr.map((u) => (u.id === user.id ? { ...u, ...user } : u));
      if (action === "delete") return arr.filter((u) => u.id !== user.id);
      return arr;
    };
    if (rol === "usuario" || rol === "admin" || rol === "empleado") {
      setUsuarios(updater);
    } else if (rol === "especialista") {
      setEspecialistas(updater);
    }
  };

  // Obtener usuario por ID
  const getUserById = (id) => {
    return usuarios.find((u) => u.id === id) || especialistas.find((e) => e.id === id);
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

  // Manejo de la adición de usuarios
  const handleAdd = () => {
    setEditingUser(null);
    setFormData(getInitialFormData());
    setShowModal(true);
  };

  // Reiniciar formulario
  const resetForm = () => {
    setFormData(getInitialFormData());
    setEditingUser(null);
    setShowModal(false);
  };

  // Manejo de cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Función para refrescar datos manualmente
  const handleRefreshData = async () => {
    setLoading(true);
    const success = await refreshDataAfterOperation();
    if (success) {
      Swal.fire("¡Actualizado!", "Los datos se han actualizado correctamente", "success");
    } else {
      Swal.fire("Error", "No se pudieron actualizar los datos", "error");
    }
    setLoading(false);
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">ADMIN</h2>
        <nav>
          <ul className="sidebar-list">
            {[
              { path: "/", label: "Home" },
              { path: "/Clientes", label: "Usuarios" },
              { path: "/especialistas", label: "Especialistas" },
              { path: "/empleados", label: "Empleados" },
              { path: "/pagos", label: "Pagos" },
              { path: "/serviciosdash", label: "Servicios" },
              { path: "/Dates", label: "Citas" },
              { path: "/Registro", label: "Registro" },
            ].map((link) => (
              <li key={link.path} className="sidebar-item">
                <Link to={link.path} className="sidebar-link">{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="main-header">
          <h1>Panel de Administración</h1>
          <p>Bienvenido</p>
          <button
            onClick={handleRefreshData}
            disabled={loading}
            className="refresh-button"
            title="Refrescar datos"
          >
            {loading ? "Actualizando..." : "🔄 Refrescar"}
          </button>
        </header>

        {/* Loading indicator */}
        {loading && (
          <div className="loading-box">
            <p>Cargando datos...</p>
          </div>
        )}

        {/* Dashboard cards */}
        <section className="dashboard-cards">
          {[
            { title: "Usuarios", count: usuarios.length },
            { title: "Especialistas", count: especialistas.length },
            { title: "Especialidades", count: especialidades.length },
          ].map((card) => (
            <div key={card.title} className="dashboard-card">
              <h4>{card.title}</h4>
              <h2>{card.count}</h2>
            </div>
          ))}
        </section>

        {/* Usuarios table */}
        <section className="section">
          <div className="section-header">
            <h3>Usuarios Registrados</h3>
            <button onClick={handleAdd} disabled={loading} className="add-button">
              {loading ? "Cargando..." : "Agregar Usuario"}
            </button>
          </div>

          {usuarios.length === 0 && !loading ? (
            <div className="empty-state">
              <p>No hay usuarios registrados o hubo un error al cargar los datos.</p>
              <button onClick={loadData} className="retry-button">Reintentar</button>
            </div>
          ) : (
            <div className="table-container">
              <table className="usuarios-table">
                <thead>
                  <tr>
                    {["Nombre", "Identificación", "Email", "Rol", "Género", "Estado", "Fecha Contratación", "Acciones"].map((th) => (
                      <th key={th}>{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nombre}</td>
                      <td>{user.numero_identificacion}</td>
                      <td>{user.email}</td>
                      <td>{user.rol}</td>
                      <td>{user.cargo}</td>
                      <td>{user.genero1}</td>
                      <td>{user.estado}</td>
                      <td>{user.fecha_contratacion ? new Date(user.fecha_contratacion).toLocaleDateString() : ""}</td>
                      <td className="acciones-cell">
                        <button
                          onClick={() => handleEdit(user)}
                          disabled={loading}
                          className="edit-button"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={loading}
                          className="delete-button"
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

        {/* Especialistas table - Opcional: agregar tabla similar para especialistas */}
        {especialistas.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h3>Especialistas Registrados</h3>
            </div>
            <div className="table-container">
              <table className="usuarios-table">
                <thead>
                  <tr>
                    {["Nombre", "Identificación", "Email", "Especialidades", "Estado", "Acciones"].map((th) => (
                      <th key={th}>{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {especialistas.map((especialista) => (
                    <tr key={especialista.id}>
                      <td>{especialista.nombre}</td>
                      <td>{especialista.numero_identificacion}</td>
                      <td>{especialista.email}</td>
                      <td>{especialista.especialidades}</td>
                      <td>{especialista.estado}</td>
                      <td className="acciones-cell">
                        <button
                          onClick={() => handleEdit(especialista)}
                          disabled={loading}
                          className="edit-button"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(especialista.id)}
                          disabled={loading}
                          className="delete-button"
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
          </section>
        )}

        {/* Modal para agregar/editar usuarios */}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingUser ? "Editar Usuario" : "Agregar Usuario"}</h3>
                <button onClick={() => setShowModal(false)} className="modal-close">×</button>
              </div>


              <form onSubmit={editingUser ? handleUpdate : handleCreate} className="user-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre: *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      placeholder="Ingrese el nombre completo"
                    />
                  </div>

                  <div className="form-group">
                    <label>Identificación: *</label>
                    <input
                      type="text"
                      name="numero_identificacion"
                      value={formData.numero_identificacion}
                      onChange={handleInputChange}
                      required
                      placeholder="Ingrese el número de identificación"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email: *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="ejemplo@correo.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Rol: *</label>
                    <select
                      name="rol"
                      value={formData.rol}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="usuario">Usuario</option>
                      <option value="admin">Admin</option>
                      <option value="especialista">Especialista</option>
                      <option value="empleado">Empleado</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Cargo: *</label>
                    <input
                      type="text"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      required
                      placeholder="Ingrese el cargo"
                    />
                  </div>

                  <div className="form-group">
                    <label>Género:</label>
                    <select
                      name="genero1"
                      value={formData.genero1}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccionar</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Fecha de Nacimiento:</label>
                    <input
                      type="date"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Campos condicionales según el rol */}
                  {(formData.rol === "usuario" || formData.rol === "empleado") && (
                    <div className="form-group">
                      <label>Teléfono: *</label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el teléfono"
                      />
                    </div>
                  )}

                  {formData.rol === "empleado" && (
                    <>
                      <div className="form-group">
                        <label>Cargo: *</label>
                        <input
                          type="text"
                          name="cargo"
                          value={formData.cargo}
                          onChange={handleInputChange}
                          required
                          placeholder="Ingrese el cargo"
                        />
                      </div>
                      <div className="form-group">
                        <label>Fecha de Contratación: *</label>
                        <input
                          type="date"
                          name="fecha_contratacion"
                          value={formData.fecha_contratacion}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </>
                  )}

                  {formData.rol === "especialista" && (
                    <div className="form-group">
                      <label>Especialidades: *</label>
                      <input
                        type="text"
                        name="especialidades"
                        value={formData.especialidades}
                        onChange={handleInputChange}
                        required
                        placeholder="Ej: Cardiología, Neurología"
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Contraseña: {!editingUser && '*'}</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={editingUser ? "Dejar vacío para mantener actual" : "Ingrese contraseña"}
                      required={!editingUser}
                    />
                  </div>

                  {!editingUser && (
                    <div className="form-group">
                      <label>Confirmar Contraseña: *</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        placeholder="Confirme la contraseña"
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Estado:</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="activo"
                        checked={formData.activo}
                        onChange={handleInputChange}
                      />
                      Usuario Activo
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={resetForm} disabled={loading}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : (editingUser ? "Actualizar" : "Crear")}
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