import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { api } from "../../config";
import { isAdmin, logout } from "../../utils/auth";
import { setUsuarios, setAreUsuariosLoading } from '../../redux/features/usuariosSlice';
import { toast } from 'react-toastify';
import UsuarioRow from './RowUsuario';
import AddUsuario from './AddUsuario';

const ListUsuarios = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [filterText, setFilterText] = useState('');

    const fetchUsuarios = async () => {
        try {
            const res = await fetch(`${api}/usuarios`, {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 401) {
                logout(navigate);
                return;
            }

            if (!res.ok) {
                throw new Error('Error al obtener los usuarios');
            }

            const data = await res.json();
            dispatch(setUsuarios(data));
            dispatch(setAreUsuariosLoading(true));
        } catch (e) {
            console.error('Error:', e.message);
            toast.error('No se pudieron cargar los usuarios');
        }
    };

    useEffect(() => {
        isAdmin(navigate);
        setIsLoading(true);
        fetchUsuarios().finally(() => setIsLoading(false));
    }, []);

    const usuarios = useSelector((state) => state.usuarios.usuarios);
    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.nombre?.toLowerCase().includes(filterText.toLowerCase()) ||
        usuario.apellido?.toLowerCase().includes(filterText.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(filterText.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <h2 className="mb-3 text-primary fw-bold">
                <i className="bi bi-people-fill me-2"></i>
                Administración de Usuarios
            </h2>
            <div className="row mb-4 w-100 ">
                <div className="col-12 mb-4">
                    <AddUsuario />
                </div>

                <div className="row w-100">
                    <div className="mb-4">
                        <div className="input-group" style={{ maxWidth: '500px' }}>
                            <span className="input-group-text bg-white border-end-0">
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Buscar por nombre, apellido o email..."
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                                style={{
                                    boxShadow: 'none',
                                    borderLeft: 'none'
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card shadow-lg border-0" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '15px'
                    }}>
                        <div className="card-body p-0">
                            {filteredUsuarios.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-person-x fs-1 d-block mb-3"></i>
                                    <p className="mb-0">No se encontraron usuarios</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead style={{
                                            backgroundColor: '#f8f9fa',
                                            borderBottom: '2px solid #dee2e6'
                                        }}>
                                            <tr>
                                                <th className="py-3 px-4 fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                                                    Nombre
                                                </th>
                                                <th className="py-3 px-4 fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                                                    Apellido
                                                </th>
                                                <th className="py-3 px-4 fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                                                    Email
                                                </th>
                                                <th className="py-3 px-4 fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                                                    Contraseña
                                                </th>
                                                <th className="py-3 px-4 fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                                                    Rol
                                                </th>
                                                <th className="py-3 px-4 fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                                                    Plan
                                                </th>
                                                <th className="py-3 px-4 fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                                                    Método Pago
                                                </th>
                                                <th className="py-3 px-4 fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                                                    Fecha Pago
                                                </th>
                                                <th className="py-3 px-4 text-center fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem', width: '150px' }}>
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsuarios.map(usuario => (
                                                <UsuarioRow
                                                    key={usuario._id || usuario.id}
                                                    usuario={usuario}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListUsuarios;