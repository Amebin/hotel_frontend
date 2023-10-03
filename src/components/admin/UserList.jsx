import React, { useEffect, useState } from 'react';
import { Button, Table, Container, Row, Col, Modal, Form } from 'react-bootstrap'; 
import appConfig from '../../config.js';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [toastMsg, setToastMsg] = useState({ show: false, msg: '' });
  const [show, setShow] = useState(false);
  const [userModals, setUserModals] = useState({})
  const authToken = localStorage.getItem('authToken')
  const parsedAuth = JSON.parse(authToken);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.GET_USERS_ENDPOINT}`);
        if (response.ok) {
          const dataJson = await response.json();
          setUserList(dataJson.data);
        } else {
          throw new Error('Error al obtener la lista de usuarios');
        }
      } catch (err) {
        setToastMsg({ show: true, msg: err.message });
      }
    };

    fetchData();
  }, []);

  const handleShow = (userId) => {
    setUserModals((prevUserModals) => ({
      ...prevUserModals,
      [userId]: true, // Abre el modal del usuario correspondiente
    }));
  };

  const handleClose = (userId) => {
    setUserModals((prevUserModals) => ({
      ...prevUserModals,
      [userId]: false, // Cierra el modal del usuario correspondiente
    }));
  };
 
 const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const userId = form.id.value;
    const firstName = form.firstName.value;
    const lastName = form.lastName.value;
    const email = form.email.value;
    const active = form.active.checked;
    const role = form.role.value;

    const data = {
      firstName,
      lastName,
      email,
      active,
      role,
    };
    console.log(parsedAuth.token)

     const putMethod = {
      method: 'PUT', 
      headers: {
        'Content-type': 'application/json', 
        'Authorization': `Bearer ${authToken.token}`
      },
      body: JSON.stringify(data), 
    };

    fetch(`${appConfig.API_BASE_URL}${appConfig.PUT_USER_ENDPOINT}/${userId}`, putMethod)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Error al modificar el usuario');
      })
      .then((dataJson) => {
        MySwal.fire({
          title: 'Usuario modificado',
          icon: 'success',
          text: `El usuario ${userId} ${dataJson.data} ha sido modificado correctamente`,
        });
        handleClose(userId);
      })
      .catch((err) => {
        MySwal.fire({
          title: 'Error',
          icon: 'error',
          text: err.message,
        });
      }); 

 }

  const handleDeleteClick = (id) => {
    // Llamar a la función de borrado pasando el ID del usuario

  };

  return (
    <Container>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>Rol</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
            {userList.map((user) => (
            <React.Fragment key={user._id}>
              <tr>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.active ? 'Sí' : 'No'}</td>
                <td>
                  <Button variant="primary" onClick={() => handleShow(user._id)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteClick(user._id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
              <Modal show={userModals[user._id]} onHide={() => handleClose(user._id)} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="firstName">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control type="text" name="firstName" defaultValue={user.firstName}  />
                    </Form.Group>
                    <Form.Group controlId="lastName">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control type="text" name="lastName" defaultValue={user.lastName}  />
                    </Form.Group>
                    <Form.Group controlId="email">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control type="email" name="email" defaultValue={user.email}  />
                    </Form.Group>
                    <Form.Group controlId="active">
                      <Form.Check type="checkbox" label="Activo" name="active" defaultChecked={user.active}  />
                    </Form.Group>
                    <Form.Group controlId="role">
                      <Form.Label>Rol</Form.Label>
                      <Form.Control as="select" name="role" defaultValue={user.role} >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                      </Form.Control>
                    </Form.Group>
                  <Button variant="primary" type="submit">
                    Modificar
                  </Button>
                  <Button variant="secondary" onClick={() => handleClose(user._id)}>
                    Cerrar
                  </Button>
                  </Form>
                </Modal.Body>
              </Modal>
            </React.Fragment>))}
            </tbody>
          </Table>

        </Col>
      </Row>
    </Container>
  );
}

export default UserList
