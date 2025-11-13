import EditarPerfil from "./Perfil/EditarPerfil"
import EditarPassword from "./Perfil/EditarPassword"
import CambiarPlan from "./Perfil/CambiarPlan"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { api } from "../../config"
import { logout } from "../../utils/auth"
import { Spinner } from "react-bootstrap"

const Perfil = () => {
    const navigate = useNavigate()
    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const fetchPerfil = async () => {
            setCargando(true)
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
                setCargando(false)
            }
        }

        fetchPerfil()
    }, [navigate])

    if (cargando) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
            </div>
        )
    }

    return (
        <>
            <div className="row">
                <div className="col-md-6">
                    <EditarPerfil usuario={usuario} setUsuario={setUsuario} />
                </div>
                <div className="col-md-6">
                    <EditarPassword />
                </div>
            </div>
            <hr className="my-4" />
            <CambiarPlan usuario={usuario} setUsuario={setUsuario} />
        </>
    )
}

export default Perfil