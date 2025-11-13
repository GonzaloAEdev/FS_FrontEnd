import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../config";
import { isAdmin, logout } from "../../utils/auth";
import { setCategorias } from "../../redux/features/categoriasSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import RowCategoria from "./RowCategoria";
import AddCategorias from "./AddCategorias";
import { Spinner } from "react-bootstrap";


const ListCategorias = () => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
            toast.error('No se pudieron cargar las categorías')
        }
    }
    useEffect(() => {
        isAdmin(navigate);
        setIsLoading(true);
        fetchCategorias().finally(() => setIsLoading(false));
    }, []);

    const categorias = useSelector(state => state.categorias.categorias);

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
            <div className="row mb-2">
                <div className="col-12">
                    <h2 className="mb-4 text-primary fw-bold">
                        <i className="bi bi-tag-fill me-2"></i>
                        Administración de Categorías
                    </h2>
                    <div className="mb-2">
                        <AddCategorias />
                    </div>
                </div>
            </div>

            <div className="row w-100">
                <div className="col-12">
                    <div className="card shadow-lg border-0" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '15px'
                    }}>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead style={{
                                        backgroundColor: '#f8f9fa',
                                        borderBottom: '2px solid #dee2e6'
                                    }}>
                                        <tr>
                                            <th className="py-3 px-4 fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                                                Nombre de Categoría
                                            </th>
                                            <th className="py-3 px-4 text-end fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem', width: '150px' }}>
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categorias.length > 0 ? (
                                            categorias.map(categoria => (
                                                <RowCategoria key={categoria._id} id={categoria._id} nombreCategoria={categoria.nombre} />
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="text-center py-5 text-muted">
                                                    <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                                                    <p className="mb-0">No hay categorías registradas</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ListCategorias;