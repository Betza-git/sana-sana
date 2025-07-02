import React, { useState } from 'react';
import '../styles/Card6.css';

function Card6() {
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert('¡Gracias por suscribirte al newsletter!');
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          
          {/* Columna 1: Información de la empresa */}
          <div className="footer-section">
            <div className="company-info">
              <h3 className="footer-title">
                Tratamiento para el Estrés Laboral
              </h3>
              <p className="company-description">
                Especialistas en bienestar mental y manejo del estrés laboral. 
                Tu salud mental es nuestra prioridad.
              </p>
            </div>
            
            <div className="contact-section">
              <h4 className="section-title">Contáctanos</h4>
              <div className="contact-item">
                <span className="icon phone-icon">📞</span>
                <a href="tel:+123456789" className="contact-link">
                  +123 456 789
                </a>
              </div>
              <div className="contact-item">
                <span className="icon whatsapp-icon">💬</span>
                <a 
                  href="https://wa.me/123456789?text=Hola,%20me%20interesa%20información%20sobre%20tratamiento%20para%20estrés%20laboral" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  WhatsApp: Enviar mensaje
                </a>
              </div>
              <div className="contact-item">
                <span className="icon email-icon">✉️</span>
                <a href="mailto:info@estres-laboral.com" className="contact-link">
                  info@estres-laboral.com
                </a>
              </div>
            </div>
          </div>

          {/* Columna 2: Servicios */}
          <div className="footer-section">
            <div className="services-section">
              <h4 className="section-title">
                <span className="icon location-icon">📍</span>
                Nuestros Servicios
              </h4>
              <ul className="services-list">
                <li className="service-item">
                  <span className="bullet"></span>
                  Consultorios
                </li>
                <li className="service-item">
                  <span className="bullet"></span>
                  Foros de Apoyo
                </li>
                <li className="service-item">
                  <span className="bullet"></span>
                  Consultas Online
                </li>
                <li className="service-item">
                  <span className="bullet"></span>
                  Terapia Grupal
                </li>
              </ul>
            </div>

            <div className="community-section">
              <h4 className="section-title">
                <span className="icon users-icon">👥</span>
                Comunidad
              </h4>
              <ul className="community-list">
                <li className="community-item">Testimonios</li>
                <li className="community-item">Blog</li>
                <li className="community-item">Recursos</li>
              </ul>
            </div>
          </div>

          {/* Columna 3: Noticias y Horarios */}
          <div className="footer-section">
            <div className="news-section">
              <h4 className="section-title">
                <span className="icon calendar-icon">📅</span>
                Novedades
              </h4>
              <ul className="news-list">
                <li className="news-item">
                  <span className="icon clock-icon">🕐</span>
                  Últimas Noticias
                </li>
                <li className="news-item">
                  <span className="icon event-icon">📅</span>
                  Próximos Eventos
                </li>
                <li className="news-item">
                  <span className="icon gift-icon">🎁</span>
                  Promociones
                </li>
              </ul>
            </div>

            <div className="schedule-card">
              <h5 className="schedule-title">Horarios de Atención</h5>
              <div className="schedule-content">
                <p>Lun - Vie: 8:00 AM - 6:00 PM</p>
                <p>Sábados: 9:00 AM - 2:00 PM</p>
                <p className="closed">Domingos: Cerrado</p>
              </div>
            </div>
          </div>

          {/* Columna 4: Redes Sociales y Newsletter */}
          <div className="footer-section">
            <div className="social-section">
              <h4 className="section-title">Síguenos</h4>
              <div className="social-grid">
                <a href="#" className="social-link facebook">
                  <span className="social-icon">📘</span>
                  <span>Facebook</span>
                </a>
                <a href="#" className="social-link instagram">
                  <span className="social-icon">📷</span>
                  <span>Instagram</span>
                </a>
                <a href="#" className="social-link twitter">
                  <span className="social-icon">🐦</span>
                  <span>Twitter</span>
                </a>
                <a href="#" className="social-link linkedin">
                  <span className="social-icon">💼</span>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            <div className="newsletter-card">
              <h5 className="newsletter-title">Newsletter</h5>
              <p className="newsletter-description">
                Recibe consejos y noticias sobre bienestar mental
              </p>
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  placeholder="Tu email"
                  className="newsletter-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-button">
                  Suscribirse
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Card6;