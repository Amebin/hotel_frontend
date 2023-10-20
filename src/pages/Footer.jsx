import { Container, Row, Col, Card } from 'react-bootstrap'

const Footer = () => {
    return (
        <footer className="bg-dark text-white">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Información de contacto</h5>
            <p>Tu dirección de contacto</p>
            <p>Tu número de teléfono</p>
            <p>Tu dirección de correo electrónico</p>
          </Col>
          <Col md={6}>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/nosotros">Nosotros</a></li>
              <li><a href="/productos">Productos</a></li>
              <li><a href="/contacto">Contacto</a></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer
    
