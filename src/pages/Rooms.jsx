import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Toast } from 'react-bootstrap'
import GiftCard from '../components/GiftCard.jsx'
import appConfig from '../config.js'
import globalState from '../state.js'

import './Rooms.css'

const GiftCards = () => {
  const navigate = useNavigate();

  // Si hay info del usuario disponible en el localStorage, la recuperamos
  // en lugar de realizar una nueva consulta a la base de datos
  const user = JSON.parse(localStorage.getItem('cart_user')) || { cart: [] }
  user.total = user.cart.reduce((acc, current) => { return acc + parseFloat(current.price) }, 0) || 0

  const [giftCards, setGiftCards] = useState([])
  const [userCart, setUserCart] = useState({ cart: user.cart, total: user.total })
  const [toastMsg, setToastMsg] = useState({ show: false, msg: '' })
  // Recuperamos el método global setLoading para cambiar el estado del spinner
  const setLoading = globalState((state) => state.setLoading)

  const showCart = () => {
    navigate('/cart', { replace: false })
  }

  const updateCart = async (card) => {
    try {
      user.cart.push(card)

      // Recordar que por defecto al utilizar fetch, realizamos una petición tipo GET
      // Si deseamos otro tipo, debemos indicarlo con method, en este caso podemos ver
      // también la forma correcta de armar los headers para el tipo de dato enviado y
      // la inclusión del token que nos identifica, caso contrario el endpoint rechazará la solicitud.
      setLoading(true)
      const update = await fetch(`${appConfig.API_BASE_URL}/${appConfig.ADD_CART_ENDPOINT}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ cart: user.cart })
      })

      const result = await update.json()

      // Si todo está ok, guardamos los datos recibidos en el localStorage para tenerlos a mano,
      // y recalculamos el total del carrito, esto también podría almacenarse en la base de datos.
      if (result.status === 'OK') {
        localStorage.setItem('cart_user', JSON.stringify(user))
        setUserCart(current => { return { cart: user.cart, total: current.total + parseFloat(card.price) } })
        setToastMsg({ show: true, msg: 'Producto agregado!' })
      } else {
        setToastMsg({ show: true, msg: result.data })
      }
      setLoading(false)
    } catch (err) {
      setToastMsg({ show: true, msg: err.message })
      setLoading(false)
    }
  }

  // useEffect de Array vacío, se ejecuta SOLO al montar para recuperar las giftcards disponibles
  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const data = await fetch(`${appConfig.API_BASE_URL}/${appConfig.GET_GIFTCARDS_ENDPOINT}`)
        const dataJson = await data.json()
        setGiftCards(dataJson.data)
        setLoading(false)
      } catch (err) {
        setToastMsg({ show: true, msg: err.message })
        setLoading(false)
      }
    })()

    return () => {}
  }, []);

  return (
    <>
      <Container className="mt-3 mb-3 p-3 bg-light container-blocks">
        <Row>
          <Col xs={12}>
            <h1>GiftCards aceptadas</h1>
            <hr />
            
            {/*
            Si hay un token en la info de usuario, significa que está autenticado, se muestra el resumen del carrito
            */}
            {user.hasOwnProperty('token') &&
              <div className="cart-box">
                <h5>GiftCards en carrito</h5>

                <div>
                  <Button variant="warning" onClick={showCart} style={{ width: '100%' }}>
                    <i className="fa fa-shopping-cart fa-2x"></i>
                    <span className="badge bg-secondary ms-2">{userCart.cart.length > 0 ? userCart.cart.length : '0'}</span>
                    <span className="badge bg-secondary ms-1" style={{ fontSize: '110%' }}>$ {userCart.total > 0 ? userCart.total.toFixed(2) : '0.00'}</span>
                  </Button>
                </div>
              </div>
            }
          </Col>
        </Row>

        <Row>
          {/* Insertamos el componente GiftCard, pasándole las props necesarias */}
          <Col className="cards_grid">
            {giftCards.map(card => <GiftCard key={card._id} user={user} card={card} updateCart={updateCart} showAdd={true} />)}
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
  );
};

export default GiftCards