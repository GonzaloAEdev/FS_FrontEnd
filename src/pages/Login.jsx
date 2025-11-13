import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormAuth from "../components/auth/FormAuth";
import { useForm } from "react-hook-form";
import { api } from "../config";
import { login } from "../utils/auth"
import './Auth.css'

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/')
        }
    }, [])

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' })
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleLogin = formData => {
        setCargando(true)
        fetch(`${api}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(res => {
            if (res.ok) return res.json()

            if (res.status === 401 || res.status === 400) throw new Error('Credenciales incorrectas')

            if (res.status === 500) throw new Error('Error interno del servidor')
        }).then(data => {
            login(data.token, data.usuario, navigate);
        }).catch((e) => {
            setError({
                icono: 'x-circle',
                msj: e.message || 'Error al iniciar sesión'
            })
        }).finally(() => {
            setCargando(false)
        })
    }

    const inputs = [
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
            icono: "lock",
            tipo: "password",
            id: "password",
            label: "Contraseña",
            validaciones: {
                required: 'La contraseña es obligatoria'
            }
        }
    ]

    const enlace = {
        pregunta: "¿No tenes cuenta?",
        url: "/signup",
        texto: "Registrate acá"
    }

    return (
        <FormAuth
            icono="heart-pulse-fill" titulo="Iniciar sesión" subtitulo="Ingresa tus credenciales para acceder al sistema"
            inputs={inputs} error={error}
            enlace={enlace}
            spinner={cargando}
            deshabilitado={!isValid || cargando}
            submit={handleSubmit(handleLogin)} register={register} errores={errors} />
    )
}

export default Login;