import { Container, Row, Col } from 'react-bootstrap'
import error404 from '../img/error.gif'
import './error404.css'

const Error404 = () => {
  return (
    <>
      <Container id='error404'>
        <Row>
          <Col className='text-center' sm={12} xl={{ span: 4, offset: 1 }}>
            <Row>
              <h1>Error 404</h1>
              <h3>No se encuentra el contenido solicitado</h3>
            </Row>
          </Col>
          
          <Col sm={{ span: 10, offset: 1 }}  xl={{ span: 4, offset: 1 }}>
            <img id="giferror" src={error404} alt="Error 404" className="w-100"/>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Error404;
