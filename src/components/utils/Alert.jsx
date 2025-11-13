const Alert = props => {
    return(
        <div className="alert alert-danger text-center mt-3 mb-0 py-2"><i className={`bi bi-${props.icono}`}></i> {props.msj}</div>
    )
}

export default Alert