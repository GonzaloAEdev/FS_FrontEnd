import { useDispatch } from "react-redux"
import Input from "../../utils/Input"
import Select from "../../utils/Select"
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { api, cloudinary } from "../../../config";
import { logout } from "../../../utils/auth";
import { useForm } from "react-hook-form";
import { addMascota } from "../../../redux/features/mascotasSlice";
import { toast } from "react-toastify";
import Alert from "../../utils/Alert";

const CrearMascota = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            logout(navigate);
            return;
        }
    }, [])

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({ mode: 'onBlur' })
    const [cargando, setCargando] = useState(false);
    const [file, setFile] = useState(null);

    const handleUpload = (e) => {
        setFile(e.target.files[0])
    }

    const handleCreate = async formData => {
        setCargando(true)

        if (file) {
            const formDataImg = new FormData();
            formDataImg.append("upload_preset", "ObligatorioFS")
            formDataImg.append("file", file)

            try {
                const res = await fetch(`${cloudinary}`, { method: 'POST', body: formDataImg })

                if (!res.ok) {
                    toast.error("Error al subir la foto de perfil");
                    throw new Error();
                }

                const data = await res.json()
                formData.foto = data.secure_url
            } catch (e) {
                console.error(e)
            }
        }

        try {
            const res = await fetch(`${api}/mascotas`, {
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

            if (!res.ok) {
                throw new Error('Error al cargar mascotas')
            }

            const data = await res.json()
            dispatch(addMascota(data))
            reset()
        } catch (e) {
            console.error(e);
        } finally {
            setCargando(false)
        }
    }

    return (
        <>
            <form className="row align-items-end mb-3" onSubmit={handleSubmit(handleCreate)}>
                <Input clases="col-md-2" id="nombre" label="Nombre" tipo="text" placeholder="Nombre" error={errors.nombre}
                    register={register("nombre", {
                        required: "La mascota debe tener un nombre"
                    })} />
                <Input clases="col-md-2" id="fecha" label="Fecha de nacimiento" tipo="date" error={errors.fechaNacimiento}
                    register={register("fechaNacimiento", {
                        required: "La mascota debe tener una fecha de nacimiento",
                        validate: (value) => {
                            const fecha = new Date(value)
                            const hoy = new Date()
                            if (fecha > hoy) {
                                return "La fecha no puede ser en el futuro"
                            }
                            return true
                        }
                    })} />
                <Select clases="col-md-3" id="categoria" label="Categoría" placeholder="Selecciona una categoría" options={props.options} error={errors.categoria}
                    register={register("categoria", {
                        required: "Debes seleccionar una categoría",
                        validate: (value) => value !== "0" && value !== "" || "Debes seleccionar una categoría"
                    })} />
                <Input clases="col-md-3" id="foto" label="Foto de perfil" tipo="file" handleOnChange={handleUpload} />

                <button type='submit' className='btn btn-primary w-100 p-3' disabled={cargando}>
                    {cargando ? (<> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Agregando... </>) : 'Agregar mascota'}
                </button>
            </form>
        </>
    )
}

export default CrearMascota