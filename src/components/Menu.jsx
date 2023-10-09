import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useJwt } from 'react-jwt';
import giftcard from '../img/giftcard.png'


const Menu = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('authToken'))
  const userToken = user && user.token ? user.token : null;
  const { decodedToken, isExpired } = useJwt(userToken || '');
  const userRole = decodedToken ? decodedToken.role : null;

  const logOut = () => {
    localStorage.removeItem('authToken');
    navigate('/', { replace: true });
  };

  const logIn = () => {
    navigate('/login', { replace: false });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ zIndex: 40000 }}>
      <Container>
        <Link className="navbar-brand" to="/">
          <img className="img-home" alt="Portada Giftcards" />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" id="menu">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} style={{ textAlign: 'center' }}>Inicio</NavLink>
            <NavLink to="/rooms" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} style={{ textAlign: 'center' }}>Habitaciones</NavLink>
            {userRole === 'admin' &&
            <NavLink to="/userList" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} style={{ textAlign: 'center' }}>Lista Usuarios</NavLink>
            }
            {userRole === 'admin' &&
            <NavLink to="/roomList" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} style={{ textAlign: 'center' }}>Lista Habitaciones</NavLink>
            }
            {userRole === 'admin' &&
            <NavLink to="/createRoom" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} style={{ textAlign: 'center' }}>Crear Habitaciones</NavLink>
            }


          </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse className=" justify-content-end">

          <Nav>
            {!user && (
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} style={{ textAlign: 'center' }}>
                Registrar
              </NavLink>
            )}

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