import React from 'react'
import '../styles/Card2.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Card2 = ({ tituloPrincipal, img, }) => {
  return (
    <>
   
      <div className='card-cont2'>
        <section className='card-section2'>
        <img src={img} alt="" width={250} height={200}/>
        </section>
          <h3>{tituloPrincipal}</h3>
      
      </div>

</>
)}



export default Card2