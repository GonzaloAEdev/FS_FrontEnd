

const MostrarCitas = props => {
    if (props.citas.length === 0) {
        return (<h4 className='text-center'>Todavía no hay citas agendadas</h4>)
    }
    return (
        <table className="table table-hover" style={{ tableLayout: 'fixed' }}>
            <thead>
                <tr className="text-center">
                    <th>Mascota</th>
                    <th>Fecha</th>
                    <th>Motivo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {props.citas.map((cita) => (
                    <tr className="text-center align-middle" key={cita._id}>
                        <td>{cita.mascota.nombre}</td>
                        <td>{new Date(cita.fecha).toLocaleDateString('es-ES')}</td>
                        <td className="text-truncate" style={{ maxWidth: '200px' }} title={cita.motivo}>{cita.motivo}</td>
                        <td>{cita.estado}</td>
                        <td>
                            <button className="btn btn-danger btn-sm" onClick={() => props.handleDelete(cita._id, cita.mascota.nombre)} disabled={props.eliminado === cita._id || cita.estado === 'cancelada' || cita.estado === 'finalizada'}>
                                                            {
                                {props.eliminado === cita._id ? (<> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> </>) : ('Cancelar')}
                            }
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default MostrarCitas