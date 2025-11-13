import Select from "../../utils/Select"
import MostrarCitas from "./MostrarCitas"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { deleteCita, setCitas } from "../../../redux/features/citasSlice"
import { api } from "../../../config"
import { logout } from "../../../utils/auth"
import Alert from "../../utils/Alert"
import { toast } from "react-toastify"

const estados = [
    { value: 'pendiente', texto: 'Pendiente' },
    { value: 'aceptada', texto: 'Aceptada' },
    { value: 'cancelada', texto: 'Cancelada' },
    { value: 'rechazada', texto: 'Rechazada' },
    { value: 'finalizada', texto: 'Finalizada' }
]

const periodos = [
    { value: 'semana', texto: 'Última semana' },
    { value: 'mes', texto: 'Último mes' },
    { value: 'todo', texto: 'Todas las citas' }
]

const FiltrosCitas = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [estado, setEstado] = useState('0')
    const [periodo, setPeriodo] = useState('0')
    const [cargando, setCargando] = useState(false)
    const [eliminado, setEliminado] = useState(null)

    useEffect(() => {
        const fetchCitas = async () => {
            setCargando(true)
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
                dispatch(setCitas(data))
            } catch (e) {
                console.error('Error:', e.message)
            } finally {
                setCargando(false)
            }
        }

        fetchCitas()
    }, [dispatch, navigate])

    const citas = useSelector((state) => state.citas.citas || [])

    const hoy = new Date()
    const semana = new Date()
    semana.setDate(hoy.getDate() - 7)
    const mes = new Date()
    mes.setDate(hoy.getDate() - 30)

    const filtrarCitas = citas.filter(cita => {
        const fechaCita = new Date(cita.fecha)
        const cumpleEstado = estado === '0' || cita.estado === estado

        let cumplePeriodo = true
        if (periodo === 'semana') {
            cumplePeriodo = fechaCita >= semana && fechaCita <= hoy
        } else if (periodo === 'mes') {
            cumplePeriodo = fechaCita >= mes && fechaCita <= hoy
        }

        return cumpleEstado && cumplePeriodo
    })

    const mostrarCitas = filtrarCitas.length === 0 ? citas : filtrarCitas

    const handleDelete = async (id, nombreMascota) => {
        if (!window.confirm(`¿Estás seguro que querés cancelar la cita de ${nombreMascota}? Esta acción no se puede deshacer`)) return

        setEliminado(id)

        try {
            const res = await fetch(`${api}/citas/cancelar/${id}`, {
                method: 'PATCH',
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
                toast.error('Error al cancelar la cita')
                throw new Error(await res.json().error || 'Error al cancelar la cita')
            }

                dispatch(deleteCita(id))
                toast.success('Cita cancelada exitosamente')
        } catch (e) {
            console.error(e)
        } finally {
            setEliminado(null)
        }
    }

    return (
        <>
            <form className="row align-items-end mb-3" onSubmit={(e) => e.preventDefault()}>
                <Select clases="col-md-5" id="estado" label="Estado" placeholder="Todos los estados" options={estados} handleOnChange={(e) => setEstado(e.target.value)} />
                <Select clases="col-md-5" id="periodo" label="Período" placeholder="Todos los períodos" options={periodos} handleOnChange={(e) => setPeriodo(e.target.value)} />

                <button type="submit" className="btn btn-primary col-md-2 mb-3" disabled={cargando}>
                    <i className="bi bi-search"></i> Buscar
                </button>
            </form>

            {cargando ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <MostrarCitas citas={mostrarCitas} handleDelete={handleDelete} eliminado={eliminado} />
            )}
        </>
    )
}

export default FiltrosCitas
// import Select from "../../utils/Select"
// import MostrarCitas from "./MostrarCitas"

// const FiltrosCitas = () => {
//     return (
//         <>
//             <form className="row align-items-end mb-3">
//                 <Select clases="col-md-5" id="estado" label="Estado" placeholder="Selecciona un estado" options={estados} />
//                 <Select clases="col-md-5" id="periodo" label="Período" placeholder="Selecciona un período" options={periodos} />

//                 <button type="submit" className="btn btn-primary col-md-2 mb-3">
//                     <i className="bi bi-search"></i> Buscar
//                 </button>
//             </form>

//             <MostrarCitas />
//         </>
//     )
// }

// export default FiltrosCitas