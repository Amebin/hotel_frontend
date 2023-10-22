import React, { useEffect, useState } from 'react';
import { Button, Table, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import appConfig from '../../config.js';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Error404 from '../../pages/Error404.jsx'
import { useJwt } from 'react-jwt';

const MySwal = withReactContent(Swal);

const RoomList = () => {
    const [roomList, setRoomList] = useState([]);
    const [roomModals, setRoomModals] = useState({})
    const authToken = localStorage.getItem('authToken')
    const parsedAuth = JSON.parse(authToken);
    const { decodedToken, isExpired } = useJwt(parsedAuth?.token || '');
    const userRole = decodedToken ? decodedToken.role : null;
    const [forceUpdate, setForceUpdate] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.GET_ROOM_ENDPOINT}`, {
                    headers: {
                        Authorization: `Bearer ${parsedAuth.token}`,
                    },
                });
                if (response.ok) {
                    const dataJson = await response.json();
                    setRoomList(dataJson.data);
                } else {
                    throw new Error('Error al obtener la lista de habitaciones');
                }
            } catch (err) {
                setToastMsg({ show: true, msg: err.message });
            }
        };

        fetchData();
    }, [forceUpdate]);

    const handleShow = (roomId) => {
        setRoomModals((prevRoomModals) => ({
            ...prevRoomModals,
            [roomId]: true,
        }));
    };

    const handleClose = (roomId) => {
        setRoomModals((prevRoomModals) => ({
            ...prevRoomModals,
            [roomId]: false,
        }));
    };

    const handleDateChange = (e, index, roomId) => {
        const { value } = e.target;

        setRoomDates((prevRoomDates) => {
            const updatedDates = [...prevRoomDates[roomId]];
            updatedDates[index] = value;
            return {
                ...prevRoomDates,
                [roomId]: updatedDates,
            };
        });
    };


    const handleSubmit = async (e, roomId) => {
        e.preventDefault();
        const form = e.currentTarget;

        const numberRoom = form.numberRoom.value;
        const price = form.price.value;
        const tipeRoom = form.tipeRoom.value;
        const images = form.images.value;

        const data = {
            numberRoom,
            price,
            tipeRoom,
            images,
        };
        

        try {
            const putRoom = await fetch(`${appConfig.API_BASE_URL}${appConfig.PUT_ROOM_ENDPOINT}/${roomId}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${parsedAuth.token}`
                },
                body: JSON.stringify(data),
            })

            const resultPutRoom = await putRoom.json();

            if (resultPutRoom.status === 'OK') {
                MySwal.fire({
                    title: 'Habitacion modificada',
                    icon: 'success',
                    text: `La habitacion ${roomId} ${data.numberRoom} ha sido modificada correctamente`,
                    confirmButtonText: 'Ok',
                }).then(() => {
                    setForceUpdate((prevForceUpdate) => !prevForceUpdate);
                }
                );
                handleClose(roomId);
            } else {
                MySwal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: resultPutRoom.data,
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

    const handleDeleteClick = async (roomId) => {
        try {
            const roomConfirmed = window.confirm('¿Estás seguro? Esta acción no se puede deshacer.');

            if (roomConfirmed) {
                const deleteRoom = await fetch(`${appConfig.API_BASE_URL}${appConfig.DEL_ROOM_ENDPOINT}/${roomId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${parsedAuth.token}`
                    },
                });
                const resultDeleteRoom = await deleteRoom.json();
                if (resultDeleteRoom.status === 'OK') {
                    MySwal.fire({
                        title: 'Habitacion eliminada',
                        icon: 'success',
                        text: `La habitacion ${roomId} ha sido eliminado correctamente`,
                        confirmButtonText: 'Ok',
                    }).then(() => {
                        setForceUpdate((prevForceUpdate) => !prevForceUpdate);
                    }
                    );

                } else {
                    MySwal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: resultDeleteRoom.data,
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
            {!authToken && <Error404 />}
            {authToken && userRole !== 'admin' && <Error404 />}
            {authToken && isExpired && <Error404 />}
            {authToken && userRole === 'admin' && !isExpired && (
                <Row>
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Habitacion</th>
                                    <th>Precio</th>
                                    <th>Capacidad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roomList.map((room) => (
                                    <React.Fragment key={room._id}>
                                        <tr>
                                            <td>{room.numberRoom}</td>
                                            <td>{room.price}</td>
                                            <td>{room.tipeRoom}</td>
                                            <td>
                                                <Button variant="primary" onClick={() => handleShow(room._id)}>
                                                    Gestionar
                                                </Button>
                                            </td>
                                        </tr>
                                        <Modal show={roomModals[room._id]} onHide={() => handleClose(room._id)} backdrop="static" keyboard={false}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Editar Habitacion</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Form onSubmit={(e) => handleSubmit(e, room._id)}>
                                                    <Form.Control type="hidden" name="id" value={room._id} />
                                                    <Form.Group controlId="numberRoom">
                                                        <Form.Label>Habitacion</Form.Label>
                                                        <Form.Control type="text" name="numberRoom" defaultValue={room.numberRoom} />
                                                    </Form.Group>
                                                    <Form.Group controlId="tipeRoom">
                                                        <Form.Label>Tipo</Form.Label>
                                                        <Form.Control type="text" name="tipeRoom" defaultValue={room.tipeRoom} />
                                                    </Form.Group>
                                                    <Form.Group controlId="price">
                                                        <Form.Label>Precio</Form.Label>
                                                        <Form.Control type="number" name="price" defaultValue={room.price} />
                                                    </Form.Group>
                                                    <Form.Group controlId="images">
                                                        <Form.Label>Imagenes</Form.Label>
                                                        <Form.Control as="textarea" rows={3} name="images" defaultValue={room.images.join(', ')} />
                                                        <small className="text-muted">Ingresa una URL por cada imagen que requieras. Si hay 2 o mas URL deben estar separadas una de la otra por 1 coma y 1 espacio.
                                                            <br></br> Ejemplo: https://www.example.com/image1.jpg, https://www.example.com/image2.jpg, https://www.example.com/image3.jpg
                                                            <br></br> No ingreses saltos de linea, solo coma y espacio.
                                                        </small>
                                                    </Form.Group>

                                                    <Form.Group controlId="dates">
                                                        <Form.Label>Fechas</Form.Label>
                                                        {room.avaliableDates.map((date, index) => (
                                                            <div key={index} className="d-flex mb-2">
                                                                <Form.Control
                                                                    type="date"
                                                                    value={date}
                                                                    onChange={(e) => handleDateChange(e, index, room)}
                                                                />
                                                                <Button
                                                                    variant="danger"
                                                                    className="ms-2"

                                                                >
                                                                    Eliminar
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </Form.Group>

                                                    <Button variant="primary" type="submit">
                                                        Modificar
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleDeleteClick(room._id)}>
                                                        Eliminar
                                                    </Button>
                                                    <Button variant="secondary" onClick={() => handleClose(room._id)}>
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
            )

            }
        </Container>
    );
}

export default RoomList
