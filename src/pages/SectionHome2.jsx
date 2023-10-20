import { Container, Row, Col, Accordion } from 'react-bootstrap'
import portadaPhone from '../img/portada_phone.jpg'
import portadaMedium from '../img/portada_medium.jpg'
import portadaHD from '../img/portada_HD.jpg'
import '../pages/sectionHome.css'


const Galery = () => {
  return (
    <>
      <Container className="container-fluid" id='section_2'>
        <Row>
          <Col sm={{ order: 2 }}>
            <Row >
              <picture>
                <source
                  media="(min-width: 768px)"
                  srcSet={portadaHD}
                />
                <source
                  media="(min-width: 348px)"
                  srcSet={portadaMedium}
                />
                <img
                  src={portadaPhone}
                  alt="portada hotel pantalla pequeña"
                />
              </picture>
            </Row>
          </Col>

          <Col sm={{ order: 1 }}>
            <Row className="p-3">
              <h2>¿Te gustaria alojarte con nosotros?</h2>
              <h3>A continuacion te presentamos todos nuestros servicios </h3>
            </Row>

            <Row id='servicesRow'>
              <Row>
                <Accordion flush>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Servicios Prestados en Cada Habitación:</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>Conexión Wi-Fi de alta velocidad</li>
                        <li>Televisión por cable con canales premium</li>
                        <li>Aire acondicionado y calefacción individual</li>
                        <li>Baño privado con artículos de tocador de calidad</li>
                        <li>Servicio de habitaciones las 24 horas</li>
                        <li>Mini bar con una selección de bebidas y aperitivos</li>
                        <li>Caja fuerte electrónica</li>
                        <li>Estación de trabajo con escritorio y silla ergonómica
                        </li>
                        <li>Teléfono con llamadas locales gratuitas
                        </li>
                        <li>Servicio de limpieza diario
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Servicios en el Bar para Viajeros:</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>Bar completamente surtido con una variedad de bebidas</li>
                        <li>Carta de vinos con selección de vinos locales</li>
                        <li>Menú de cócteles exclusivos
                        </li>
                        <li>Ambiente relajado y elegante
                        </li>
                        <li>Zona de estar cómoda y acogedora
                        </li>
                        <li>Entretenimiento nocturno, como música en vivo en ciertas noches
                        </li>
                        <li>Servicio de aperitivos y platos ligeros
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>Experiencias Únicas:</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>Conexión Wi-Fi en todas las áreas del hotel</li>
                        <li>Recepción abierta las 24 horas con personal multilingüe</li>
                        <li>Bienvenidos los huéspedes con mascotas con servicios</li>
                        <li>Contamos con un pizzarron para anunciar y organizar salidar a rutear</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Row>

              <Row>
                <h2>Tambien contamos con paquetes de servicio Premium</h2>
                <Accordion flush>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Servicios Premium</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>Centro de negocios con servicios de impresión y escaneo</li>
                        <li>Gimnasio bien equipado y centro de fitness</li>
                        <li>Spa y servicios de masajes</li>
                        <li>Servicio de conserjería para asistencia con reservas y recomendaciones locales</li>
                        <li>Salas de reuniones y eventos con tecnología audiovisual de última generación</li>
                        <li>Salon de eventos para festejar tu boda o cumpleaños</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Nombres de nuestros Paquetes de Servicios</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>Servicio de Lujo: Experiencia exclusiva con servicios premium y comodidades de alta gama.</li>
                        <li>Servicio Familiar: Atención especial para familias con áreas de juego para niños y servicios adaptados.</li>
                        <li>Servicio de Negocios: Instalaciones y servicios diseñados para viajeros de negocios, como salas de reuniones y servicios de secretaría.</li>
                        <li>Servicio Wellness: Enfoque en el bienestar con spa, gimnasio y opciones saludables en la alimentación.</li>
                        <li>Servicio Pet-Friendly: Bienvenidos los huéspedes con mascotas con servicios y comodidades especiales para ellos</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>

                </Accordion>
              </Row>
            </Row>
          </Col>
        </Row>


      </Container>
    </>
  )
}

export default Galery