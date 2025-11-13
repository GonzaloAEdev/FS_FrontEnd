import { useDispatch, useSelector } from "react-redux"
import CrearMascota from "./Mascota/CrearMascota"
import FiltrosMascota from "./Mascota/FiltrosMascotas"
import { useNavigate, useOutletContext } from "react-router"
import { useEffect, useState } from "react"
import { setCategorias } from "../../redux/features/categoriasSlice"
import { api } from "../../config"
import { logout } from "../../utils/auth"

const Mascota = () => {
    const { mascotas, cargando } = useOutletContext()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
    const fetchCategorias = async () => {
        try {
            const res = await fetch(`${api}/categorias`, {
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
                throw new Error('Error al cargar categorías')
            }

            const data = await res.json()
            dispatch(setCategorias(data))
        } catch (e) {
            console.error('Error:', e.message)
        }
    }

    fetchCategorias()
}, [dispatch, navigate])

    const categorias = useSelector((state) => state.categorias.categorias || [])
    const options = categorias.map((categoria) => ({
        value: categoria._id,
        texto: categoria.nombre
    }))

    return (
        <>
            <CrearMascota options={options} />
            <hr />
            <FiltrosMascota options={options} mascotas={mascotas} cargando={cargando} />
        </>
    )
}

export default Mascota