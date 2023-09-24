import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import harmonie from '../img/harmonie.png' 

const Menu = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('cart_user')) || null;

  const logOut = () => {
    localStorage.clear('cart_user');
    localStorage.clear('cart_user_backup');
    navigate('/', { replace: true });
  };

  const logIn = () => {
    navigate('/login', { replace: false });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{zIndex: 40000}}>
      <Container>
      
      <Navbar.Brand href="#home">
            <img
              src ="/img/harmonie.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" id="menu">
            <NavLink to="/" className={({isActive}) => isActive ? 'nav-item nav-link active': 'nav-item nav-link'} style={{textAlign: 'center'}}>Inicio</NavLink>
            <NavLink to="/rooms" className={({isActive}) => isActive ? 'nav-item nav-link active': 'nav-item nav-link'} style={{textAlign: 'center'}}>Habitaciones</NavLink>
          </Nav>
        </Navbar.Collapse>
        
        <Navbar.Collapse className=" justify-content-end">

          <Nav>
            <NavLink to="/register" className={({isActive}) => isActive ? 'nav-item nav-link active': 'nav-item nav-link'} style={{textAlign: 'center'}}>Registrar</NavLink>
            {user ?
              <Button variant="warning" onClick={logOut}>{user.name} ({user.role})&nbsp;<i className="fa fa-sign-out me-1"></i></Button>
              :
              <Button variant="warning" onClick={logIn}><i className="fa fa-user"></i> Ingresar</Button>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Menu