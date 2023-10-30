import { Container, Row, Col, Form, Button, Toast } from 'react-bootstrap'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import appConfig from '../config.js'
import globalState from '../state.js'
import './register.css'


const Register = () => {
    const navigate = useNavigate()
    const [frm, setFrm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        city: '',
    })
    const [password1, setPassword1] = useState('')

    const [toastMsg, setToastMsg] = useState({ show: false, msg: '' })
    const [isChecked, setIsChecked] = useState(false)
    const setLoading = globalState((state) => state.setLoading)


    const handleChange = (event) => {
        if (event.target.name === 'termsAndConditions') {
            setIsChecked(event.target.checked)
        } else {
            setFrm({ ...frm, [event.target.name]: event.target.value })
        }

        if (event.target.name === 'password1') {
            setPassword1(event.target.value)
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isChecked) {
            setToastMsg({ show: true, msg: 'Debes aceptar los términos y condiciones para registrarte.' })
            return
        }

        const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phone', 'address', 'city'];
        for (const field of requiredFields) {
            if (!frm[field]) {
                setToastMsg({ show: true, msg: `Todos los campos son obligatorios.` })
                return;
            }
        }

        const emailRegex = /\S+@\S+\.\S+/
        if (!emailRegex.test(frm.email)) {
            setToastMsg({ show: true, msg: 'Por favor, ingresa un correo válido.' })

            return
        }

        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(frm.phone)) {
            setToastMsg({ show: true, msg: 'Por favor, ingresa un teléfono válido.' })
            return
        }

        if (frm.password.length < 8) {
            setToastMsg({ show: true, msg: 'La contraseña debe tener al menos 8 caracteres.' })
            return
        }

        if (frm.password !== password1) {
            setToastMsg({ show: true, msg: 'Las contraseñas no coinciden.' })
            return
        }

        setLoading(true)
        try {
            const userData = {
                firstName: frm.firstName,
                lastName: frm.lastName,
                email: frm.email,
                password: frm.password,
                phone: frm.phone,
                address: frm.address,
                city: frm.city,
            }

            const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.POST_USERS_REGISTER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            if (response.status === 201) {
                setToastMsg({ show: true, msg: 'Registro exitoso, por favor inicia sesión.' })
                setLoading(false)
                navigate('/login')
            } else if (response.status === 400) {
                const data = await response.json()
                setToastMsg({ show: true, msg: data.error || 'El correo electrónico ya está registrado.' })
            } else if (response.status === 500) {
                setToastMsg({ show: true, msg: 'Hubo un error en el servidor. Por favor, inténtalo de nuevo más tarde.' })
            } else {
                setToastMsg({ show: true, msg: 'Hubo un error al registrar el usuario. Por favor, inténtalo de nuevo.' })
            }
        } catch (error) {
            setToastMsg({ show: true, msg: 'Hubo un error al registrar el usuario. Por favor, inténtalo de nuevo.' })
        }

        setLoading(false)

    }

    return (
        <Container id='registerContainer'>
            <Row>
                <Col sm={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} lg={{ span: 7, offset: 3 }} xl={{ span: 8, offset: 2 }} xxl={{ span: 8, offset: 2 }}>
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId="firstName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                placeholder='Nombre'
                                value={frm.firstName}
                                onChange={handleChange}
                                isInvalid={!frm.firstName || frm.firstName.length < 2}
                            />
                            <Form.Control.Feedback type="invalid">
                                Ingrese su nombre por favor
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="lastName">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                placeholder='Apellido'
                                value={frm.lastName}
                                onChange={handleChange}
                                isInvalid={!frm.lastName || frm.lastName.length < 2}
                            />
                            <Form.Control.Feedback type="invalid">
                                Ingrese su apellido por favor
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder='email'
                                value={frm.email}
                                onChange={handleChange}
                                isInvalid={!frm.email || !/\S+@\S+\.\S+/.test(frm.email)}
                            />
                            <Form.Control.Feedback type="invalid">
                                El correo debe contener @ y ser gmail.com, yahoo.com, etc
                            </Form.Control.Feedback>

                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder='contraseña'
                                value={frm.password}
                                onChange={handleChange}
                                pattern=".{8,}"
                                isInvalid={!frm.password || frm.password.length < 8}
                            />
                            <Form.Control.Feedback type="invalid">
                                La contraseña debe tener 8 caracteres de longitud como minimo
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="password1">
                            <Form.Label>Repetir Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password1"
                                placeholder='Repetir ontraseña'
                                onChange={handleChange}
                                pattern=".{8,}"
                                isInvalid={!password1 || frm.password !== password1}
                            />
                            <Form.Control.Feedback type="invalid">
                                No coincide con la contraseña ingresada
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="phone">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                pattern="[0-9]{10}" 
                                placeholder='Telefono'
                                value={frm.phone}
                                onChange={handleChange}
                                
                                isInvalid={!frm.phone}
                            />
                            <Form.Control.Feedback type="invalid">
                                El telefono debe tener 10 numeros, con codigo de area sin cero y su numero sin 15.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="address">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                placeholder='Direccion'
                                value={frm.address}
                                onChange={handleChange}
                                isInvalid={!frm.address}
                            />
                            <Form.Control.Feedback type="invalid">
                                Ingrese su domicilio por favor
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="city">
                            <Form.Label>Ciudad</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                placeholder='Ciudad'
                                value={frm.city}
                                onChange={handleChange}
                                isInvalid={!frm.city}
                            />
                            <Form.Control.Feedback type="invalid">
                                Ingrese el nombre de la ciudad donde vive
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Text className="text-muted">
                                <a href="#" onClick={() => alert(`En base a nuestras politicas de privacidad usted se compromete a comunicarse con nosotros al momento de cancelar el turno.
El dinero solo sera reembolsable el dinero en caso de cancelar el turno.
Puede registrar solamente 1 noche con cada accion de reserva.
Hotel viajero se reserva los derechos de admision, por lo cual ante cualquier inconveniente puede denegar el acceso al edificio.`)}>Políticas y Privacidad</a>
                            </Form.Text>
                            <Form.Check
                                type="checkbox"
                                label="Acepto los términos y condiciones"
                                name="termsAndConditions"
                                checked={isChecked}
                                onChange={handleChange}
                                isInvalid={!isChecked}
                            />
                            <Form.Control.Feedback type="invalid">
                                Haga clic en el recuadro para aceptar nuestros terminos y condiciones
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Registrar
                        </Button>
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

                </Col>
            </Row>
        </Container>
    )
}

export default Register
