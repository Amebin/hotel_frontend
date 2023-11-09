import { Container, Row, Col, Table,  } from 'react-bootstrap'
import './contactUs.css'

const ContactUs = () => {
    return(
        <Container id='contactUs'  className='text-center'>
            <Row>
                <Col>
                    <h2>Contactanos a traves de los siguientes medios</h2>
                    <p>Proximamente sumaremos redes sociales</p>
                </Col>
            </Row>

            <Row>
            <Col xxl={{ span: 6, offset: 3}}>
            <Table striped bordered hover>
                    <tbody>
                        <tr>
                            <td>Mail</td>
                            <td>hotel@viajero.com</td>
                        </tr>

                        <tr>
                            <td>Telefono</td>
                            <td>3865-489-489</td>
                        </tr>

                        <tr>
                            <td>Domicilio</td>
                            <td> Ruta 9, kilómetro 5 1/2</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            </Row>
        </Container>
    )
}

export default ContactUs