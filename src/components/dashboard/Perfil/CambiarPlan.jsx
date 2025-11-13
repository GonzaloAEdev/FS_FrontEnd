import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { useState } from "react"
import { api } from "../../../config"
import { logout } from "../../../utils/auth"
import { toast } from "react-toastify"
import { Spinner } from "react-bootstrap"
import Select from "../../utils/Select"

const metodosPago = [
    { value: 'credito', texto: 'Tarjeta de crédito' },
    { value: 'debito', texto: 'Tarjeta de débito' }
]

const CambiarPlan = (props) => {
    const navigate = useNavigate()
    const [cargando, setCargando] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onBlur' })

    const handlePagar = async (formData) => {
        setCargando(true)

        try {
            const res = await fetch(`${api}/usuarios/pagar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            })

            if (res.status === 401) {
                logout(navigate)
                return
            }

            if (res.status === 400) {
                const error = await res.json()
                toast.info(error.error)
                return
            }

            if (!res.ok) {
                const error = await res.json()
                toast.error(error.error || 'Error al procesar el pago')
                throw new Error('Error al procesar el pago')
            }

            const data = await res.json()
            props.setUsuario(data.usuario)
            localStorage.setItem('token', data.token)
            toast.success('¡Pago procesado exitosamente! Ahora eres usuario Premium')
            reset()
        } catch (e) {
            console.error(e)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h4 className="card-title mb-3">Plan actual</h4>
                <div className="alert alert-info d-flex align-items-center justify-content-between">
                    <div>
                        <h5 className="mb-1">
                            <i className={`bi ${props.usuario?.plan === 'premium' ? 'bi-star-fill text-warning' : 'bi-person-fill'}`}></i>{' '}
                            Plan {props.usuario?.plan === 'premium' ? 'Premium' : 'Gratuito'}
                        </h5>
                        {props.usuario?.plan === 'premium' && props.usuario?.fechaPago && (
                            <small className="text-muted">
                                Desde: {new Date(props.usuario.fechaPago).toLocaleDateString('es-ES')}
                            </small>
                        )}
                    </div>
                    {props.usuario?.plan !== 'premium' && (
                        <span className="badge bg-primary">Actualizable</span>
                    )}
                </div>

                {props.usuario?.plan !== 'premium' && (
                    <>
                        <h5 className="mt-4 mb-3">Mejorar a Premium</h5>
                        <div className="alert alert-light border">
                            <h6>Beneficios del plan Premium:</h6>
                            <ul className="mb-0">
                                <li>Mascotas ilimitadas</li>
                                <li>Soporte prioritario</li>
                            </ul>
                        </div>

                        <form onSubmit={handleSubmit(handlePagar)} className="mt-3">
                            <Select
                                clases="mb-3"
                                id="metodoPago"
                                label="Método de pago"
                                placeholder="Selecciona un método de pago"
                                options={metodosPago}
                                error={errors.metodoPago}
                                register={register("metodoPago", {
                                    required: "Debes seleccionar un método de pago",
                                    validate: (value) => value !== "0" && value !== "" || "Debes seleccionar un método de pago"
                                })}
                            />

                            <button type="submit" className="btn btn-warning w-100" disabled={cargando}>
                                {cargando ? (
                                                                    {
                                    <> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando... </>
                                }
                                ) : (
                                    <> <i className="bi bi-star-fill"></i> Actualizar a Premium </>
                                )}
                            </button>
                        </form>
                    </>
                )}

                {props.usuario?.plan === 'premium' && (
                    <div className="alert alert-success mt-3">
                        <i className="bi bi-check-circle-fill"></i> Ya estás disfrutando de todos los beneficios Premium
                    </div>
                )}
            </div>
        </div>
    )
}

export default CambiarPlan