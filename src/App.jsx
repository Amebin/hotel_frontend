import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Cart from "./pages/Cart.jsx"
import Login from "./pages/Login.jsx"
import Menu from './components/Menu.jsx'
import Error404 from './pages/Error404.jsx'
import Rooms from './pages/Rooms.jsx'
import { Spinner } from 'react-bootstrap'
import globalState from './state.js'

import Footer from './pages/Footer.jsx'
import Register from './pages/Register.jsx'
import UserList from './components/admin/UserList.jsx'
import RoomList from './components/admin/RoomList.jsx'
import CreateRoom from './components/admin/CreateRoom.jsx'

function App() {
  // Recuperamos la variable global loading, para mostrar o no el spinner
  const loading = globalState((state) => state.loading)

  return (
    <Router>
      {loading && <Spinner className="loading-box" animation="grow" variant="warning" />}

      <Menu />
      
      {/*
      Nuestro paquete de rutas solo contiene un Home, un Login y el listado de Giftcars.
      Por supuesto podemos agregar otras según sea necesario. El route de 404 siempre queda
      al final para capturar cualquier ruta incorrecta que se introduzca manualmente en la URL.
      */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/roomlist" element={<RoomList />} />
        <Route path="/createRoom" element={<CreateRoom />} />

        <Route path="*" element={<Error404 />} />
      </Routes>

      <Footer />
      
    </Router>
  );
}

export default App
