import { useState } from "react";
import { useDispatch } from "react-redux";
import { api } from "../../config";
import { logout } from "../../utils/auth";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { addCategoria } from "../../redux/features/categoriasSlice";
import { Spinner } from "react-bootstrap";


const AddCategorias = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [categoria, setCategoria] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleOnCLick = async () => {
        setIsLoading(true);
        const newCategoria = {
            nombre: categoria
        };

        try {
            const res = await fetch(api + '/categorias', {
                method: 'POST',
                body: JSON.stringify(newCategoria),
                headers: {
                    "authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.status === 401) {
                logout(navigate);
                return;
            }

            if (!res.ok) {
                throw new Error('Error en la creación de la categoría');
            }

            const data = await res.json();
            dispatch(addCategoria(data));
            setCategoria('');
            toast.success('Categoría creada exitosamente');
        } catch (e) {
            console.error('Error:', e.message);
            toast.error("No se pudo crear la categoría. \n" + e.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleOnChange = (evt) => {
        setCategoria(evt.target.value);
    }

    return (
        <div className="mb-3">
            <div className="card shadow-sm" style={{ borderRadius: '10px', maxWidth: '600px' }}>
                <div className="card-body px-4 py-3">
                    <h3 className="card-title text-center mb-3" style={{ fontWeight: 600, fontSize: '1.25rem' }}>
                        Crear nueva categoría
                    </h3>
                    <div>
                        <div className="row g-4">
                            <div className="col-8">
                                <label htmlFor="nombreCategoria" className="form-label">
                                    Nombre de la categoría <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombreCategoria"
                                    placeholder="Ingrese el nombre de la categoría"
                                    style={{ padding: '12px' }}
                                    onChange={handleOnChange}
                                    value={categoria}
                                />
                            </div>
                            <div className="col-4 d-flex align-items-end">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    style={{
                                        padding: '12px',
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        backgroundColor: '#2196F3',
                                        border: 'none'
                                    }}
                                    onClick={handleOnCLick}
                                >
                                    {
                                        isLoading ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creando...</> : <><i className="bi bi-plus-circle me-2"></i>Crear categoría</>
                                    }                                    
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AddCategorias;