import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Toast } from 'react-bootstrap'
import appConfig from '../config.js'
import globalState from '../state.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

import './Login.css'

const Login = () => {
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
      setToastMsg({ show: true, msg: 'Algo salio muy mal. Por favor, inténtalo de nuevo.', success: false })
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
            <Row className="card p-3" style={{ width: '100%' }}>
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
                    value={frm.password}
                    name="password"
                    maxLength={12}
                    required
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button type="submit" variant="warning">
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
            right: '1em',
            zIndex: '1000',
            backgroundColor: toastMsg.success ? '#28a745' : '#dc3545', 
            color: '#fff',
          }}
        >
          <Toast.Header>
            <FontAwesomeIcon icon={toastMsg.success ? faCheckCircle : faExclamationTriangle} size="2x" />&nbsp
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
