import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import appConfig from '../config';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './reservations.css'

import { useJwt } from 'react-jwt';
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

const UserReservations = () => {
    const [reserved, setReserved] = useState([]);
    const [toastMsg, setToastMsg] = useState({ show: false, msg: '' })
    const authToken = localStorage.getItem('authToken');
    const parsedToken = JSON.parse(authToken);
    const { decodedToken, isExpired } = useJwt(parsedToken?.token || '');
    const userRole = decodedToken ? decodedToken.role : null;
    const navigate = useNavigate()
    const [roomDetails, setRoomDetails] = useState({});


    useEffect(() => {
        const fetchReserved = async () => {
            try {
                const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.RESERVED_ROOM}`, {
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
    

                setReserved(sortedReserved);
                    fetchAllRoomDetails()
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
                setToastMsg({ show: true, msg: error.message });
            }
        }
        fetchReserved();

    }, []);

    const fetchAllRoomDetails = async () => {
        try{
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
            setToastMsg({ show: true, msg: error.message });
        }
    }

    const getRoomDetails = (roomId) => {
        return roomDetails[roomId] || {};
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

    return (
        <Container id='reservations'>
            <Row id='rowReservations'>
            {!parsedToken && (
                <div className="text-center">
                    <h1>Debe iniciar sesión para ver sus reservas</h1>
                    <Button variant="primary" onClick={() => navigate('/login')}>Iniciar sesión</Button>
                </div>
            )}
            {parsedToken && userRole === 'usuario' && reserved.length === 0 ?
            (<Container className="text-center">
                    <h1>Aún no tienes reservas</h1>
                    <Button variant="primary" onClick={() => navigate('/rooms')}>Explora Habitaciones</Button>
                </Container>)
                :
                (reserved.map((reservation) => (
                    <Col key={reservation._id}  sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 0 }} lg={4} xxl={3}>
                    <Card  className="my-3 shadow">
                        <Card.Body>
                            <Card.Title>{getRoomDetails(reservation.roomId).title}</Card.Title>
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
                        </Card.Body>
                    </Card>
                    </Col>
                )))
            }
            </Row>
        </Container>
    )
}

export default UserReservations