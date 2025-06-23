import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdmin, postAdmin, patchAdmin, deleteAdmin } from "../services/Admin";
import Swal from 'sweetalert2';

const Admin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [especialistas, setEspecialistas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "usuario",
    activo: true
  });

  useEffect(() => {
    loadData();
  }, []);

  // Cargar datos (READ)
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdmin();
      if (data) {
        setUsuarios(data.usuarios || []);
        setEspecialistas(data.especialistas || []);
        setEspecialidades(data.especialidades || []);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setLoading(false);
    }
  };

  // Crear usuario (CREATE)
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await postAdmin(formData);
      
      if (response) {
        setUsuarios([...usuarios, response]);
        resetForm();
        Swal.fire({
          title: '¡Éxito!',
          text: 'Usuario creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error) {
      console.error("Error creando usuario:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo crear el usuario',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setLoading(false);
    }
  };

  // Actualizar usuario (UPDATE)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedUser = { ...editingUser, ...formData };
      const response = await patchAdmin(editingUser.id, updatedUser);
      
      if (response) {
        setUsuarios(usuarios.map(user => 
          user.id === editingUser.id ? response : user
        ));
        resetForm();
        Swal.fire({
          title: '¡Éxito!',
          text: 'Usuario actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el usuario',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario (DELETE)
  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await deleteAdmin(userId);
        
        if (response !== false) {
          setUsuarios(usuarios.filter(user => user.id !== userId));
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El usuario ha sido eliminado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el usuario',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Abrir modal para editar
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      activo: user.activo
    });
    setShowModal(true);
  };

  // Abrir modal para crear
  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      nombre: "",
      email: "",
      rol: "usuario",
      activo: true
    });
    setShowModal(true);
  };

  // Resetear formulario y cerrar modal
  const resetForm = () => {
    setFormData({
      nombre: "",
      email: "",
      rol: "usuario",
      activo: true
    });
    setEditingUser(null);
    setShowModal(false);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

        {/* Cards de estadísticas */}
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

        {/* Tabla de usuarios con CRUD */}
        <section style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
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
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "Cargando..." : "Agregar Usuario"}
            </button>
          </div>
          
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>Nombre</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>Email</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>Rol</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>Estado</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #e9ecef" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #e9ecef" }}>
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
                        opacity: loading ? 0.6 : 1
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
                        opacity: loading ? 0.6 : 1
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Modal para crear/editar usuario */}
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
              zIndex: 1000
            }}
            onClick={resetForm}
          >
            <div 
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 24,
                width: "90%",
                maxWidth: 500,
                maxHeight: "90vh",
                overflow: "auto"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ margin: 0 }}>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h3>
                <button 
                  onClick={resetForm}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={editingUser ? handleUpdate : handleCreate}>
                <div style={{ marginBottom: 16 }}>
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
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
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
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
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
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Admin</option>
                    <option value="especialista">Especialista</option>
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "flex", alignItems: "center", fontWeight: "500" }}>
                    <input
                      type="checkbox"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleInputChange}
                      disabled={loading}
                      style={{ marginRight: 8 }}
                    />
                    Usuario activo
                  </label>
                </div>

                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                  <button 
                    type="button" 
                    onClick={resetForm}
                    disabled={loading}
                    style={{
                      background: "#6c757d",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "10px 20px",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    style={{
                      background: "#6c63ff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "10px 20px",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? "Procesando..." : (editingUser ? 'Actualizar' : 'Crear')}
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