import React from 'react'
import Crud from '../componentes/Crud'
import NavHome from '../componentes/NavHome'
import Card1 from '../componentes/Card1'
import Card2 from '../componentes/Card2'
import Card3 from '../componentes/Card3'
import Card4 from '../componentes/Card4'
import '../styles/Home.css';
import Heroinfoheader from '../componentes/Heroinfoheader'
import { Link, useNavigate } from 'react-router-dom'
import Card5 from '../componentes/Card5'
import Card6 from '../componentes/Card6'
import desgestres from '../imagenes/desgestres.jpg'
import bajap from '../imagenes/bajap.jpg'
import agota from '../imagenes/agota.jpg'
import descontrol from '../imagenes/descontrol.png'



function Home() {
  const navigate = useNavigate() // Hook de navegación para redirigir a otras páginas
  return (
    <>
      <header>
        <nav>
          <NavHome />
        </nav>
        <section>
          <Heroinfoheader />
          <div className='cont-cards'>
            <Card1 titulo={"Especialistas"} icono={"fa-solid fa-user-md"} cantidad={100} lugar={"Consultorios"} cantidad2={10} sitio={"sitios"} />

            <Card1 titulo={"Salud"} icono={"fa-solid fa-heart-pulse fa-beat"} cantidad={100} lugar={"Consultorios"} cantidad2={10} sitio={"sitios"} />
            <Card1 titulo={"Foros"} icono={"fa-solid fa-comment-dots"} cantidad={100} lugar={"Personas"} cantidad2={10} sitio={"sitios"} />
          </div>
          <div><h1 className='TituloSintomas'>¿Estás presentando alguno de estos síntomas?</h1></div>

          <div className='cont-cards-2'>
            <Card2 img={desgestres} tituloPrincipal={"Cansancio Extremo"} />
            <Card2 img={bajap} tituloPrincipal={"Baja Productividad"} />
            <Card2 img={agota} tituloPrincipal={"Agotamiento y Depresión"} />
            <Card2 img={descontrol} tituloPrincipal={"Descontrol de las emociones"} />
          </div>


          <div className='cont-cards-3'>
            <Card3 icono={"fa-solid fa-id-card"} titulo={"Total de visitas"} cantidad={15.678} />
            <Card3 icono={"fa-regular fa-star"} titulo={"Estrellas"} cantidad={3.439} />
            <Card3 icono={"fa-solid fa-users"} titulo={"Nuestros Clientes"} cantidad={7.547} />
            <Card3 icono={"fa-sharp fa-regular fa-face-smile"} titulo={"Casos Exitosos"} cantidad={8.550} />
          </div>
          <h1>Comienza hoy a utilizar nuestra plataforma!!</h1>
          <h5>Le acompañaremos a lo largo de su tratamiento, juntos tendremos resultados increíbles!! </h5>




          <div className='cont-cards-4'>
            <div className='card4' ><Card4 titulo={"Usuario Existente"} button={<Link to={"/login"}>INGRESAR</Link>} /></div><hr className='hr4' />
            <Card4 icono={"fa-solid fa-circle-user"} titulo={"Usuario Nuevo"} button={<Link to={"/registro"}>CREAR</Link>} />
          </div>

          <div>
            <Card5 icono={"fa-regular fa-star fa-beat-fade"} />
          </div>
        </section>
        <footer>
          <Card6 />
        </footer>
      </header>
    </>
  )
}


export default Home