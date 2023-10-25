import { Container } from 'react-bootstrap';
import Presentation from './SectionHome1';
import Galery from './SectionHome2';
const Home = () => {
  return (
    <Container>
      <Presentation></Presentation>
      <Galery></Galery>
    </Container>
  );
};

export default Home
