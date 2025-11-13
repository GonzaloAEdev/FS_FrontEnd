import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormAuth from "../components/auth/FormAuth";
import { useForm } from "react-hook-form";
import { api } from "../config";
import { login } from "../utils/auth"
import './Auth.css'

const Registro = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/')
        }
    }, [])

    const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({ mode: 'onChange' })
    const [error, setGlobalError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSignup = formData => {
        const { ['password-confirm']:_ , ...formDataSinPsw } = formData
        setLoading(true)
        fetch(`${api}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataSinPsw)
        }).then(res => {
            if (res.ok) return res.json()

            if (res.status === 409) {
                setError('email', {
                    type: 'manual',
                    message: 'El email ya está en uso'
                })
                return
            }

            if (res.status >= 400 || res.status <= 499) throw new Error('Error al registrarse')

            if (res.status === 500) throw new Error('Error interno del servidor')
        }).then(data => {
            login(data.token, data.usuario, navigate);
        }).catch((e) => {
            setGlobalError({
                icono: 'x-circle',
                msj: e.message || 'Error al registrarse'
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    const inputs = [
        {
            icono: "person",
            tipo: "text",
            id: "nombre",
            label: "Nombre",
            validaciones: {
                required: "El nombre es obligatorio"
            }
        },
        {
            icono: "person-fill",
            tipo: "text",
            id: "apellido",
            label: "Apellido",
            validaciones: {
                required: "El apellido es obligatorio"
            }
        },
        {
            icono: "envelope",
            tipo: "email",
            id: "email",
            label: "Correo electrónico",
            validaciones: {
                required: 'El correo electrónico es obligatorio',
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Tenes que ingresar un correo válido'
                }
            }
        },
        {
            icono: "lock-fill",
            tipo: "password",
            id: "password",
            label: "Contraseña",
            validaciones: {
                required: 'La contraseña es obligatoria'
            }
        },
        {
            icono: "lock",
            tipo: "password",
            id: "password-confirm",
            label: "Confirmar contraseña",
            validaciones: {
                required: "Tenes que confirmar la contraseña",
                validate: value => value === password.value || "Las contraseñas no coinciden"
            }
        }
    ]

    const enlace = {
        pregunta: "¿Ya tenes una cuenta?",
        url: "/login",
        texto: "Inicia sesión"
    }

    return (
        <FormAuth
            icono="heart-pulse-fill" titulo="Registro" subtitulo="Gestiona las citas de tus mascotas de manera fácil y rápida"
            inputs={inputs} error={error}
            enlace={enlace}
            spinner={loading}
            deshabilitado={!isValid}
            submit={handleSubmit(handleSignup)} register={register} errores={errors} />
    )
}

export default Registro;