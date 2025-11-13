import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router"
import { useSelector } from "react-redux"
import { api } from "../../config"
import { logout } from "../../utils/auth"
import { Spinner } from "react-bootstrap"
import EstadisticasGenerales from "./Inicio/EstadisticasGenerales"
import EstadisticasMascotas from "./Inicio/EstadisticasMascotas"
import EstadisticasCitas from "./Inicio/EstadisticasCitas"
import InformeDeUso from "./Inicio/InformeDeUso"

const Inicio = () => {
    const navigate = useNavigate()
    const { mascotas, cargando: cargandoMascotas } = useOutletContext()
    
    const [usuario, setUsuario] = useState(null)
    const [citas, setCitas] = useState([])
    const [cargandoUsuario, setCargandoUsuario] = useState(true)
    const [cargandoCitas, setCargandoCitas] = useState(true)

    const categorias = useSelector((state) => state.categorias.categorias || [])

    useEffect(() => {
        const fetchUsuario = async () => {
            setCargandoUsuario(true)
            try {
                const res = await fetch(`${api}/usuarios/perfil`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })

                if (res.status === 401) {
                    logout(navigate)
                    return
                }

                if (!res.ok) {
                    throw new Error('Error al cargar el perfil')
                }

                const data = await res.json()
                setUsuario(data)
            } catch (e) {
                console.error('Error:', e.message)
            } finally {
                setCargandoUsuario(false)
            }
        }

        const fetchCitas = async () => {
            setCargandoCitas(true)
            try {
                const res = await fetch(`${api}/citas/mis-citas`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })

                if (res.status === 401) {
                    logout(navigate)
                    return
                }

                if (!res.ok) {
                    throw new Error('Error al cargar citas')
                }

                const data = await res.json()
                setCitas(data)
            } catch (e) {
                console.error('Error:', e.message)
            } finally {
                setCargandoCitas(false)
            }
        }

        fetchUsuario()
        fetchCitas()
    }, [navigate])

    if (cargandoUsuario || cargandoMascotas || cargandoCitas) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Cargando estadísticas...</p>
            </div>
        )
    }

    return (
        <>
            <EstadisticasGenerales 
                mascotas={mascotas} 
                citas={citas} 
                categorias={categorias}
            />

            <div className="row mt-4">
                <div className="col-md-6 mb-4">
                    <InformeDeUso usuario={usuario} mascotas={mascotas} />
                </div>
                <div className="col-md-6 mb-4">
                    <EstadisticasMascotas mascotas={mascotas} categorias={categorias} />
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <EstadisticasCitas citas={citas} />
                </div>
            </div>
        </>
    )
}

export default Inicio