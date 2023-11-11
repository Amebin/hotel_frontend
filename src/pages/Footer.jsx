import { Container, Row, Col } from 'react-bootstrap'
import { Link, } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';


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
        <p className='footer-copyright '>© 2023 Copyright: Hotel Viajero</p>
        <div className='footer-social-icons'>
        
        <a href="https://www.linkedin.com/in/franco-gonzalez-gimenez/" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faLinkedin} size="1x" className='me-1 footerButtons'/>
        </a>
        <a href="https://github.com/Amebin" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faGithub} size="1x" className='me-1 footerButtons'/>
        </a>
    </div>
      </Row>

    </footer> 
    </Container>
    

  );
};

export default Footer
