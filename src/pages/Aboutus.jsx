import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Aboutus.css'; 

function Aboutus() {
  return (
    <div className="aboutus">
      <h1>¡Bienvenidos a Sana- Sana!</h1>
      <div className="aboutus-content">
      <p>Sobre Nosotros</p>
        <p>
            En sana-sana nos dedicamos a ayudar a todas las personas como tú a manejar y superar el estrés
            laboral, recuperando el equilibrio entre tu vida personal y profesional. Sabemos que el estrés
            en el trabajo puede afectar su salud mental, productividad y felicidad. Es por eso que le ofrecemos
            herramientas, recursos y apoyo por parte de nuestro equipo, para que encuentres soluciones efectivas.
            Nuestro objetivo es ofrecer una experiencia excepcional y construir una comunidad sólida.
        </p>
        </div>
        <div className="aboutus-vision">
        <p>Visión</p>
        <p>
            Nuestra visión es ser un referente en el ámbito de la salud mental, promoviendo un enfoque
            integral que combine la atención profesional con el apoyo comunitario. Queremos empoderar a las
            personas para que tomen el control de su bienestar emocional y mental, creando un entorno donde
            se sientan comprendidas y apoyadas.
        </p>
        </div>
        <div className="aboutus-mission">
        <p>Misión</p>
        <p>
            Nuestra misión es proporcionar un espacio seguro y de apoyo para que las personas puedan
            explorar y abordar sus desafíos de salud mental. Nos comprometemos a brindar servicios
            accesibles y efectivos que promuevan el bienestar y la resiliencia.

        </p>
        </div> 
        <button><Link to="/">Home</Link></button>
    </div>
  );
}

export default Aboutus;

