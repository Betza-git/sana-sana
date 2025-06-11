import '../styles/Admin.css'
import React, { useEffect, useState } from 'react'
import { getData } from '../services/llamados'

const Admin = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData()
      setData(result)
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1>Admin</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default Admin
