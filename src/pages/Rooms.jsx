import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Modal, Form, Carousel, Row, Col } from 'react-bootstrap';
import appConfig from '../config';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useJwt } from 'react-jwt';
import { useNavigate } from 'react-router-dom';
import './rooms.css'

const MySwal = withReactContent(Swal);

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [roomModal, setRoomModal] = useState({});
    const [reservationDate, setReservationDate] = useState('');
    
    const authToken = localStorage.getItem('authToken');
    const parsedToken = JSON.parse(authToken);
    const { decodedToken } = useJwt(parsedToken?.token || '');
    const userID = decodedToken ? decodedToken.uid : null;
    const navigate = useNavigate()
    const [forceUpdate, setForceUpdate] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);
        const fetchRooms = async () => {
            try {
                const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.GET_ROOM_ENDPOINT}`);
                const dataJson = await response.json();

                if (response.ok) {
                    setRooms(dataJson.data);
                }
                setLoading(false);
            }
            catch (error) {
                alert('Hubo un problema, intenta de nuevo mas tarde');
            }
        }
        fetchRooms();

    }, [forceUpdate]);

    const handleShow = (roomId) => {
        setRoomModal((prevRoomModal) => ({
            ...prevRoomModal,
            [roomId]: true,
        }));
    };

    const handleClose = (roomId) => {
        setRoomModal((prevRoomModal) => ({
            ...prevRoomModal,
            [roomId]: false,
        }));
    };

    const handleDateChange = (e) => {
        setReservationDate(e.target.value);
    };

    const handleSubmit = async (e, roomId) => {
        e.preventDefault();
        if (!reservationDate) {
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Selecciona una fecha',
            });
            return;
        }

        const date = reservationDate
        const id = userID
        const data = { date, id }

        try {
            const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.RESERVATION_ROOM}/${roomId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${parsedToken.token}`,
                },
                body: JSON.stringify(data),
            });

            const resultReserved = await response.json();
            const reservedData = resultReserved.data;
            if (response.ok) {
                handleClose(roomId);
                MySwal.fire({
                    icon: 'success',
                    title: 'Reserva realizada',
                    text: `${reservedData.message} para el ${reservedData.date}`,
                }).then(() => {
                    setForceUpdate((prevForceUpdate) => !prevForceUpdate);
                }
                );
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Su sesion a expirado. Por favor incia sesion nuevamente`,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                })
            }
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Atencion',
                text: 'Debes iniciar sesion para realizar una reserva',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Ok',
            }).then((result) => {
                handleClose(roomId);
                if (result.isConfirmed) {
                    handleClose(roomId)
                }
            }).finally(() => {
                navigate('/login')
            });


        }
    };

    return (
        <Container id='roomCards'>
            <Row>
                {loading && (
                    <div className="spinner">
                        Cargando habitaciones...
                    </div>
                )}
                {rooms.map((room) => (
                    <Col key={room._id} sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 0 }} lg={4} xxl={3}>
                        <Card >
                            <Card.Img variant="top" src={room.images} className='roomsImg'/>
                            <Card.Body>
                                <Card.Title>{room.title}</Card.Title>
                                <div id='roomDescription'><Card.Text>{room.description}</Card.Text>...</div>
                                <Button className='buttonConfirmation' onClick={() => handleShow(room._id)}>Ver detalles</Button>
                            </Card.Body>

                            <Modal show={roomModal[room._id]} onHide={() => handleClose(room._id)} backdrop="static" keyboard={false}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Confirmar Reservacion</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {room.images.map((image, index) => (
                                        <Carousel key={index}>
                                            <Carousel.Item>
                                                <img
                                                    
                                                    src={image}
                                                    alt={room.title + index}
                                                />
                                            </Carousel.Item>
                                        </Carousel>
                                    ))}

                                    <h3>Habitacion {room.title}</h3>
                                    <p>{room.description}</p>
                                    <p>Capacidad: {room.capacity} personas</p>
                                    <p>Tipo: {room.tipeRoom}</p>
                                    <p>Camas: {room.size}</p>
                                    <p>Precio: ${room.price} por noche</p>


                                    <Form onSubmit={(e) => handleSubmit(e, room._id)}>
                                        <Form.Control type="hidden" name="id" value={room._id} />
                                        <Form.Select aria-label="Default select" id='reservationDate' onChange={handleDateChange}>
                                            <option>Selecciona la fecha de la reserva</option>
                                            {room.avaliableDates.map((date, index) => (
                                                <option key={index} value={date}>
                                                    {date}
                                                </option>
                                            ))}
                                        </Form.Select>

                                        <Row id='modalButtons'>

                                            <Button className='buttonConfirmation' type="submit">
                                                Reservar
                                            </Button>

                                            <Button variant="secondary" onClick={() => handleClose(room._id)}>
                                                Cerrar
                                            </Button>

                                        </Row>
                                    </Form>
                                </Modal.Body>
                            </Modal>

                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default Rooms;

