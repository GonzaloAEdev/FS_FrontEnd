import { Link } from "react-router"

const InformeDeUso = props => {
    const calcularPorcentaje = () => {
        if (props.usuario.plan === 'premium') return null
        return Math.min((props.mascotas.length / 10) * 100, 100)
    }

    const porcentaje = calcularPorcentaje()
    const esPremium = props.usuario.plan === 'premium'

    return (
        <div className="card shadow-sm h-100">
            <div className="card-body p-3">
                <h6 className="card-title mb-3">
                    <i className="bi bi-pie-chart-fill me-2"></i>
                    Informe de uso
                </h6>

                {esPremium ? (
                    <>
                        <div className="alert alert-success py-2 mb-2">
                            <h6 className="mb-1 small">
                                <i className="bi bi-star-fill"></i> Premium Activo
                            </h6>
                            <p className="mb-0" style={{ fontSize: '0.75rem' }}>Ilimitado</p>
                        </div>
                        <div className="text-center my-2">
                            <h3 className="text-success mb-0">{props.mascotas.length}</h3>
                            <p className="text-muted small mb-1">Mascotas</p>
                            <i className="bi bi-infinity text-success" style={{ fontSize: '2rem' }}></i>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                                <span className="text-muted small">Mascotas</span>
                                <span className="fw-bold small">{props.mascotas.length} / {10}</span>
                            </div>
                            <div className="progress" style={{ height: '20px' }}>
                                <div 
                                    className={`progress-bar ${porcentaje >= 80 ? 'bg-danger' : porcentaje >= 50 ? 'bg-warning' : 'bg-success'}`}
                                    role="progressbar" 
                                    style={{ width: `${porcentaje}%` }}
                                >
                                    <small>{porcentaje.toFixed(0)}%</small>
                                </div>
                            </div>
                        </div>

                        {porcentaje >= 80 && (
                            <div className="alert alert-warning py-2 mb-2">
                                <small><i className="bi bi-exclamation-triangle-fill me-1"></i>
                                Cerca del límite</small>
                            </div>
                        )}

                        <div className="alert alert-info py-2 mb-2">
                            <h6 className="mb-1 small">Mejorá a Premium</h6>
                            <ul className="mb-0 ps-3" style={{ fontSize: '0.75rem' }}>
                                <li>Mascotas ilimitadas</li>
                                <li>Citas ilimitadas</li>
                            </ul>
                        </div>

                        <Link to="/perfil" className="btn btn-warning btn-sm w-100">
                            <i className="bi bi-star-fill me-1"></i>
                            Actualizar
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default InformeDeUso