import Input from "../../utils/Input"
import Select from "../../utils/Select"
import MostrarMascotas from "./MostrarMascotas"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useOutletContext } from "react-router"
import { useEffect, useState } from "react"
import { deleteMascota, setMascotas } from "../../../redux/features/mascotasSlice"
import { api } from "../../../config"
import { logout } from "../../../utils/auth"
import Alert from "../../utils/Alert"
import { toast } from "react-toastify"

const FiltrosMascota = props => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [nombre, setNombre] = useState('')
    const [categoria, setCategoria] = useState('0')
    const [eliminado, setEliminado] = useState(null);

    // useEffect(() => {
    //     const fetchMascotas = async () => {
    //         setprops.Cargando(true)
    //         try {
    //             const res = await fetch(`${api}/mascotas/mis-mascotas`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'authorization': `Bearer ${localStorage.getItem('token')}`
    //                 }
    //             })

    //             if (res.status === 401) {
    //                 logout(navigate)
    //                 return
    //             }

    //             if (!res.ok) {
    //                 throw new Error('Error al cargar mascotas')
    //             }

    //             const data = await res.json()
    //             dispatch(setMascotas(data))
    //         } catch (e) {
    //             console.error('Error:', e.message)
    //         } finally {
    //             setprops.Cargando(false)
    //         }
    //     }

    //     fetchMascotas()
    // }, [dispatch, navigate])

    
    const filtrarMascotas = props.mascotas.filter(mascota => (
        (mascota.nombre.toLowerCase().includes(nombre.toLowerCase())) && (mascota.categoria._id === categoria || categoria === '0')
    ))

    const mostrarMascotas = filtrarMascotas.length === 0 ? props.mascotas : filtrarMascotas

    const handleDelete = async (id, nombre) => {
        if (!window.confirm(`¿Estás seguro que querés dar de baja a ${nombre}? Esta acción no se puede deshacer`)) return;

        setEliminado(id);

        try {
            const res = await fetch(`${api}/mascotas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (res.status === 401) {
                logout(navigate);
                return;
            }

            if (!res.ok) {
                toast.error('Error al dar de baja a la mascota')
                throw new Error(await res.json().error || 'Error al dar de baja a la mascota');
            }

            dispatch(deleteMascota(id));
        } catch (e) {
            console.error(e)
        } finally {
            setEliminado(null);
        }
    }

    return (
        <>
            <form className="row align-items-end mb-3" onSubmit={(e) => e.preventDefault()}>
                <Input clases="col-md-5" id="nombre" label="Nombre" tipo="text" placeholder="Nombre" handleOnChange={(e) => setNombre(e.target.value)} />
                <Select clases="col-md-5" id="categoria" label="Categoría" placeholder="Todas las categorías" options={props.options} handleOnChange={(e) => setCategoria(e.target.value)} />

                <button type="submit" className="btn btn-primary col-md-2 mb-3" disabled={props.cargando}>
                    <i className="bi bi-search"></i> Buscar
                </button>
            </form>

            {props.cargando ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <MostrarMascotas options={props.options} mascotas={mostrarMascotas} handleDelete={handleDelete} eliminado={eliminado} />
            )}
        </>
    )
}

export default FiltrosMascota