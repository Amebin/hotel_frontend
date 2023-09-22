import { useState } from 'react'
import { Container, Row, Col, Button, Toast } from 'react-bootstrap'
import GiftCard from '../components/GiftCard.jsx'
import appConfig from '../config.js'

import './Cart.css'

function Cart() {
  const user = JSON.parse(localStorage.getItem('cart_user')) || { cart: [] }
  user.total = user.cart.reduce((acc, current) => { return acc + parseFloat(current.price) }, 0) || 0
  
  const [userCart, setUserCart] = useState({ cart: user.cart, total: user.total, modified: false })
  const [toastMsg, setToastMsg] = useState({ show: false, msg: '' })

  const updateCart = (card) => {
    user.cart = user.cart.filter(item => item._id !== card._id)
    localStorage.setItem('cart_user', JSON.stringify(user))
    setUserCart(current => { return { cart: user.cart, total: current.total - parseFloat(card.price), modified: true } })
  }

  const updateDbCart = async () => {
    try {
      const update = await fetch(`${appConfig.API_BASE_URL}/${appConfig.ADD_CART_ENDPOINT}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ cart: userCart.cart })
      })

      const result = await update.json()

      if (result.status === 'OK') {
        setToastMsg({ show: true, msg: 'Carrito actualizado!' })
        setUserCart(current => { return { cart: current.cart, total: current.total, modified: false } })
      } else {
        setToastMsg({ show: true, msg: result.data })
      }
    } catch (err) {
      setToastMsg({ show: true, msg: err.message })
    }
  }

  const restoreCart = () => {
    const backup = JSON.parse(localStorage.getItem('cart_user_backup'))
    localStorage.setItem('cart_user', JSON.stringify(backup))
    backup.total = backup.cart.reduce((acc, current) => { return acc + parseFloat(current.price) }, 0)
    setUserCart({ cart: backup.cart, total: backup.total, modified: false })
  }

  const checkout = () => {
    setToastMsg({ show: true, msg: 'Aquí redirecciona a la plataforma de pago' })
  }

  return (
    <>
      <Container className="mt-3 mb-3 p-3 bg-light container-blocks">
        <Row>
          <Col xs={12} style={{ position: 'relative' }}>
            <h1>Carrito actual</h1>
            
            <div className="totals">
              <span className="badge bg-secondary ms-2" style={{ fontSize: '120%' }}>{userCart.cart.length > 0 ? userCart.cart.length : '0'}</span>
              <span className="badge bg-secondary ms-2" style={{ fontSize: '200%' }}>$ {userCart.total > 0 ? userCart.total.toFixed(2) : '0.00'}</span>
            </div>

            <hr />
          </Col>
        </Row>

        <Row>
          <Col className="cart_grid">
            {userCart.cart.length === 0 ?
              <p>El carrito está vacío</p>
              :
              userCart.cart.map(card => <GiftCard key={card._id} user={user} card={card} updateCart={updateCart} showAdd={false} />)
            }
          </Col>
        </Row>

        <Row className="m-1 p-3" style={{border: '1px solid #ccc', borderRadius: '0.5em'}}>
          <Col xs={12} md={4}>
            {userCart.modified && <Button variant="warning" onClick={restoreCart} style={{ width: '100%', margin: '0.5em' }}><i className="fa fa-solid fa-rotate-left"></i>&nbsp;Deshacer cambios</Button>}
          </Col>

          <Col xs={12} md={4}>
            {userCart.modified && <Button variant="warning" onClick={updateDbCart} style={{ width: '100%', margin: '0.5em' }}><i className="fa fa-solid fa-pencil"></i>&nbsp;Actualizar carrito</Button>}
          </Col>

          <Col xs={12} md={4}>
            <Button variant="warning" onClick={checkout} style={{ width: '100%', margin: '0.5em' }}><i className="fa fa-solid fa-check"></i>&nbsp;<b>Confirmar compra</b></Button>
          </Col>
        </Row>

        <Toast show={toastMsg.show} delay={3000} onClose={() => setToastMsg({ show: false, msg: '' })} autohide style={{ position: 'fixed', bottom: '1em', right: '1em', zIndex: '1000', backgroundColor: '#333', color: '#fff'}}>
          <Toast.Header>
            {/* <img src="imagen" className="rounded me-2" alt="RollingCode" /> */}
            <i className="fa fa-shopping-cart fa-2x"></i>&nbsp;
            <strong className="me-auto">Carrito</strong>
            <small>Ahora</small>
          </Toast.Header>
          
          <Toast.Body>{toastMsg.msg}</Toast.Body>
        </Toast>
      </Container>
    </>
  )
}

export default Cart