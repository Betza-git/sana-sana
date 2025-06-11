import '../styles/citas.css';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function Citas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Datos de ejemplo
    const citasData = [
      {
        id: 1,
        fecha: '2023-06-15T10:00:00',
        especialista: 'Dra. María González',
        especialidad: 'Cardiología',
        modalidad: 'Virtual',
        estado: 'Confirmada'
      },
      {
        id: 2,
        fecha: '2023-06-20T14:30:00',
        especialista: 'Dr. Carlos Mendoza',
        especialidad: 'Nutrición',
        modalidad: 'Presencial',
        estado: 'Pendiente'
      }
    ];
    
    setCitas(citasData);
    setLoading(false);
  }, []);

  const handleEliminar = (id) => {
    Swal.fire({
      title: '¿Eliminar cita?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setCitas(citas.filter(cita => cita.id !== id));
        Swal.fire('Eliminada!', 'La cita ha sido eliminada.', 'success');
      }
    });
  };

  const handleEditar = (cita) => {
    Swal.fire({
      title: 'Editar cita',
      html: `
        <input id="fecha" type="datetime-local" value="${cita.fecha}" class="swal2-input">
        <input id="especialista" type="text" value="${cita.especialista}" class="swal2-input">
        <input id="especialidad" type="text" value="${cita.especialidad}" class="swal2-input">
        <select id="modalidad" class="swal2-input">
          <option value="Virtual" ${cita.modalidad === 'Virtual' ? 'selected' : ''}>Virtual</option>
          <option value="Presencial" ${cita.modalidad === 'Presencial' ? 'selected' : ''}>Presencial</option>
        </select>
        <select id="estado" class="swal2-input">
          <option value="Pendiente" ${cita.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
          <option value="Confirmada" ${cita.estado === 'Confirmada' ? 'selected' : ''}>Confirmada</option>
          <option value="Cancelada" ${cita.estado === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          fecha: document.getElementById('fecha').value,
          especialista: document.getElementById('especialista').value,
          especialidad: document.getElementById('especialidad').value,
          modalidad: document.getElementById('modalidad').value,
          estado: document.getElementById('estado').value
        }
      }
    }).then((result) => {
      if (result.value) {
        const updatedCitas = citas.map(item => 
          item.id === cita.id ? { ...item, ...result.value } : item
        );
        setCitas(updatedCitas);
        Swal.fire('Actualizado!', 'La cita ha sido modificada.', 'success');
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div>Cargando citas...</div>;

  return (
    <div className="citas-container">
      <h1>Mis Citas</h1>
      {citas.length > 0 ? (
        <ul className="citas-list">
          {citas.map(cita => (
            <li key={cita.id} className="cita-item">
              <p><strong>Fecha:</strong> {formatDate(cita.fecha)}</p>
              <p><strong>Especialista:</strong> {cita.especialista}</p>
              <p><strong>Especialidad:</strong> {cita.especialidad}</p>
              <p><strong>Modalidad:</strong> {cita.modalidad}</p>
              <p><strong>Estado:</strong> <span className={`estado-${cita.estado.toLowerCase()}`}>{cita.estado}</span></p>
              
              <div className="acciones">
                <button onClick={() => handleEditar(cita)} className="btn-editar">
                  Editar
                </button>
                <button onClick={() => handleEliminar(cita.id)} className="btn-eliminar">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes citas programadas</p>
      )}
    </div>
  );
}

export default Citas;