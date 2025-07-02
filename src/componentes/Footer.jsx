import React from "react";
import "../styles/Footer.css"; 

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            © {currentYear} Todos los derechos reservados
          </p>
          <div className="footer-links">
            <a href="#" className="footer-link">Política de Privacidad</a>
            <span className="separator">|</span>
            <a href="#" className="footer-link">Términos de Uso</a>
            <span className="separator">|</span>
            <a href="#" className="footer-link">Sobre Nosotros</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
