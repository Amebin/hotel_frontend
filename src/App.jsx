import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
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
import UserReservations from './pages/Reservations.jsx'
import AllReservations from './components/admin/ReservedList.jsx'


function App() {
  const loading = globalState((state) => state.loading)

  return (
    <Router>
      {loading && <Spinner className="loading-box" animation="grow" variant="warning" />}

      <Menu />

      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/roomlist" element={<RoomList />} />
        <Route path="/createroom" element={<CreateRoom />} />
        <Route path="/userreservations" element={<UserReservations />} />
        <Route path="/allreservations" element={<AllReservations />} />

        <Route path="*" element={<Error404 />} />
      </Routes>

      <Footer />
      
    </Router>
  );
}

export default App
