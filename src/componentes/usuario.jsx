import '../styles/usuario.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function Usuario() {


  // Se hace el llamado real a la API para obtener los datos del usuario y sus citas 


  const id = '1';
  const [usuario, setUsuario] = useState(null);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  // Cargar datos del usuario y citas al montar el componente
  // Aquí podrías hacer una llamada a tu API para obtener los datos reales

  

  useEffect(async ()  => {
    const fetchUsuario = async () => {
      try {
        // 
        const data = {
          id: id,
          nombre: 'Pepe Viyuela',
          email: 'pepeviyuela@example.com',
          telefono: '123-456-7890',
          fechaNacimiento: '2000-05-15',
          genero: 'Masculino',
          direccion: 'San José, Desamparados',
          foto: 'https://randomuser.me/api/portraits/men/32.jpg'
        };
        setUsuario(data);
        
        // Simulamos carga de citas
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
      } catch (err) {
        setError('Error al cargar los datos del usuario');
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id]);

  const handleEditarPerfil = () => {
    // Crear el modal personalizado
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Editar Perfil</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-form">
          <div class="form-group">
            <label>Nombre:</label>
            <input type="text" id="nombre" value="${usuario.nombre}" required>
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" id="email" value="${usuario.email}" required>
          </div>
          <div class="form-group">
            <label>Teléfono:</label>
            <input type="text" id="telefono" value="${usuario.telefono}" required>
          </div>
          <div class="form-group">
            <label>Fecha de Nacimiento:</label>
            <input type="date" id="fechaNacimiento" value="${usuario.fechaNacimiento}" required>
          </div>
          <div class="form-group">
            <label>Género:</label>
            <select id="genero" required>
              <option value="Masculino" ${usuario.genero === 'Masculino' ? 'selected' : ''}>Masculino</option>
              <option value="Femenino" ${usuario.genero === 'Femenino' ? 'selected' : ''}>Femenino</option>
              <option value="Otro" ${usuario.genero === 'Otro' ? 'selected' : ''}>Otro</option>
            </select>
          </div>
          <div class="form-group">
            <label>Dirección:</label>
            <input type="text" id="direccion" value="${usuario.direccion}" required>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary modal-cancel">Cancelar</button>
            <button type="button" class="btn btn-primary modal-save">Guardar Cambios</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    // Event listeners
    const closeModal = () => document.body.removeChild(modalOverlay);
    
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.querySelector('.modal-cancel').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    modalOverlay.querySelector('.modal-save').addEventListener('click', () => {
      const updatedUsuario = {
        ...usuario,
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        genero: document.getElementById('genero').value,
        direccion: document.getElementById('direccion').value
      };

      setUsuario(updatedUsuario);
      closeModal();
      
      // Mostrar confirmación
      showSuccessMessage('¡Perfil Actualizado!', 'Tus cambios se han guardado correctamente.');
    });
  };
  
  const handleCambiarContrasena = () => {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Cambiar Contraseña</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-form">
          <div class="form-group">
            <label>Contraseña actual:</label>
            <input type="password" id="actual" required>
          </div>
          <div class="form-group">
            <label>Nueva contraseña:</label>
            <input type="password" id="nueva" required>
          </div>
          <div class="form-group">
            <label>Confirmar nueva contraseña:</label>
            <input type="password" id="confirmar" required>
          </div>
          <div class="error-message" id="error-message"></div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary modal-cancel">Cancelar</button>
            <button type="button" class="btn btn-primary modal-save-password">Cambiar Contraseña</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    const closeModal = () => document.body.removeChild(modalOverlay);
    const errorDiv = modalOverlay.querySelector('#error-message');
    
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.querySelector('.modal-cancel').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    modalOverlay.querySelector('.modal-save-password').addEventListener('click', () => {
      const actual = document.getElementById('actual').value;
      const nueva = document.getElementById('nueva').value;
      const confirmar = document.getElementById('confirmar').value;
      
      errorDiv.textContent = '';
      
      if (!actual || !nueva || !confirmar) {
        errorDiv.textContent = 'Todos los campos son requeridos';
        return;
      }
      
      if (nueva !== confirmar) {
        errorDiv.textContent = 'Las contraseñas no coinciden';
        return;
      }
      
      if (nueva.length < 6) {
        errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
        return;
      }

      // Aquí iría la lógica para enviar al backend
      console.log('Cambiar contraseña:', { actual, nueva });
      closeModal();
      showSuccessMessage('¡Contraseña Cambiada!', 'Tu contraseña se ha actualizado correctamente.');
    });
  };

  const showSuccessMessage = (title, message) => {
    const successOverlay = document.createElement('div');
    successOverlay.className = 'success-overlay';
    successOverlay.innerHTML = `
      <div class="success-content">
        <div class="success-icon">✓</div>
        <h3>${title}</h3>
        <p>${message}</p>
        <button class="btn btn-primary success-ok">Aceptar</button>
      </div>
    `;

    document.body.appendChild(successOverlay);

    successOverlay.querySelector('.success-ok').addEventListener('click', () => {
      document.body.removeChild(successOverlay);
    });
  };

  const formatFecha = (fechaString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-ES', options);
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className='contenedorUsuario'>
      <div className='sidebar'>
        <div className='sidebar-header'>
          <h3>Sana-Sana</h3>
        </div>
        <ul className='sidebar-nav'>
          <li onClick={() => navigate('/')}    ><i className='fas fa-home'></i> <span>Inicio</span></li>
          <li onClick={() => navigate('/Dates')}><i className='fas fa-calendar-alt'></i><span>Citas</span></li>
          <li className='active'><i className='fas fa-user'></i> <span>Perfil</span></li>
          <li><i className='fas fa-file-medical'></i> <span>Historial</span></li>
        </ul>
      </div>
      
      <div className='main-content'>
        <div className='top-bar'>
          <h1 className='titulo'>Perfil de Usuario</h1>
          <div className='user-menu'>
            <span>{usuario.nombre}</span>
            <img src={usuario.foto} alt="Usuario" />
          </div>
        </div>
        
        <div className='profile-container'>
          <div className='profile-card'>
            <div className='profile-header'>
              <img src={usuario.foto} alt="Foto de perfil" className='profile-pic' />
              <h2>{usuario.nombre}</h2>
            </div>
            
            <div className='informacion'>
              <div className='info-group'>
                <h3>Información Personal</h3>
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>Teléfono:</strong> {usuario.telefono}</p>
                <p><strong>Fecha de Nacimiento:</strong> {new Date(usuario.fechaNacimiento).toLocaleDateString('es-ES')}</p>
                <p><strong>Género:</strong> {usuario.genero}</p>
                <p><strong>Dirección:</strong> {usuario.direccion}</p>
              </div>
              
              <div className='info-actions'>
                <button className='btn btn-primary' onClick={handleEditarPerfil}>
                  Editar Perfil
                </button>
                <button className='btn btn-outline' onClick={handleCambiarContrasena}>
                  Cambiar Contraseña
                </button>
              </div>
            </div>
          </div>
          
          <div className='appointments-card'>
            <h3>Próximas Citas</h3>
            {citas.length > 0 ? (
              <ul className='citas-list'>
                {citas.map(cita => (
                  <li key={cita.id} className='cita-item'>
                    <div className='cita-info'>
                      <p className='cita-fecha'>{formatFecha(cita.fecha)}</p>
                      <p><strong>{cita.especialista}</strong> - {cita.especialidad}</p>
                      <p className={`cita-estado ${cita.estado.toLowerCase()}`}>{cita.estado}</p>
                    </div>
                    <div className='cita-acciones'>
                      <button onClick={() => navigate('/Dates')} className='btn btn-outline'>Detalles</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='no-citas'>No tienes citas programadas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usuario;