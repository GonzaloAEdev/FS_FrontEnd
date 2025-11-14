import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { useState } from "react"
import { api } from "../../../config"
import { logout } from "../../../utils/auth"
import { toast } from "react-toastify"
import { Spinner } from "react-bootstrap"
import Input from "../../utils/Input"

const EditarPerfil = (props) => {
    const navigate = useNavigate()
    const [cargando, setCargando] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' })

    const handleEdit = async (formData) => {
        setCargando(true)

        try {
            const res = await fetch(`${api}/usuarios/perfil`, {
                method: 'PUT',
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

            if (!res.ok) {
                const error = await res.json()
                toast.error(error.error || 'Error al actualizar el perfil')
                throw new Error('Error al actualizar el perfil')
            }

            const data = await res.json()
            props.setUsuario(data)
            toast.success('Perfil actualizado exitosamente')
        } catch (e) {
            console.error(e)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h4 className="card-title mb-4">Información personal</h4>
                <form onSubmit={handleSubmit(handleEdit)}>
                    <Input
                        clases="mb-3"
                        id="nombre"
                        label="Nombre"
                        tipo="text"
                        placeholder="Nombre"
                        error={errors.nombre}
                        register={register("nombre", {
                            required: "El nombre es requerido",
                            minLength: {
                                value: 2,
                                message: "El nombre debe tener al menos 2 caracteres"
                            }
                        })}
                    />

                    <Input
                        clases="mb-3"
                        id="apellido"
                        label="Apellido"
                        tipo="text"
                        placeholder="Apellido"
                        error={errors.apellido}
                        register={register("apellido", {
                            required: "El apellido es requerido",
                            minLength: {
                                value: 2,
                                message: "El apellido debe tener al menos 2 caracteres"
                            }
                        })}
                    />

                    <Input
                        clases="mb-3"
                        id="email"
                        label="Correo electrónico"
                        tipo="email"
                        placeholder="Correo electrónico"
                        error={errors.email}
                        register={register("email", {
                            required: "El correo es requerido",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Correo electrónico inválido"
                            }
                        })}
                    />

                    <button type="submit" className="btn btn-primary w-100" disabled={cargando}>
                        {cargando ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            <>
                                <i className="bi bi-check-circle"></i> Guardar cambios
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditarPerfil