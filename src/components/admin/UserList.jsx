import React, { useEffect, useState } from 'react';
import { Button, Table, Container, Row, Col, Modal, Form } from 'react-bootstrap'; 
import appConfig from '../../config.js';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Error404 from '../../pages/Error404.jsx'
import { useJwt } from 'react-jwt';
const MySwal = withReactContent(Swal);

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [userModals, setUserModals] = useState({})
  const authToken = localStorage.getItem('authToken');
  const parsedAuth = JSON.parse(authToken);
  const userToken = parsedAuth && parsedAuth.token ? parsedAuth.token : null;
  const { decodedToken, isExpired } = useJwt(userToken || '');
  const userRole = decodedToken ? decodedToken.role : null;
  const [forceUpdate, setForceUpdate] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.GET_USERS_ENDPOINT}`, {
          headers: {
              Authorization: `Bearer ${parsedAuth.token}`,
          },
      });
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
  }, [forceUpdate]);

  const handleShow = (userId) => {
    setUserModals((prevUserModals) => ({
      ...prevUserModals,
      [userId]: true, 
    }));
  };

  const handleClose = (userId) => {
    setUserModals((prevUserModals) => ({
      ...prevUserModals,
      [userId]: false, 
    }));
  };

  const handleSubmit = async (e, userId) => {
    e.preventDefault();
    const form = e.currentTarget;
    
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
   
    try {
      const putUser = await fetch(`${appConfig.API_BASE_URL}${appConfig.PUT_USER_ENDPOINT}/${userId}`, {
        method: 'PUT', 
        headers: {
          'Content-type': 'application/json', 
          'Authorization': `Bearer ${parsedAuth.token}`
        },
        body: JSON.stringify(data), 
      })
      
      const resultPutUser = await putUser.json();

      if (resultPutUser.status === 'OK') {
        MySwal.fire({
          title: 'Usuario modificado',
          icon: 'success',
          text: `El usuario ${userId} ${data.email} ha sido modificado correctamente`, 
        }).then(() => {
          setForceUpdate((prevForceUpdate) => !prevForceUpdate);
      }
      );        
        handleClose(userId);
      } else {
        MySwal.fire({
          title: 'Error',
          icon: 'error',
          text: resultPutUser.data,
        });
      } 
    } catch (err) {
      MySwal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Algo salio muy mal, intentalo nuevamente mas tarde'
      });
    }
  };
  
  const handleDeleteClick = async (userId) => {
    try {
      const userConfirmed = window.confirm('¿Estás seguro? Esta acción no se puede deshacer.');
  
      if (userConfirmed) {
        const deleteUser = await fetch(`${appConfig.API_BASE_URL}${appConfig.DEL_USER_ENDPOINT}/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${parsedAuth.token}`
          },
        });
        const resultDeleteUser = await deleteUser.json();
        if (resultDeleteUser.status === 'OK') {
          MySwal.fire({
            title: 'Usuario eliminado',
            icon: 'success',
            text: `El usuario ${userId} ha sido eliminado correctamente`,
            confirmButtonText: 'Ok',
          }).then(() => {
            setForceUpdate((prevForceUpdate) => !prevForceUpdate);
        }
        );
          
        } else {
          MySwal.fire({
            title: 'Error',
            icon: 'error',
            text: resultDeleteUser.data,
          });
        }
      }
    } catch (err) {
      MySwal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Algo salió muy mal, inténtalo nuevamente más tarde'
      });
    }
  };
  

  return (
    <Container>
      { !authToken && <Error404 /> }
      { authToken && userRole !== 'admin' && <Error404 /> }
      {authToken && isExpired && <Error404 />}
      { authToken && userRole === 'admin' && (
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
                    Gestionar
                  </Button>
                </td>
              </tr>
              <Modal show={userModals[user._id]} onHide={() => handleClose(user._id)} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={(e) => handleSubmit(e, user._id)}>
                <Form.Control type="hidden" name="id" value={user._id} />
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
                  <Button variant="danger" onClick={() => handleDeleteClick(user._id) }>
                    Eliminar
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
      ) }
      
    </Container>
  );
}

export default UserList
