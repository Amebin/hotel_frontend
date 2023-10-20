import { Container, Row, Col, Carousel } from 'react-bootstrap'
import '../pages/sectionHome.css'
import img_phone1 from '../img/img_phone1.jpg'
import img_phone2 from '../img/img_phone2.jpg'
import img_phone3 from '../img/img_phone3.jpg'
import img_phone4 from '../img/img_phone4.jpg'
import img_phone5 from '../img/img_phone5.jpg'
import img_phone6 from '../img/img_phone6.jpg'
import medium_1 from '../img/medium_1.jpg'
import medium_2 from '../img/medium_2.jpg'
import medium_3 from '../img/medium_3.jpg'
import medium_4 from '../img/medium_4.jpg'
import medium_5 from '../img/medium_5.jpg'
import medium_6 from '../img/medium_6.jpg'
import HD_1 from '../img/HD_1.jpg'
import HD_2 from '../img/HD_2.jpg'
import HD_3 from '../img/HD_3.jpg'
import HD_4 from '../img/HD_4.jpg'
import HD_5 from '../img/HD_5.jpg'
import HD_6 from '../img/HD_6.jpg'

const Presentation = () => {
  return (
    <Container id="home">
      <Row>
        <Col>
          <h1>Bienvenido al Hotel Viajero</h1>

          <p>
            Ubicado estratégicamente en la pintoresca Ruta 9, kilómetro 5 1/2, nuestro hotel se presenta como un oasis para los viajeros de todo tipo.
            Nos especializamos en brindar una experiencia única para aquellos que buscan un hospedaje de paso, y además, organizamos eventos especialmente pensados para los apasionados moto viajeros.
          </p>
        </Col>
      </Row>

      <Row id='carouselDiv'>
        <Col>
          <h2>Servicios Excepcionales para tu Estadía:</h2>
        </Col>
        <Col>
          <Carousel>
            <Carousel.Item>
              <picture>
                <source
                  media="(min-width: 768px)"
                  srcSet={HD_1}
                />
                <source
                  media="(min-width: 348px)"
                  srcSet={medium_1}
                />
                <img
                  src={img_phone1}
                  alt="imagen hotel pequeña pantalla"
                />
              </picture>
              <div className="image-overlay"></div>
              <Carousel.Caption>
                <h3><strong>Reserva por Noche:</strong></h3>
                <p>Ofrecemos la flexibilidad de reservar por noche, adaptándonos a tus necesidades de viaje.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
            <picture>
                <source
                  media="(min-width: 768px)"
                  srcSet={HD_2}
                />
                <source
                  media="(min-width: 348px)"
                  srcSet={medium_2}
                />
                <img
                  src={img_phone2}
                  alt="imagen hotel pequeña pantalla"
                />
              </picture>
              <div className="image-overlay"></div>
              <Carousel.Caption>
                <h3><strong>Habitaciones con Cocina y Baño Privados:</strong></h3>
                <p>Cada una de nuestras habitaciones está equipada con baño y cocina privada para garantizar tu comodidad y privacidad.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
            <picture>
                <source
                  media="(min-width: 768px)"
                  srcSet={HD_3}
                />
                <source
                  media="(min-width: 348px)"
                  srcSet={medium_3}
                />
                <img
                  src={img_phone3}
                  alt="imagen hotel pequeña pantalla"
                />
              </picture>
              <div className="image-overlay"></div>
              <Carousel.Caption>
                <h3><strong>Estacionamiento Incluido:</strong></h3>
                <p>Olvídate de preocuparte por el estacionamiento. Contamos con un amplio espacio en el mismo predio del hotel.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
            <picture>
                <source
                  media="(min-width: 768px)"
                  srcSet={HD_4}
                />
                <source
                  media="(min-width: 348px)"
                  srcSet={medium_4}
                />
                <img
                  src={img_phone4}
                  alt="imagen hotel pequeña pantalla"
                />
              </picture>
              <div className="image-overlay"></div>
              <Carousel.Caption>
                <h3><strong>Relájate en Nuestra Piscina:</strong></h3>
                <p>Disfruta de un refrescante chapuzón en nuestra piscina después de un día de viaje.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
            <picture>
                <source
                  media="(min-width: 768px)"
                  srcSet={HD_5}
                />
                <source
                  media="(min-width: 348px)"
                  srcSet={medium_5}
                />
                <img
                  src={img_phone5}
                  alt="imagen hotel pequeña pantalla"
                />
              </picture>
              <div className="image-overlay"></div>
              <Carousel.Caption>
                <h3><strong>Sala de Descanso Común:</strong></h3>
                <p>Nuestra acogedora sala común es el lugar perfecto para socializar con otros viajeros o simplemente relajarte.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
            <picture>
                <source
                  media="(min-width: 768px)"
                  srcSet={HD_6}
                />
                <source
                  media="(min-width: 348px)"
                  srcSet={medium_6}
                />
                <img
                  src={img_phone6}
                  alt="imagen hotel pequeña pantalla"
                />
              </picture>
              <div className="image-overlay"></div>
              <Carousel.Caption>
                <h3><strong>Bar para Viajeros:</strong> </h3>
                <p>En nuestro bar, los viajeros tienen la oportunidad de trabajar temporalmente y ganar su plato de comida o una noche de hospedaje.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2>Ubicación Estratégica:</h2>

          <ul>
            <li><strong>Accesibilidad Inigualable:</strong> Estamos ubicados en la Ruta 9, kilómetro 5 1/2, garantizando un fácil ingreso y salida.</li>
            <li><strong>Cercanía al Cadillal:</strong> A pocos minutos, puedes disfrutar del hermoso embalse El Cadillal, un lugar ideal para relajarse y disfrutar de la naturaleza.</li>
            <li><strong>Sabor Local en 'El Turco':</strong> No te pierdas la oportunidad de visitar una de las sandwicherías más famosas de Tucumán, 'El Turco', ubicada a pocos kilómetros de nuestro hotel.</li>
          </ul>

          <p><i>
            En Hotel Viajero, fusionamos la comodidad y la aventura para ofrecerte una experiencia única. ¡Esperamos tener el placer de recibirte en tu próximo viaje!
          </i>
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default Presentation