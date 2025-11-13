const Estadistica = props => {
    return (
        <div className="col-md-3 mb-3">
            <div className="card shadow-sm border-0 h-100">
                <div className="card-body text-center">
                    <i className={`bi ${props.icono} text-${props.color}`} style={{ fontSize: '2.5rem' }}></i>
                    <h3 className="mt-3 mb-0">{props.valor}</h3>
                    <p className="text-muted mb-0">{props.texto}</p>
                </div>
            </div>
        </div>
    )
}

export default Estadistica