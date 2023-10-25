import { Container, Row, Col } from 'react-bootstrap'
import { Link, } from 'react-router-dom'
import './footer.css'
const Footer = () => {
  return (

    <Container className="text-center" id="footerContainer">
      <footer className="page-footer font-small pt-4">
      <hr></hr>
      <Row>
        <Col  md={6} lg={3} className='colFooter'>
          <Link className="navbar-brand" to="/">Inicio</Link>
        </Col>
        <Col  md={6} lg={3} className='colFooter'>
        <Link className="navbar-brand" to="/galleryimg">Galeria de imagenes</Link>
          
        </Col>
        <Col  md={6} lg={3} className='colFooter'>
        <Link className="navbar-brand" to="/aboutUs">Sobre nosotros</Link>
          
        </Col>
        <Col  md={6} lg={3} className='colFooter'>
        <Link className="navbar-brand" to="/contactUs">Contactanos</Link>
        </Col>
      </Row>
      <Row id='rowFooter'>
        <p className='footer-copyright '>© 2020 Copyright: Hotel Viajero</p>
      </Row>

    </footer> 
    </Container>
    

  );
};

export default Footer
