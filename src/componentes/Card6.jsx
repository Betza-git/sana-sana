import React from 'react'
import '../styles/Card6.css'

function Card6() {
  return (
    <div className='card6'>
        <div>
        <p>Tratamiento para el estrés Laboral</p>
        <p>Contactenos <a href="mailto:contacto@ejemplo.com">aquí</a></p>
        </div> 
        <div>
          <p>Lugares</p>
            <p>Consultorios</p>
            
            <p>Foros</p>
            <p>Personas</p>
            <p>Consultas</p>

        </div>
        
        <div><p>Llamenos aquí: <a href="tel:+123456789">+123456789</a></p>
        <p>Whatsapp: <a href="https://wa.me/123456789">Enviar mensaje</a></p>
        <p>Sobre Nosotros</p>
        <p>Visítenos en nuestras redes sociales:</p>
       
        </div>
        <div><p>Últimas Noticias</p>
            <p>Eventos</p>
            <p>Promociones</p>
        </div>
        <div>
            <p>Redes Sociales</p><br />
            <p>Facebook</p>
            <p>Instagram</p>
            <p>Twitter</p>
            <p>LinkedIn</p>  
        </div>
        <div className='derechos'>
            <p>© 2025 Todos los derechos reservados</p>
        </div>
        <div className='iconosredes'>
            <i className="fa-brands fa-facebook-f"></i>
            <i className="fa-brands fa-linkedin"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-youtube"></i>
        </div>
       
       
    </div>
  )
}

export default Card6