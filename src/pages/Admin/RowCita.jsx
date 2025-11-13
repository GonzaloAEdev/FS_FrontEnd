import { toast } from "react-toastify";
import { updateCita } from "../../redux/features/citasSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { api } from "../../config";
import { logout } from "../../utils/auth";

const RowCita = ({ cita }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [estado, setEstado] = useState('');
    const [usuario, setUsuario] = useState();

    useEffect(() => {
        getUsuarioPorId(cita.propietario);
    }, []);

    const getUsuarioPorId = async (usuarioId) => {
        try {
            const res = await fetch(`${api}/usuarios/${usuarioId}`, {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 401) {
                logout(navigate);
                return null;
            }

            if (!res.ok) {
                throw new Error('Error al obtener el usuario');
            }

            const data = await res.json();
            setUsuario(data);
        } catch (e) {
            console.error('Error:', e.message);
            toast.error('No se pudo obtener el usuario');
            return null;
        }
    };

    const handleCambiarEstado = async (citaId, nuevoEstado) => {
        setEstado(nuevoEstado);
        
        try {
            const res = await fetch(`${api}/citas/${citaId}`, {
                method: 'PUT',
                body: JSON.stringify({ estado: nuevoEstado }),
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
                throw new Error('Error al actualizar la cita');
            }

            const data = await res.json();
            dispatch(updateCita({ id: citaId, updatedCita: estado }));
            console.log(data);
            toast.success('Estado actualizado exitosamente');
        } catch (e) {
            console.error('Error:', e.message);
            toast.error('No se pudo actualizar el estado');
        }
    };

    const getBadgeColor = (estado) => {
        switch(estado) {
            case 'aceptada': return 'success';
            case 'pendiente': return 'warning';
            case 'cancelada': return 'danger';
            case 'rechazada': return 'dark';
            case 'finalizada': return 'info';
            default: return 'secondary';
        }
    };

    return (
        <tr>
            <td className="py-3 px-4 align-middle">
                <i className="bi bi-heart-fill text-danger me-2"></i>
                {cita.mascota?.nombre}
            </td>
            <td className="py-3 px-4 align-middle">
                <i className="bi bi-person-fill text-primary me-2"></i>
                {usuario?.nombre} {usuario?.apellido}
            </td>
            <td className="py-3 px-4 align-middle">
                <i className="bi bi-calendar3 me-2 text-muted"></i>
                {new Date(cita.fecha).toLocaleDateString()}
            </td>
            <td className="py-3 px-4 align-middle">
                <i className="bi bi-clock me-2 text-muted"></i>
                {cita.hora}
            </td>
            <td className="py-3 px-4 align-middle text-center">
                <span className={`badge bg-${getBadgeColor(cita.estado)} px-3 py-2`} style={{ fontSize: '0.85rem' }}>
                    {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                </span>
            </td>
            <td className="py-3 px-4 align-middle text-center">
                <select
                    className="form-select form-select-sm"
                    value={cita.estado}
                    onChange={(e) => handleCambiarEstado(cita._id, e.target.value)}
                    style={{ 
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    <option value="pendiente">Pendiente</option>
                    <option value="aceptada">Aceptada</option>
                    <option value="cancelada">Cancelada</option>
                    <option value="finalizada">Finalizada</option>
                    <option value="rechazada">Rechazada</option>

                </select>
            </td>
        </tr>
    );
}

export default RowCita;