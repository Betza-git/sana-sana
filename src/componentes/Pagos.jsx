import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deletepagos,
  getpagos,
  patchpagos,
  postpagos,
} from "../services/Pagos";
import { getEmpleados } from "../services/Empleados";
import { getmetodopago } from "../services/MetodosDePago";
import '../styles/Pagos.css';
import { Link } from "react-router-dom";

// Componente para gestionar pagos
const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [metodos, setMetodos] = useState([]);
  const [editarPago, setEditarPago] = useState({
    id: null,
    empleado: '',
    metodopago: '',
    monto: '',
    descripcion: '',
    fecha_pago: '',
    confirmado: '',
  });

  const cargarDatos = async () => {
    const pagosData = await getpagos();
    const empleadosData = await getEmpleados();
    const metodosData = await getmetodopago();

    setPagos(pagosData);
    setEmpleados(empleadosData);
    setMetodos(metodosData);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Manejo de cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditarPago((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditar = (pago) => {
    console.log('Pago completo:', pago)

    setEditarPago({
      id: pago.id,
      empleado: pago.empleado ?? '',
      metodopago: pago.metodopago ?? '',
      monto: pago.monto ?? '',
      descripcion: pago.descripcion ?? '',
      fecha_pago: pago.fecha_pago ? pago.fecha_pago.slice(0, 10) : '', // YYYY-MM-DD para input date RECORDAR
      confirmado: pago.confirmado ?? '',
    });
  };

  const handleGuardar = async () => {
    // Validación básica
    if (
      !editarPago.empleado ||
      !editarPago.metodopago ||
      !editarPago.monto ||
      !editarPago.fecha_pago
    ) {
      Swal.fire("Campos vacíos", "Por favor completa todos los campos obligatorios", "warning");
      return;
    }
    // Validación de monto
    const datos = {
      empleado: editarPago.empleado,
      metodopago: editarPago.metodopago,
      monto: Number(editarPago.monto),
      descripcion: editarPago.descripcion,
      fecha_pago: editarPago.fecha_pago,
      confirmado: editarPago.confirmado,
    };

    console.log('Datos a enviar:', datos);   // Para depuración
    console.log('ID a editar:', editarPago.id);

    try {
      if (editarPago.id) {
        await patchpagos(editarPago.id, datos);
        Swal.fire("Actualizado", "El pago fue actualizado correctamente", "success");
      } else {
        await postpagos(datos);
        Swal.fire("Creado", "El pago fue registrado exitosamente", "success");
      }

      setEditarPago({
        id: null,
        empleado: '',
        metodopago: '',
        monto: '',
        descripcion: '',
        fecha_pago: '',
        confirmado: '',
      });
      cargarDatos();
    } catch (error) {
      console.error('Error completo:', error); // Para depuración para asegurar patch
      Swal.fire("Error", "Ocurrió un error al guardar el pago", "error");
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar este pago?",
      text: "No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      try {
        await deletepagos(id);
        cargarDatos();
        Swal.fire("Eliminado", "El pago fue eliminado correctamente", "success");
      } catch (error) {
        Swal.fire("Error", "Ocurrió un error al eliminar", "error");
      }
    }
  };

  return (
    <div className="payments-container">
      <h2 className="payments-title">Gestión de Pagos</h2>

      <div className="payments-form-card">
        <h5 className="payments-form-title">
          {editarPago.id ? "Editar Pago" : "Nuevo Pago"}
        </h5>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Empleado:</label>
            <select
              className="form-select"
              name="empleado"
              value={editarPago.empleado}
              onChange={handleChange}
            >
              <option value="">Seleccione un empleado</option>
              {empleados.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Método de Pago:</label>
            <select
              className="form-select"
              name="metodopago"
              value={editarPago.metodopago}
              onChange={handleChange}
            >
              <option value="">Seleccione un método</option>
              {metodos.map((met) => (
                <option key={met.id} value={met.id}>
                  {met.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Monto:</label>
            <input
              type="number"
              className="form-input"
              name="monto"
              value={editarPago.monto}
              onChange={handleChange}
              placeholder="Ingrese el monto"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Descripción:</label>
            <input
              type="text"
              className="form-input"
              name="descripcion"
              value={editarPago.descripcion}
              onChange={handleChange}
              placeholder="Descripción del pago"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fecha de Pago:</label>
            <input
              type="date"
              className="form-input"
              name="fecha_pago"
              value={editarPago.fecha_pago}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmado:</label>
            <select
              className="form-select"
              name="confirmado"
              value={editarPago.confirmado}
              onChange={handleChange}
            >
              <option value="">Seleccione una opción</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <button className="save-button" onClick={handleGuardar}>
          {editarPago.id ? "Actualizar" : "Guardar"}
        </button>
      </div>

      <div className="table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Empleado</th>
              <th>Método</th>
              <th>Monto</th>
              <th>Descripción</th>
              <th>Fecha Pago</th>
              <th>Confirmado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id}>
                <td>{pago.id}</td>
                <td>{pago.empleado}</td>
                <td>{pago.metodopago}</td>
                <td>₡{Number(pago.monto).toLocaleString()}</td>
                <td>{pago.descripcion}</td>
                <td>{pago.fecha_pago ? pago.fecha_pago.slice(0, 10) : ''}</td>
                <td>
                  <span className={pago.confirmado === 'Sí' ? 'confirmado-si' : 'confirmado-no'}>
                    {pago.confirmado}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditar(pago)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleEliminar(pago.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br /><br />
        <div className="volver-panel" align="center">
            <Link to="/Admin" className="btn btn-primary">
            Volver al Panel de Administración</Link>
            </div>
      </div>
    </div>
  );
};

export default Pagos;