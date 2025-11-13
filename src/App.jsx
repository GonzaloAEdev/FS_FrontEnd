import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Forbidden from './pages/Forbidden'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { BrowserRouter, Routes, Route } from 'react-router'
import Inicio from './components/dashboard/Inicio'
import Cita from './components/dashboard/Cita'
import Mascota from './components/dashboard/Mascota'
import Perfil from './components/dashboard/Perfil'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Registro />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path='*' element={<NotFound />} />

          <Route path='/' element={<Dashboard />}>
            <Route path="inicio" element={<Inicio />} />
            <Route path="citas" element={<Cita />} />
            <Route path="mascotas" element={<Mascota />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App