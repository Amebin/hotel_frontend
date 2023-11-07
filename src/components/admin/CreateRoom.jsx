import React, { useState } from 'react';
import { Button, Container, Row, Col, Toast, Form } from 'react-bootstrap';
import appConfig from '../../config.js';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import globalState from '../../state.js'
import Error404 from '../../pages/Error404.jsx'
import { useJwt } from 'react-jwt';

import './createRooms.css'

const MySwal = withReactContent(Swal);

const CreateRoom = () => {
    const authToken = localStorage.getItem('authToken')
    const parsedAuth = JSON.parse(authToken);
    const { decodedToken, isExpired } = useJwt(parsedAuth?.token || '');
    const userRole = decodedToken ? decodedToken.role : null;
   
    const [validated, setValidated] = useState(false);
    
    const [formNewRoom, setFormNewRoom] = useState({
        numberRoom: '',
        price: '',
        type: '',
        image: '',
        tittle: '',
        description: '',
        size: '',
        capacity: ''
    });
    
    const [toastMsg, setToastMsg] = useState({ show: false, msg: '' })
    const setLoading = globalState((state) => state.setLoading)
    const reloadPage = () => {
        window.location.reload();
    };

    const handleChange = (event) => {
        setFormNewRoom({ ...formNewRoom, [event.target.name]: event.target.value })
    }

   
    const handleCreateRoom = async (event) => {
        event.preventDefault();
       
        const numberRoomRegex = /^\d{1,2}$/
        if(!numberRoomRegex.test(formNewRoom.numberRoom)){
            setToastMsg({ show: true, msg: 'Por favor, ingresa un numero de habitacion entre 1 y 25.' })
            return
        }

        const priceRegex = /^\d{5,5}$/
        if( !priceRegex.test(formNewRoom.price)){
            setToastMsg({ show: true, msg: 'Por favor, ingresa un precio entre 10000 y 90000.' })
            return
        }
       
        if(formNewRoom.tipeRoom.length <= 5){
            setToastMsg({ show: true, msg: 'Por favor, ingresa un tipo de habitacion valido (Matrimonial, etc).' })
            return
        }

        
        if(formNewRoom.image.length <= 20){
            setToastMsg({ show: true, msg: 'Por favor, ingresa una URL valida.' })
            return
        }

        if(formNewRoom.tittle.length <= 5){
            setToastMsg({ show: true, msg: 'Por favor, ingresa un titulo valido.' })
            return
        }

        if(formNewRoom.description.length <= 5){
            setToastMsg({ show: true, msg: 'Por favor, ingresa una descripcion valida.' })
            return
        }

        if(formNewRoom.size.length <= 5){
            setToastMsg({ show: true, msg: 'Por favor, ingresa un tamaño valido.' })
            return
        }

        if(formNewRoom.capacity.length <= 0){
            setToastMsg({ show: true, msg: 'Por favor, ingresa una capacidad valida.' })

            return
        }
        
        try{
            const newRoomData = {
                numberRoom: formNewRoom.numberRoom,
                price: formNewRoom.price,
                tipeRoom: formNewRoom.tipeRoom,
                images: formNewRoom.image,
                title: formNewRoom.tittle,
                description: formNewRoom.description,
                size: formNewRoom.size,
                capacity: formNewRoom.capacity
            }
            setLoading(true)
            const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.CREATE_ROOM}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${parsedAuth.token}`
                },
                body: JSON.stringify(newRoomData),
            })
            const resultResponse = await response.json()
            
            setLoading(false)
            if (response.status === 201) {
                setToastMsg({ show: true, msg: 'Habitacion creada correctamente.' })
                MySwal.fire({
                    title: 'Habitacion creada correctamente.',
                    icon: 'success',
                    text: `La habitacion ${newRoomData.numberRoom} ha sido creada correctamente`,

                }).then(() => {
                    reloadPage()
                }
                )                  
            } else if (response.status === 400) {
                setToastMsg({ show: true, msg: resultResponse.data || 'La habitacion ya se encuentra registrada' })
              } else if (response.status === 500) {
                setToastMsg({ show: true, msg: resultResponse.data || 'Hubo un error en el servidor. Por favor, inténtalo de nuevo más tarde.' })
              } else {
                setToastMsg({ show: true, msg: resultResponse.data || 'Hubo un error al registrar la habitacion. Por favor, inténtalo de nuevo.' })
              }
            } catch (error) {
              setToastMsg({ show: true, msg: 'Algo salio muy mal, intentalo mas tarde por favor' })
              setLoading(false)
            }
            

    }    


    return (
        <Container>
        {!authToken && <Error404 />}
          {authToken && userRole !== 'admin' && <Error404 />}
          {authToken && isExpired && <Error404 />}
          { authToken && userRole === 'admin' && !isExpired && (
            <Row id='createContainer'>
            
            <Form noValidate validated={validated} onSubmit={handleCreateRoom}>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" lg={{ span: 5, offset: 1}} xl="4" controlId="numberRoom">
                        <Form.Label>Numero de la habitacion</Form.Label>
                        <Form.Control
                            required
                            name="numberRoom"
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={99}
                            placeholder="0"
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor ingresa el número de habitacion del 1 a 99.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="6" lg={{ span: 5, offset: 1}} xl="4" controlId="price">
                        <Form.Label>Precio</Form.Label>
                        <Form.Control
                            required
                            name="price"
                            type="number"
                            min={7000}
                            max={90000}
                            placeholder="10000"
                            
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor ingresa el costo por noche de la habitacion.
                        </Form.Control.Feedback>
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} md="6" lg={{ span: 5, offset: 1}} xl="4" controlId="tipeRoom">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                            required
                            name="tipeRoom"
                            type="text"
                            minLength={5}
                            placeholder="Matrimonial, familiar, etc"
                            onChange={handleChange}

                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor ingresa el tipo de habitacion.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="6" lg={{ span: 5, offset: 1}} xl="4" controlId="image">
                        <Form.Label>Imagen</Form.Label>
                        <Form.Control
                            required
                            name="image"
                            type="text"
                            placeholder="https:img.com/imagen.jpg"
                            minLength={20}
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor ingresa el URL de una imagen de la habitacion.
                        </Form.Control.Feedback>
                    </Form.Group>

                </Row>

                <Row className="mb-3">
                <Form.Group as={Col} md="6" lg={{ span: 5, offset: 1}} xl="4" controlId="tittle">
                        <Form.Label>Titulo (opcional)</Form.Label>
                        <Form.Control
                            type="text"
                            name="tittle"
                            placeholder="Glamur 4to piso"
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="6" lg={{ span: 5, offset: 1}} xl="4" controlId="description">
                        <Form.Label>Descripcion (opcional)</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            placeholder="Habitacion con vista al mar, con baño privado, etc"
                            onChange={handleChange}
                            required
                            
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                
                <Form.Group as={Col} md="6" lg={{ span: 5, offset: 1}} xl="4" controlId="size">
                        <Form.Label>Tamaño camas (opcional)</Form.Label>
                        <Form.Control
                            type="text"
                            name="size"
                            placeholder="Cama doble, cucheta, cama simple, etc"
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="6" lg={{ span: 5, offset: 1}} xl="4" controlId="capacity">
                        <Form.Label>Capacidad (opcional)</Form.Label>
                        <Form.Control
                            type="number"
                            name="capacity"
                            placeholder="2, 4, 6, etc"
                            min={1}
                            max={8}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Row>

                    <Form.Group as={Col}  controlId="validationCustom05">

                        <small className="text-muted">
                            De manera automatica se generaran 20 fechas a partir del momento de la creacion de la nueva habitacion, luego podras modificar esto desde la seccion Admin de modificar habitaciones
                        </small>
                    </Form.Group>
                <Button type="submit">Crear Habitacion</Button>
            </Form>
            

            <Toast
                        show={toastMsg.show}
                        onClose={() => setToastMsg({ show: false, msg: '' })}
                        delay={5000}
                        autohide
                        style={{
                            position: 'fixed',
                            bottom: 20,
                            right: 20,
                            minWidth: '250px',
                        }}
                    >
                        <Toast.Header closeButton={false}>
                            <strong className="me-auto">Atencion!</strong>
                        </Toast.Header>
                        <Toast.Body>{toastMsg.msg}</Toast.Body>
            </Toast>
            </Row>
          )}
        </Container>

    )

}

export default CreateRoom