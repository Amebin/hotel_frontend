import React from 'react'
import Table from 'react-bootstrap/Table'

function UserList({ users, onEdit, onDelete }) {
  const handleEditClick = (id) => {
    // Llamar a la función de edición pasando el ID del usuario
    onEdit(id)
  }

  const handleDeleteClick = (id) => {
    // Llamar a la función de borrado pasando el ID del usuario
    onDelete(id)
  }

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Contraseña</th>
            <th>Rol</th>
            <th>Reservado</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, firstName, lastName, email, password, role, reserved, active }) => (
            <tr key={id}>
              <td>{firstName}</td>
              <td>{lastName}</td>
              <td>{email}</td>
              <td>{password}</td>
              <td>{role}</td>
              <td>{reserved}</td>
              <td>{active ? 'Sí' : 'No'}</td>
              <td>
                <button onClick={() => handleEditClick(id)}>Editar</button>
                <button onClick={() => handleDeleteClick(id)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default UserList
