import { Container, Row, Col, Image } from 'react-bootstrap'
import imgMe from '../img/aboutUs.jpg'
import './about.css'

const AboutUs = () => {
    return(
        <Container id='aboutUs'>
            <Row className="text-center" id='imgRow'>
                <Col sm={{ span: 10, offset: 1}} lg={{ span: 8, offset: 2}} xxl={{ span: 5, offset: 1}}>
                <h1>Somos Hotel Viajero</h1>
                <p>El Hotel, inspirado en mis mas grandes sueños de motoviajero, fue construido por y para los que son como nosotros, amantes de las rutas y los viajes, estadias de una noche y en caso de una necesidad, la posibilidad de trabajar para poder conseguir hospedaje o comida...si nos habra pasado.</p>
                <p>Mi nombre es Franco Gimenez y soy el encargado de que pases una increible estadia junto a la familia que forma parte del Hotel.</p>
                </Col>

                <Col sm={{ span: 10, offset: 1}} lg={{ span: 8, offset: 2}} xxl={{ span: 5, offset: 1}}>
            <Image srcSet={ imgMe } alt='foto del dueño con su moto en un viaje' rounded/>
            </Col>
            </Row>
            
            
        </Container>
    )
}

export default AboutUs