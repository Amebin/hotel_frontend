import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useJwt } from 'react-jwt';
import './menu.css'

const Menu = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('authToken'))
  const userToken = user && user.token ? user.token : null;
  const { decodedToken } = useJwt(userToken || '');
  const userRole = decodedToken ? decodedToken.role : null;
  const userName = decodedToken ? decodedToken.name : null;

  const logOut = () => {
    localStorage.removeItem('authToken');
    navigate('/', { replace: true });
  };

  const logIn = () => {
    navigate('/login', { replace: false });
  };

  return (
    <Navbar  variant="dark" expand="lg" style={{ zIndex: 40000 }}>
      <Container id='menuContainer'>
        <Link className="navbar-brand" to="/">
          <img className="img-home" alt="Portada Hotel" />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" id="burguerButton"/>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" id="menu">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} >Inicio</NavLink>
            <NavLink to="/rooms" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} >Habitaciones</NavLink>
            {userRole === 'admin' &&
              <NavLink to="/userList" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} >Lista Usuarios</NavLink>
            }
            {userRole === 'admin' &&
              <NavLink to="/roomList" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} >Lista Habitaciones</NavLink>
            }
            {userRole === 'admin' &&
              <NavLink to="/createroom" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} >Crear Habitaciones</NavLink>
            }
            {userRole === 'user' && (
              <NavLink to="/userreservations" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} >Reservas</NavLink>
            )}
            {userRole === 'admin' && (
              <NavLink to="/allreservations" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} >Todas las Reservas</NavLink>
            )}

          </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse className=" justify-content-end">

          <Nav>
            {!user && (
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-item nav-link active' : 'nav-item nav-link'} >
                Registrar
              </NavLink>
            )}

            {user ?
              <Button className="logButton" onClick={logOut}>{userName} ({userRole})&nbsp;<i className="fa fa-sign-out me-1"></i></Button>
              :
              <Button className="logButton" onClick={logIn}><i className="fa fa-user"></i> Ingresar</Button>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Menu