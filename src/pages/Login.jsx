import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Toast } from 'react-bootstrap'
import appConfig from '../config.js'
import globalState from '../state.js'

import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [frm, setFrm] = useState({ email: '', password: '' })
  const [toastMsg, setToastMsg] = useState({ show: false, msg: '' })
  // Recuperamos el método global setLoading para cambiar el estado del spinner
  const setLoading = globalState((state) => state.setLoading)
  
  // useEffect de Array vacío, se ejecuta SOLO al montar
  useEffect(() => {
    (async () => {
    })();

    return () => {}
  }, [])

  // Cada vez que hay un cambio de contenido en los campos del formulario, actualizamos el objeto frm
  const handleChange = (event) => {
    setFrm({...frm, [event.target.name]: event.target.value});
  };

  const handleSubmit = async (e) => {
    // Evitamos que el navegador siga su secuencia habitual, manejaremos nosotros el formulario
    e.preventDefault()

    try {
      // Generamos referencia al objeto de formulario en el DOM para chequear validez.
      const frmElement = e.currentTarget
      if (!frmElement.checkValidity()) {
        setToastMsg({ show: true, msg: 'Por favor, complete los campos requeridos' })
        frmElement.querySelector('input[type=email]').focus()
      } else {
        // Aunque el HTML nos indique formulario válido, podemos agregar más controles aquí
        if (frm.password.length > 0 && frm.password.length < 6) {
          setToastMsg({ show: true, msg: 'La clave debe tener entre 6 y 12 caracteres' })
          frmElement.querySelector('input[type=password]').focus()
        } else {
          // Si todo está bien, realizamos una solicitud POST a la API, enviando el contenido del formulario
          setLoading(true)
          const resultado = await fetch(`${appConfig.API_BASE_URL}/${appConfig.POST_USERS_LOGIN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(frm)
          })
          const resultadoJson = await resultado.json();

          // Si la API responde con un OK, quiere decir que la autenticación fue exitosa, disponemos de datos
          // de usuario, incluyendo un token, los almacenamos en localStorage.
          setLoading(false)
          if (resultadoJson.status == 'OK') {
            localStorage.setItem('cart_user', JSON.stringify(resultadoJson.data));
            localStorage.setItem('cart_user_backup', JSON.stringify(resultadoJson.data));
            navigate('/giftcards', { replace: true });
          } else {
            // Si hubo algún problema, el objeto data contendrá el mensaje de error, lo mostramos y volvemos al formulario
            setToastMsg({ show: true, msg: resultadoJson.data })
            frmElement.querySelector('input[type=email]').focus()
          }
        }
      }
    } catch (err) {
      setToastMsg({ show: true, msg: err.message })
      setLoading(false)
    }
  }

  return (
    <>
      <Container className="container-fluid container-home">
        <Row>
          <Col xs={12} sm={6} className="col-home">
            <Row className="p-3">
              <h1>¿Tienes una Gift Card?</h1>
              <h3>Prueba todas las marcas que la aceptan de manera online</h3>
            </Row>
          </Col>

          <Col xs={12} sm={6} className="col-home">
            <Row className="card p-3" style={{width: '100%'}}>
              {/*
              noValidate evita que el navegador muestre los mensajes de validación por defecto en los campos,
              los reemplazaremos por nuestro mensaje personalizado para cada caso.

              MUY IMPORTANTE que el name de los input (Form.Control) coincida con lo que el endpoint espera,
              caso contrario hay que rearmar el objeto con las keys que corresponde más arriba en la solicitud POST
              */}
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Email" value={frm.email} name="email" maxLength={32} required autoFocus onChange={handleChange} />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Clave</Form.Label>
                  <Form.Control type="password" value={frm.password} name="password" maxLength={12} required onChange={handleChange} />
                </Form.Group>
                
                <Button type="submit" variant="warning">Ingresar</Button>
              </Form>
            </Row>
          </Col>
        </Row>

        <Toast show={toastMsg.show} delay={3000} onClose={() => setToastMsg({ show: false, msg: '' })} autohide style={{ position: 'fixed', bottom: '1em', right: '1em', zIndex: '1000', backgroundColor: '#333', color: '#fff' }}>
          <Toast.Header>
            {/* <img src="imagen" className="rounded me-2" alt="RollingCode" /> */}
            <i className="fa fa-shopping-cart fa-2x"></i>&nbsp;
            <strong className="me-auto">Login</strong>
            <small>Ahora</small>
          </Toast.Header>
          
          <Toast.Body>{toastMsg.msg}</Toast.Body>
        </Toast>
      </Container>
    </>
  )
}

export default Login
