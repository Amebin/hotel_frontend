import { Container, Row, Col, Card } from 'react-bootstrap'

const Home = () => {
  return (
    <>
      <Container className="container-fluid container-home">
        <Row>
          <Col xs={12} sm={6} className="col-home">
            <Row className="p-3">
              <h1>¿Te gustaria alojarte con nosotros?</h1>
              <h3>Prueba todos nuestros servicios </h3>
            </Row>
          </Col>

          <Col xs={12} sm={6} className="col-home">
            <Row className="card p-3" style={{width: '100%'}}>
              <img className="img-home"  alt="Portada Giftcards" />
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home
