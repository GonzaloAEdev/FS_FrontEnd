import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import './Dashboard.css'
import { logout } from "../utils/auth";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../config";
import { setMascotas } from "../redux/features/mascotasSlice";

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [cargando, setCargando] = useState(false);
    const [rol, setRol] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
            return
        }

        const usuario = JSON.parse(localStorage.getItem('usuario'));
        setRol(usuario.rol);

        const fetchMascotas = async () => {
            setCargando(true)
            try {
                const res = await fetch(`${api}/mascotas/mis-mascotas`, {
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
                    throw new Error('Error al cargar mascotas')
                }

                const data = await res.json()
                dispatch(setMascotas(data))
            } catch (e) {
                console.error('Error:', e.message)
            } finally {
                setCargando(false)
            }
        }

        fetchMascotas()
    }, [dispatch, navigate])

    const mascotas = useSelector((state) => state.mascotas.mascotas || [])

    return (
        <>
            <nav>
                <h3 className="text-light text-center border-bottom py-4"><i className="bi bi-heart-pulse-fill"></i> Veterinaria</h3>

                <ul className="nav flex-column gap-2">
                    {rol === 'admin' ? (
                        <>
                            <li>
                                <NavLink className='nav-link text-light py-3 px-4 d-flex align-items-center gap-2' to="usuariosAdmin">
                                    <i className="bi bi-gear"></i> Usuarios
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className='nav-link text-light py-3 px-4 d-flex align-items-center gap-2' to="citasAdmin">
                                    <i className="bi bi-people"></i> Citas
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className='nav-link text-light py-3 px-4 d-flex align-items-center gap-2' to="categoriasAdmin">
                                    <i className="bi bi-calendar-date"></i> Categorias
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink className='nav-link text-light py-3 px-4 d-flex align-items-center gap-2' to="citasAdmin">
                                    <i className="bi bi-house"></i> Inicio
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className='nav-link text-light py-3 px-4 d-flex align-items-center gap-2' to="citas">
                                    <i className="bi bi-calendar-date"></i> Citas
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className='nav-link text-light py-3 px-4 d-flex align-items-center gap-2' to="mascotas">
                                    <i className="bi bi-heart"></i> Mascotas
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className='nav-link text-light py-3 px-4 d-flex align-items-center gap-2' to="perfil">
                                    <i className="bi bi-person-circle"></i> Perfil
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>

                <ul className="nav flex-column border-top w-100" style={{ position: 'absolute', bottom: '0' }}>
                    <li >
                        <button className='nav-link text-light py-3 px-4 d-flex align-items-center gap-2 w-100' onClick={() => logout(navigate)}>
                            <i className="bi bi-box-arrow-right"></i> Cerrar sesión
                        </button>
                    </li>
                </ul>
            </nav>
            <main className="bg-light">
                <div className="container-fluid py-4 px-5">
                    <Outlet context={{ mascotas, cargando }} />
                </div>
            </main>
        </>
    )
}

export default Dashboard;