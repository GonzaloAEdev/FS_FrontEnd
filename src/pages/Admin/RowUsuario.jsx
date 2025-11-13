import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { api } from "../../config";
import { logout } from "../../utils/auth";
import { deleteUsuario, updateUsuario } from '../../redux/features/usuariosSlice';
import { toast } from 'react-toastify';

const RowUsuario = ({ usuario }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        email: usuario.email || '',
        password: '',
        rol: usuario.rol || 'Propietario',
        plan: usuario.plan || 'Plus'
    });

    const handleInputChange = (e) => {
        setFormData(valoresActuales => {
            return {
                ...valoresActuales,
            [e.target.name]: e.target.value
        };
        });
    };

    const handleModificar = async () => {
        setIsSaving(true);

        const bodyData = { ...formData };
        if (!bodyData.password || bodyData.password.trim() === '') {
            delete bodyData.password;
        }

        try {
            const res = await fetch(`${api}/usuarios/${usuario.id}`, {
                method: 'PUT',
                body: JSON.stringify(bodyData),
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
                throw new Error('Error al actualizar el usuario');
            }

            const data = await res.json();
            dispatch(updateUsuario({ id: usuario.id, updatedUsuario: data }));
            toast.success('Usuario actualizado exitosamente');
            setFormData(prev => ({ ...prev, password: '' }));
        } catch (e) {
            console.error('Error:', e.message);
            toast.error('No se pudo actualizar el usuario');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteUsuario = async (usuarioId) => {
        if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;

        try {
            const res = await fetch(`${api}/usuarios/${usuarioId}`, {
                method: 'DELETE',
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
                throw new Error('Error al eliminar el usuario');
            }

            dispatch(deleteUsuario(usuarioId));
            toast.success('Usuario eliminado exitosamente');
        } catch (e) {
            console.error('Error:', e.message);
            toast.error('No se pudo eliminar el usuario');
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('es-ES');
    };

    return (
        <tr>
            <td className="py-3 px-4 align-middle">
                <input
                    type="text"
                    className="form-control form-control-sm"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    style={{ minWidth: '120px' }}
                />
            </td>
            <td className="py-3 px-4 align-middle">
                <input
                    type="text"
                    className="form-control form-control-sm"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    style={{ minWidth: '120px' }}
                />
            </td>
            <td className="py-3 px-4 align-middle">
                <input
                    type="email"
                    className="form-control form-control-sm"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    style={{ minWidth: '180px' }}
                />
            </td>
            <td className="py-3 px-4 align-middle">
                <input
                    type="password"
                    className="form-control form-control-sm"
                    name="password"
                    placeholder="Nueva contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    style={{ minWidth: '140px' }}
                />
            </td>
            <td className="py-3 px-4 align-middle">
                <select
                    className="form-select form-select-sm"
                    name="rol"
                    value={formData.rol}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    style={{ minWidth: '120px' }}
                >
                    <option value="Admin">Admin</option>
                    <option value="Propietario">Propietario</option>
                </select>
            </td>
            <td className="py-3 px-4 align-middle">
                <select
                    className="form-select form-select-sm"
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    style={{ minWidth: '110px' }}
                >
                    <option value="Plus">Plus</option>
                    <option value="Premium">Premium</option>
                </select>
            </td>
            <td className="py-3 px-4 align-middle">
                <span className="badge bg-secondary px-2 py-1" style={{ fontSize: '0.8rem' }}>
                    {usuario.metodoPago || 'N/A'}
                </span>
            </td>
            <td className="py-3 px-4 align-middle">
                <small className="text-muted">
                    <i className="bi bi-calendar3 me-1"></i>
                    {formatDate(usuario.fechaPago)}
                </small>
            </td>
            <td className="py-3 px-4 align-middle text-center">
                <div className="d-flex gap-2 justify-content-center">
                    <button
                        className="btn btn-warning btn-sm"
                        onClick={handleModificar}
                        disabled={isSaving}
                        title="Modificar"
                        style={{ width: '38px', height: '38px' }}
                    >
                        {isSaving ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : (
                            <i className="bi bi-pencil-square"></i>
                        )}
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUsuario(usuario.id)}
                        disabled={isSaving}
                        title="Eliminar"
                        style={{ width: '38px', height: '38px' }}
                    >
                        <i className="bi bi-trash-fill"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default RowUsuario;