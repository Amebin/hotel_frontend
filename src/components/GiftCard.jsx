/**
 * Este código estaba antes en Giftcards, lo hemos separado ahora en un pequeño componente,
 * que por supuesto puede reusarse. En este caso lo estamos aprovechando desde Giftcards y Cart
*/

function GiftCard({ user, card, updateCart, showAdd }) {
  return (
    <>
        <div className="card mb-4">
          <h5 className="card-title" style={{ padding: '0.5em' }}>{card.title}</h5>

          <img src={card.image} alt={card.title} style={{ width: '75%', height: '75%' }} />

          <div className="card-body">
            <h3 className="card-text text-end">$ {card.price} AR</h3>
            <div style={{ width: '100%', textAlign: 'right' }}>
              {/*
              Similar al resumen, si hay token, habilitamos el botón para cargar al carrito.
              Por supuesto, el usuario podría saltar este control, pero al actualizar el carrito en el backend,
              deberá presentar un token válido.
              */}
              {user.hasOwnProperty('token') && showAdd && <button className="btn btn-secondary" onClick={() => { updateCart(card) }} style={{ width: '64px' }}><i className="fa fa-cart-plus fa-2x"></i></button>}
              {user.hasOwnProperty('token') && !showAdd && <button className="btn btn-secondary" onClick={() => { updateCart(card) }} style={{ width: '48px' }}><i className="fa fa-solid fa-trash"></i></button>}
            </div>
          </div>
        </div>
    </>
  )
}

export default GiftCard