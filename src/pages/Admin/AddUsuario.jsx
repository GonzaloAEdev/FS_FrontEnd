import { useState } from "react";
import { useDispatch } from "react-redux";
import { api } from "../../config";
import { logout } from "../../utils/auth";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { addUsuario } from "../../redux/features/usuariosSlice";
import { Spinner } from "react-bootstrap";

const AddUsuario = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol: 'propietario',
        plan: 'plus',
        metodoPago: '',
        fechaPago: ''
    });

    const handleOnChange = (evt) => {
        const { name, value } = evt.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setIsLoading(true);

        // Validaciones básicas
        if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
            toast.error("Por favor complete los campos obligatorios");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            toast.error("La contraseña debe tener al menos 8 caracteres");
            setIsLoading(false);
            return;
        }

        // Preparar datos para envío
        const newUsuario = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email,
            password: formData.password
        };

        // Solo agregar plan si es propietario
        if (formData.rol === 'propietario') {
            newUsuario.plan = formData.plan;
            if (formData.metodoPago) {
                newUsuario.metodoPago = formData.metodoPago;
            }
            if (formData.fechaPago) {
                newUsuario.fechaPago = formData.fechaPago;
            }
        }
        
        let path = api + '/signup';
        if (formData.rol === "admin") path = api + '/usuarios/admin';
        
        try {
            const res = await fetch(path, {
                method: 'POST',
                body: JSON.stringify(newUsuario),
                headers: {
                    "authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.status === 401) {
                logout(navigate);
                return;
            }
            if(res.status === 409) throw new Error('El email ya está en uso');
            if (!res.ok) throw new Error('Error en la creación del usuario');

            const data = await res.json();
            dispatch(addUsuario(data));
            toast.success("Usuario creado exitosamente");
            setFormData({
                nombre: '',
                apellido: '',
                email: '',
                password: '',
                rol: 'propietario',
                plan: 'plus',
                metodoPago: '',
                fechaPago: ''
            });
        } catch (e) {
            console.error('Error:', e.message);
            toast.error("No se pudo crear el usuario. \n " + e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-4">
            <div className="card shadow-sm" style={{ borderRadius: '10px' }}>
                <div className="card-body px-4 py-4">
                    <h3 className="card-title text-center mb-4" style={{ fontWeight: 600, fontSize: '1.25rem' }}>
                        <i className="bi bi-person-plus-fill me-2"></i>
                        Crear nuevo usuario
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            {/* Nombre */}
                            <div className="col-md-6">
                                <label htmlFor="nombre" className="form-label">
                                    Nombre <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Ingrese el nombre"
                                    style={{ padding: '12px' }}
                                    onChange={handleOnChange}
                                    value={formData.nombre}
                                    required
                                    minLength={3}
                                />
                            </div>

                            {/* Apellido */}
                            <div className="col-md-6">
                                <label htmlFor="apellido" className="form-label">
                                    Apellido <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="apellido"
                                    name="apellido"
                                    placeholder="Ingrese el apellido"
                                    style={{ padding: '12px' }}
                                    onChange={handleOnChange}
                                    value={formData.apellido}
                                    required
                                    minLength={3}
                                />
                            </div>

                            {/* Email */}
                            <div className="col-md-6">
                                <label htmlFor="email" className="form-label">
                                    Email <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    placeholder="correo@ejemplo.com"
                                    style={{ padding: '12px' }}
                                    onChange={handleOnChange}
                                    value={formData.email}
                                    required
                                />
                            </div>

                            {/* Contraseña */}
                            <div className="col-md-6">
                                <label htmlFor="password" className="form-label">
                                    Contraseña <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="Mínimo 8 caracteres"
                                    style={{ padding: '12px' }}
                                    onChange={handleOnChange}
                                    value={formData.password}
                                    required
                                    minLength={8}
                                />
                            </div>

                            {/* Rol */}
                            <div className="col-md-6">
                                <label htmlFor="rol" className="form-label">
                                    Rol <span className="text-danger">*</span>
                                </label>
                                <select
                                    className="form-select"
                                    id="rol"
                                    name="rol"
                                    style={{ padding: '12px' }}
                                    onChange={handleOnChange}
                                    value={formData.rol}
                                    required
                                >
                                    <option value="propietario">Propietario</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Plan - Solo visible si es propietario */}
                            {formData.rol === 'propietario' && (
                                <div className="col-md-6">
                                    <label htmlFor="plan" className="form-label">
                                        Plan <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        id="plan"
                                        name="plan"
                                        style={{ padding: '12px' }}
                                        onChange={handleOnChange}
                                        value={formData.plan}
                                        required
                                    >
                                        <option value="plus">Plus</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                </div>
                            )}

                            {/* Método de Pago - Solo visible si es propietario */}
                            {formData.rol === 'propietario' && (
                                <div className="col-md-6">
                                    <label htmlFor="metodoPago" className="form-label">
                                        Método de Pago
                                    </label>
                                    <select
                                        className="form-select"
                                        id="metodoPago"
                                        name="metodoPago"
                                        style={{ padding: '12px' }}
                                        onChange={handleOnChange}
                                        value={formData.metodoPago}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value="debito">Débito</option>
                                        <option value="credito">Crédito</option>
                                    </select>
                                </div>
                            )}

                            {/* Fecha de Pago - Solo visible si es propietario */}
                            {formData.rol === 'propietario' && (
                                <div className="col-md-6">
                                    <label htmlFor="fechaPago" className="form-label">
                                        Fecha de Pago
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaPago"
                                        name="fechaPago"
                                        style={{ padding: '12px' }}
                                        onChange={handleOnChange}
                                        value={formData.fechaPago}
                                    />
                                </div>
                            )}

                            {/* Botón de submit */}
                            <div className="col-12 mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    style={{
                                        padding: '12px',
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        backgroundColor: '#2196F3',
                                        border: 'none'
                                    }}
                                >
                                    {
                                        isLoading ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creando...</> : <><i className="bi bi-person-plus-fill me-2"></i> Crear usuario</>
                                    }                                    
                                    
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUsuario;
