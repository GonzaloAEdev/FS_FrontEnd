import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { api } from "../../config";
import { isAdmin, logout } from "../../utils/auth";
import { setCitas, setAreCitasLoading } from '../../redux/features/citasSlice';
import { toast } from 'react-toastify';
import ListCitas from './ListCitas';

const CitasAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const citas = useSelector((state) => state.citas.citas);

        const fetchCitas= async () => {
            try {
                const res = await fetch(`${api}/citas`, {
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
                dispatch(setCitas(data))
            } catch (e) {
                console.error('Error:', e.message)
                toast.error('No se pudieron cargar las citas')
            }
        }
    useEffect(() => {
        isAdmin(navigate);
        dispatch(setAreCitasLoading(true));
        fetchCitas().finally(() => dispatch(setAreCitasLoading(false)));
    }, []);

    const loading = useSelector(state => state.citas.areCitasLoading);

    if (loading) {
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
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="mb-3 text-primary fw-bold">
                        <i className="bi bi-calendar-check me-2"></i>
                        Administración de Citas
                    </h2>
                </div>
            </div>

            <div className="row w-100">
                <div className="col-12">
                    <div className="card shadow-lg border-0" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '15px'
                    }}>
                        <div className="card-body p-0">
                            {citas.length > 0 ? (
                                <ListCitas />
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-calendar-x fs-1 d-block mb-3"></i>
                                    <p className="mb-0">No hay citas registradas</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CitasAdmin;