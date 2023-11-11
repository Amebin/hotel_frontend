import './adminList.css'
import React, { useEffect, useState } from 'react'
import { Button, Table, Container, Row, Col, Modal, Form, Toast } from 'react-bootstrap'
import appConfig from '../../config.js'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Error404 from '../../pages/Error404.jsx'
import { useJwt } from 'react-jwt'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'


const MySwal = withReactContent(Swal)

const RoomList = () => {
    const [roomList, setRoomList] = useState([])
    const [roomModals, setRoomModals] = useState({})
    const [toastMsg, setToastMsg] = useState({ show: false, msg: '' })
    const authToken = localStorage.getItem('authToken')
    const parsedAuth = JSON.parse(authToken)
    const { decodedToken, isExpired } = useJwt(parsedAuth?.token || '')
    const userRole = decodedToken ? decodedToken.role : null
    const [forceUpdate, setForceUpdate] = useState(false)
    const [loading, setLoading] = useState(false);

    const [modifiedDates, setModifiedDates] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            try {
                const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.GET_ROOM_ENDPOINT}`, {
                    headers: {
                        Authorization: `Bearer ${parsedAuth.token}`,
                    },
                })
                if (response.ok) {
                    const dataJson = await response.json()
                    setRoomList(dataJson.data)
                    setLoading(false);
                } else {
                    throw new Error('Error al obtener la lista de habitaciones')
                }
            } catch (err) {
                alert('Algo salio muy mal, intenta de nuevo mas tarde')
            }

        }

        fetchData()
    }, [forceUpdate])

    const handleShow = (roomId, avaliableDates) => {
        setRoomModals((prevRoomModals) => ({
            ...prevRoomModals,
            [roomId]: true,
        }))
        setModifiedDates(avaliableDates)

    }

    const handleClose = (roomId) => {
        setRoomModals((prevRoomModals) => ({
            ...prevRoomModals,
            [roomId]: false,
        }))
        setModifiedDates()
    }

    const handleDateChange = (e, index) => {
        const newDates = [...modifiedDates];
        newDates[index] = e.target.value;
        setModifiedDates(newDates);
    };

    const deleteDates = (index) => {
        const newDates = [...modifiedDates];
        newDates.splice(index, 1);
        setModifiedDates(newDates);
        setToastMsg({ show: true, msg: 'La fecha fue eliminada, dale clic a modificar para confirmar los cambios', success: false })

    };

    const handleSubmit = async (e, roomId) => {
        e.preventDefault()
        const form = e.currentTarget

        const numberRoom = form.numberRoom.value
        const price = form.price.value
        const tipeRoom = form.tipeRoom.value
        const images = form.images.value
        const avaliableDates = modifiedDates

        const data = {
            numberRoom,
            price,
            tipeRoom,
            images,
            avaliableDates,
        }
       
        try {
            const putRoom = await fetch(`${appConfig.API_BASE_URL}${appConfig.PUT_ROOM_ENDPOINT}/${roomId}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${parsedAuth.token}`
                },
                body: JSON.stringify(data),
            })

            const resultPutRoom = await putRoom.json()

            if (resultPutRoom.status === 'OK') {
                MySwal.fire({
                    title: 'Habitacion modificada',
                    icon: 'success',
                    text: `La habitacion ${roomId} ${data.numberRoom} ha sido modificada correctamente`,
                    confirmButtonText: 'Ok',
                }).then(() => {
                    setForceUpdate((prevForceUpdate) => !prevForceUpdate)
                }
                )
                handleClose(roomId)
            } else {
                MySwal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: resultPutRoom.data,
                })
            }
        } catch (err) {
            MySwal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Algo salio muy mal, intentalo nuevamente mas tarde'
            })
        }
    }

    const handleDeleteClick = async (roomId) => {
        try {
            const roomConfirmed = window.confirm('¿Estás seguro? Esta acción no se puede deshacer.')

            if (roomConfirmed) {
                const deleteRoom = await fetch(`${appConfig.API_BASE_URL}${appConfig.DEL_ROOM_ENDPOINT}/${roomId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${parsedAuth.token}`
                    },
                })
                const resultDeleteRoom = await deleteRoom.json()
                if (resultDeleteRoom.status === 'OK') {
                    MySwal.fire({
                        title: 'Habitacion eliminada',
                        icon: 'success',
                        text: `La habitacion ${roomId} ha sido eliminado correctamente`,
                        confirmButtonText: 'Ok',
                    }).then(() => {
                        setForceUpdate((prevForceUpdate) => !prevForceUpdate)
                    }
                    )

                } else {
                    MySwal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: resultDeleteRoom.data,
                    })
                }
            }
        } catch (err) {
            MySwal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Algo salió muy mal, inténtalo nuevamente más tarde'
            })
        }
    }

    return (
        <Container>
            {!authToken && <Error404 />}
            {authToken && userRole !== 'admin' && <Error404 />}
            {authToken && userRole === 'admin' && isExpired && (
                <div className="text-center">
                    <h1>Debe iniciar sesion nuevamente</h1>
                    <Button onClick={() => navigate('/login')}>Iniciar sesión</Button>
                </div>
            )}
            {loading && (
                <div className="spinner">
                    Cargando habitaciones...
                </div>
            )}
            {authToken && userRole === 'admin' && !isExpired && (
                <Row>

                    <Col id='adminContainer'>
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
                                                <Button onClick={() => handleShow(room._id, room.avaliableDates)}>
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
                                                        <small className="text-muted">Ingresa la URL de la imagen.
                                                            <br></br> Ejemplo: https://www.example.com/image1.jpg.
                                                            <br></br> No ingreses saltos de linea,ni comas o espacios.
                                                        </small>
                                                    </Form.Group>

                                                    <Form.Group controlId="dates">
                                                        <Form.Label>Fechas</Form.Label>
                                                        {room.avaliableDates.map((date, index) => (
                                                            <div id={index} key={index} className="d-flex mb-2">
                                                                <Form.Control
                                                                    type="text"
                                                                    defaultValue={date}
                                                                    onChange={(e) => handleDateChange(e, index)}

                                                                />

                                                                <Button
                                                                    variant="danger"
                                                                    className="ms-2"
                                                                    onClick={() => deleteDates(index)}
                                                                >
                                                                    Eliminar
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </Form.Group>

                                                    <Button type="submit">
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
                                            <Toast
                                                show={toastMsg.show}
                                                delay={5500}
                                                onClose={() => setToastMsg({ show: false, msg: '' })}
                                                autohide
                                                style={{
                                                    position: 'fixed',
                                                    bottom: '1em',
                                                    right: '0',
                                                    zIndex: '1000',
                                                    backgroundColor: '#dc3545',
                                                    color: '#fff',
                                                }}
                                            >
                                                <Toast.Header>
                                                    <FontAwesomeIcon icon={faCheckCircle} size="2x" className='me-1' />
                                                    <strong className="me-auto">Fecha eliminada</strong>
                                                    <small>Ahora</small>
                                                </Toast.Header>


                                                <Toast.Body>{toastMsg.msg}</Toast.Body>
                                            </Toast>
                                        </Modal>
                                    </React.Fragment>))}
                            </tbody>
                        </Table>


                    </Col>
                </Row>
            )

            }
        </Container>
    )
}

export default RoomList
