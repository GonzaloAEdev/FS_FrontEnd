import { Link } from "react-router";
import Alert from "../utils/Alert";
import InputAuth from "./InputAuth";
import { Spinner } from "react-bootstrap";

const FormAuth = props => {
    return (
        <form className='bg-light rounded-5 shadow-lg p-4' onSubmit={props.submit}>
            <i className={`bi bi-${props.icono} d-block text-center`} style={{fontSize: '3rem'}}></i>
            <h3 className='text-center'>{props.titulo}</h3>
            <p className="text-center text-secondary text-opacity-75" style={{fontSize: '.9rem'}}>{props.subtitulo}</p>

            {props.inputs.map((input) => (
                <InputAuth key={input.id} icono={input.icono} tipo ={input.tipo} id={input.id} label={input.label} 
                register={props.register} validaciones={input.validaciones} error={props.errores[input.id]} />
            ))}

            {props.error && <Alert icono={props.error.icono} msj={props.error.msj} />}

            <button type="submit" className='btn btn-primary mt-3 w-100' disabled={props.deshabilitado}>
                {props.spinner ? (<> <Spinner animation="border" size="sm" /> </>) : props.titulo}
            </button>

            <p className='text-center mt-3'>{props.enlace.pregunta} <Link to={props.enlace.url}>{props.enlace.texto}</Link></p>
        </form>
    )
}

export default FormAuth;