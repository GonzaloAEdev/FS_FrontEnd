import { useDispatch } from "react-redux"
import Input from "../../utils/Input"
import Select from "../../utils/Select"
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { logout } from "../../../utils/auth";
import { useForm } from "react-hook-form";
import { api } from "../../../config";
import { addCita } from "../../../redux/features/citasSlice"
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const CrearCita = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            logout(navigate);
            return;
        }
    }, [])

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onBlur' })
    const [cargando, setCargando] = useState(false);

    const handleCreate = async formData => {
        setCargando(true);

        try {
            const res = await fetch(`${api}/citas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            })

            if (res.status === 401) {
                logout(navigate);
                return;
            }

            if (!res.ok) {
                throw new Error('Error al agendar la cita')
            }

            const data = await res.json();
            dispatch(addCita(data))
            reset()
        } catch (e) {
            console.error(e);
        } finally {
            setCargando(false);
        }
    }

    const options = props.mascotas.map((mascota) => ({
        value: mascota._id,
        texto: mascota.nombre
    }))

    return (
        <>
            <form className="row align-items-end mb-3" onSubmit={handleSubmit(handleCreate)}>
                <Input clases="col-md-6" id="fecha" label="Fecha de la cita" tipo="date" error={errors.fecha}
                    register={register("fecha", {
                        required: "Debes seleccionar una fecha",
                        validate: (value) => {
                            const fecha = new Date(value)
                            const hoy = new Date()
                            if (fecha <= hoy) {
                                return "La fecha tiene que ser en el futuro"
                            }
                            return true
                        }
                    })} />
                <Select clases="col-md-6" id="mascota" label="Mascota" placeholder="Selecciona una mascota" options={options} error={errors.mascota}
                    register={register("mascota", {
                        required: "Debes seleccionar una mascota",
                        validate: (value) => value !== "0" && value !== "" || "Debes seleccionar una mascota"
                    })} />

                <div className="col-md-12 mb-3">
                    <label htmlFor="motivo" className="form-label">Motivo</label>
                    <textarea
                        id="motivo"
                        className={`form-control ${errors.motivo ? 'is-invalid' : ''}`}
                        placeholder="Motivo de la cita"
                        rows="3"
                        {...register("motivo", {
                            required: "Debes indicar el motivo de la cita"
                        })}
                    ></textarea>
                    {errors.motivo && (
                        <div className="invalid-feedback d-block">
                            {errors.motivo.message}
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary mb-3 col-12" disabled={cargando}>
                    {cargando ? (<> <Spinner animation="border" size="sm" /> </>) : 'Agendar cita'}
                </button>
            </form>
        </>
    )
}

export default CrearCita