import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Toast } from 'react-bootstrap'
import appConfig from '../config.js'
import globalState from '../state.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

import './Login.css'

const Login = () => {
  localStorage.removeItem('authToken');
  const navigate = useNavigate()
  const [frm, setFrm] = useState({ email: '', password: '' })
  const [toastMsg, setToastMsg] = useState({ show: false, msg: '' })
  const setLoading = globalState((state) => state.setLoading)
  

  useEffect(() => {
    (async () => {
    })()
    return () => { }
  }, [])
  
  const handleChange = (event) => {
    setFrm({ ...frm, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const frmElement = e.currentTarget
      if (!frmElement.checkValidity()) {
        setToastMsg({ show: true, msg: 'Por favor, complete los campos requeridos', success: false })
        return
      }
  
      setLoading(true)
      const userData = {
        email: frm.email,
        password: frm.password,
      }
  
      const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.POST_USERS_LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
  
      setLoading(false) 
      const responseData = await response.json()  
      
      if (response.ok) {
  
        if (response.status === 200) {
          localStorage.setItem('authToken', JSON.stringify({ token: responseData.data.token}))
          navigate('/', { replace: true })
        } else if (response.status === 400) {
          setToastMsg({ show: true, msg: responseData.data, success: false })
        } else if (response.status === 401) {
          setToastMsg({ show: true, msg: responseData.data , success: false })
        } else if (response.status === 500) {
          setToastMsg({ show: true, msg: responseData.data , success: false })
        } else {
          setToastMsg({ show: true, msg: responseData.data , success: false })
        }
      } else {
        setToastMsg({ show: true, msg: responseData.data , success: false })
      }
    } catch (err) {
      setToastMsg({ show: true, msg: 'Algo salio muy mal. Por favor, inténtalo de nuevo mas tarde.', success: false })
      setLoading(false)
    }
  }
  

  return (
    <>
      <Container className="container-fluid" id='loginContainer'>
        <Row>
          <Col sm={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3}} xl={{ span: 5, offset: 0}} xxl={{ span: 4, offset: 1}}>
            <Row className="text-center">
              <h1>¿Tenes una cuenta?</h1>
              <h3>Ingresa y reserva la fecha que mas se ajuste a tus tiempos</h3>
            </Row>
          </Col>
          <Col sm={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3}} xl={{ span: 5, offset: 0}} xxl={{ span: 4, offset: 1}} id='colLogin'>
            <Row className="card">
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={frm.email}
                    name="email"
                    maxLength={32}
                    required
                    autoFocus
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Clave</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Clave"
                    value={frm.password}
                    name="password"
                    maxLength={12}
                    required
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button type="submit">
                  Ingresar
                </Button>
              </Form>
            </Row>
          </Col>
        </Row>

        <Toast
          show={toastMsg.show}
          delay={3000}
          onClose={() => setToastMsg({ show: false, msg: '' })}
          autohide
          style={{
            position: 'fixed',
            bottom: '1em',
            right: '0',
            zIndex: '1000',
            backgroundColor: toastMsg.success ? '#28a745' : '#dc3545', 
            color: '#fff',
          }}
        >
          <Toast.Header>
            <FontAwesomeIcon icon={toastMsg.success ? faCheckCircle : faExclamationTriangle} size="2x" />
            <strong className="me-auto">{toastMsg.success ? 'Éxito' : 'Error'}</strong>
            <small>Ahora</small>
          </Toast.Header>


          <Toast.Body>{toastMsg.msg}</Toast.Body>
        </Toast>
      </Container>

    </>
  )
}

export default Login
