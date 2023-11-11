import React, { useEffect, useState } from 'react';
import { Image , Container, Row, Col } from 'react-bootstrap';
import appConfig from '../config';
import { useNavigate } from 'react-router-dom';
import './gallery.css'

const gallery = () => {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [img, setImg] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchRooms = async () => {
            try {
                const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.GET_ROOM_ENDPOINT}`);
                const dataJson = await response.json();

                if (response.ok) {
                    setRooms(dataJson.data);
                    processImages(dataJson.data);
                }
                setLoading(false);
            }
            catch (error) {
                alert('Hubo un problema, intenta de nuevo mas tarde');
            }
        }
        fetchRooms();

    }, []);

    const processImages = (roomsData) => {
        const imagesArray = [];
        roomsData.forEach((room) => {
            if (room.images && Array.isArray(room.images)) {
                imagesArray.push(...room.images);
            }
        });
        setImg(imagesArray);
    };

    return (
        <Container id='gallery'>
            <Row>
                <Col>
                    <h2>Disfruta de las fotografias de nuestras habitaciones</h2>
                </Col>
            </Row>
            {loading && (
                <div className="spinner">
                    Cargando habitaciones...
                </div>
            )}

            <Row className='mt-3'>
                {img.map((image, index) => (
                    <Col key={index} sm={6} md={4} lg={3} className='mb-3 containerImg'>
                        <Row>
                            <Image className='images' srcSet={image} alt={`Image ${index + 1}`} rounded/>
                        </Row>
                    </Col>
                ))}
            </Row>

        </Container>
    )
}

export default gallery