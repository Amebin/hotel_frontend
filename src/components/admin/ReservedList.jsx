import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import appConfig from '../../config';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useJwt } from 'react-jwt';
import { useNavigate } from 'react-router-dom';
import Error404 from '../../pages/Error404';

import './adminReserved.css'

const MySwal = withReactContent(Swal);

const AllReservations = () => {
    const [reserved, setReserved] = useState([]);
    const authToken = localStorage.getItem('authToken');
    const parsedToken = JSON.parse(authToken);
    const { decodedToken, isExpired } = useJwt(parsedToken?.token || '');
    const userRole = decodedToken ? decodedToken.role : null;
    const navigate = useNavigate()
    const [roomDetails, setRoomDetails] = useState({});
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);

        const fetchReserved = async () => {
            try {
                const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.RESERVED_ADMIN}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${parsedToken.token}`
                    }
                });
                const reservationJson = await response.json();
                
                if (response.ok) {
                    const sortedReserved = reservationJson.data.sort((a, b) => {
                        const statusA = getReservationStatus(a.date);
                        const statusB = getReservationStatus(b.date);

                        if (statusA === 'Pendiente' && statusB === 'Completado') {
                            return -1;
                        } else if (statusA === 'Completado' && statusB === 'Pendiente') {
                            return 1;
                        } else {
                            return new Date(a.date) - new Date(b.date);
                        }
                    });

                    
                    setLoading(false);
                    setReserved(sortedReserved);
                    fetchAllRoomDetails()
                    fetchAllUsers()
                } if (response.status === 401) {
                    MySwal.fire({
                        title: 'Error!',
                        text: 'Debe volver a iniciar sesión para ver sus reservas',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    }).then(() => {
                        localStorage.removeItem('authToken');
                        navigate('/login');
                    })
                } else {
                    throw new Error(reservationJson.message);
                }

            }
            catch (error) {
                throw new Error('Algo no esta funcionando como deberia, intentalo mas tarde o luego de realizar una reservacion');               
            }
        }
        fetchReserved();

    }, []);

    const fetchAllRoomDetails = async () => {
        try {
            const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.GET_ROOM_ENDPOINT}`)
            const roomsJson = await response.json();
            if (response.ok) {
                const roomDetailsMap = {};
                roomsJson.data.forEach(room => {
                    roomDetailsMap[room._id] = room;
                });
                setRoomDetails(roomDetailsMap);
            } else {
                throw new Error(roomsJson.message);
            }
        } catch (error) {
            alert('Algo salio mal al traer los detalles de las habitaciones, intenta nuevamente mas tarde');
        }
    }

    const fetchAllUsers = async () => {
        try {
            const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.GET_USERS_ENDPOINT}`, {
                headers: {
                    Authorization: `Bearer ${parsedToken.token}`,
                },
            });
            const usersJson = await response.json();
            if (response.ok) {
                const usersMap = {};
                usersJson.data.forEach(user => {
                    usersMap[user._id] = user;
                });
                setUsers(usersMap);
            } else {
                throw new Error(usersJson.message);
            }
        } catch (error) {
            alert('Algo salio mal trayendo los datos de usuarios');
        }
    }

    const getRoomDetails = (roomId) => {
        return roomDetails[roomId] || {};
    }

    const getUserDetails = (userId) => {
        return users[userId] || {};
    }

    const getReservationStatus = (date) => {
        const reservationDate = new Date(date);
        const oneDay = 24 * 60 * 60 * 1000;
        const today = new Date();
        const yesterday = new Date(today.getTime() - oneDay);
        yesterday.setHours(0, 0, 0, 0);
        reservationDate.setHours(0, 0, 0, 0);

        if (reservationDate < yesterday) {
            return 'Completado';
        } else {
            return 'Pendiente';
        }
    };

    const onDelete = (reservationId) => {
        
        MySwal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.DELETE_RESERVATION}/${reservationId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${parsedToken.token}`
                        }
                    });
                    const dataDelete = await response.json();
                   
                    if (response.ok) {
                        MySwal.fire({
                            title: 'Eliminado!',
                            text: 'La reserva ha sido eliminada.',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        }).then(() => {
                            setReserved(reserved.filter((reservation) => reservation._id !== reservationId));
                        })
                    } else {
                        MySwal.fire({
                            title: 'Error!',
                            text: dataDelete.data,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        })
                       
                    }
                } catch (error) {
                    MySwal.fire({
                        title: 'Error!',
                        text: 'Algo salio muy mal, intentalo nuevamente mas tarde por favor',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    })
                }
            }
        })
    }


    return (
        <Container id='reservedAdmin'>
            <Row>
            {!parsedToken && (
                <div className="text-center">
                    <h1>Debe iniciar sesión para ver sus reservas</h1>
                    <Button variant="primary" onClick={() => navigate('/login')}>Iniciar sesión</Button>
                </div>
            )}
            {parsedToken && userRole === 'user' && (
                <Error404 />
            )}
            {loading && (
                    <div className="spinner">
                        Cargando reservas...
                    </div>
                )}
            {parsedToken && userRole === 'admin' && loading === false && reserved.length === 0 ?
                <Container className="text-center">
                    <h1>Aún no tienes reservas</h1>
                    <Button variant="primary" onClick={() => navigate('/rooms')}>Explora Habitaciones</Button>
                </Container>
                :
                reserved.map((reservation) => (
                    <Col key={reservation._id} sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 0 }} lg={4} xxl={3}>
                    <Card  className="my-3 shadow">
                        <Card.Body>
                            <Card.Title className='d-flex justify-content-between align-items-center'>{getRoomDetails(reservation.roomId).title}
                                <Button
                                    variant="danger"
                                    onClick={() => onDelete(reservation._id)}
                                    className="mt-2"
                                >
                                    <i className="fas fa-trash-alt"></i> Eliminar
                                </Button>
                            </Card.Title>
                            <Card.Text>
                                {getRoomDetails(reservation.roomId).description}
                            </Card.Text>
                            <Card.Text>
                                Tipo de habitacion: {getRoomDetails(reservation.roomId).tipeRoom}
                            </Card.Text>
                            <Card.Text>
                                Cama: {getRoomDetails(reservation.roomId).size}
                            </Card.Text>
                            <Card.Text>
                                {reservation.date} - Estado: {getReservationStatus(reservation.date)}
                            </Card.Text>
                            <Card.Text>
                                Usuario: {getUserDetails(reservation.userId).email}
                            </Card.Text>
                            <Card.Text>
                                Nombre: {getUserDetails(reservation.userId).lastName}, {getUserDetails(reservation.userId).firstName}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    </Col>
                   
                ))
            }
            </Row>
        </Container>
    )
}

export default AllReservations