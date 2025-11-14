import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { useState } from "react"
import { api } from "../../../config"
import { logout } from "../../../utils/auth"
import { toast } from "react-toastify"
import { Spinner } from "react-bootstrap"
import Input from "../../utils/Input"

const EditarPassword = () => {
    const navigate = useNavigate()
    const [cargando, setCargando] = useState(false)

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ mode: 'onBlur' })

    const passwordNueva = watch('passwordNueva')

    const handleChangePassword = async (formData) => {
        setCargando(true)

        try {
            const res = await fetch(`${api}/usuarios/perfil`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    passwordActual: formData.passwordActual,
                    passwordNueva: formData.passwordNueva
                })
            })

            if (res.status === 401) {
                const error = await res.json()
                if (error.error === 'La contraseña actual es incorrecta.') {
                    toast.error(error.error)
                } else {
                    logout(navigate)
                }
                return
            }

            if (!res.ok) {
                const error = await res.json()
                toast.error(error.error || 'Error al actualizar la contraseña')
                throw new Error('Error al actualizar la contraseña')
            }

            toast.success('Contraseña actualizada exitosamente')
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
                <h4 className="card-title mb-4">Cambiar contraseña</h4>
                <form onSubmit={handleSubmit(handleChangePassword)}>
                    <Input
                        clases="mb-3"
                        id="passwordActual"
                        label="Contraseña actual"
                        tipo="password"
                        placeholder="Contraseña actual"
                        error={errors.passwordActual}
                        register={register("passwordActual", {
                            required: "La contraseña actual es requerida"
                        })}
                    />

                    <Input
                        clases="mb-3"
                        id="passwordNueva"
                        label="Contraseña nueva"
                        tipo="password"
                        placeholder="Contraseña nueva"
                        error={errors.passwordNueva}
                        register={register("passwordNueva", {
                            required: "La contraseña nueva es requerida",
                            minLength: {
                                value: 6,
                                message: "La contraseña debe tener al menos 6 caracteres"
                            }
                        })}
                    />

                    <Input
                        clases="mb-3"
                        id="passwordConfirmar"
                        label="Confirmar contraseña"
                        tipo="password"
                        placeholder="Confirmar contraseña"
                        error={errors.passwordConfirmar}
                        register={register("passwordConfirmar", {
                            required: "Debes confirmar la contraseña",
                            validate: (value) => value === passwordNueva || "Las contraseñas no coinciden"
                        })}
                    />

                    <button type="submit" className="btn btn-primary w-100" disabled={cargando}>
                        <>                      
                        {cargando ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            <>
                                <i className="bi bi-key"></i> Cambiar contraseña
                            </>
                        )}
                        </>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditarPassword