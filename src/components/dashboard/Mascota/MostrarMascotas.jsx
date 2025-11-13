

const MostrarMascotas = props => {
    if (props.mascotas.length === 0) {
        return (<h4 className='text-center'>Todavía no hay mascotas registradas</h4>)
    }
    return (
        <table className="table table-hover" style={{ tableLayout: 'fixed' }}>
            <thead>
                <tr className="text-center">
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Fecha de nacimiento</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {props.mascotas.map((mascota) => (
                    <tr className="text-center align-middle" key={mascota._id}>
                        <td className="text-center"><img src={mascota.foto || null} alt={mascota.nombre} className="rounded-5" style={{ height: '5rem' }} /></td>
                        <td>{mascota.nombre}</td>
                        <td>{new Date(mascota.fechaNacimiento).toLocaleDateString('es-ES')}</td>
                        <td>{mascota.categoria.nombre}</td>
                        <td>
                            <button className="btn"><i className="bi bi-pencil"></i></button>
                            <button className="btn" onClick={() => props.handleDelete(mascota._id, mascota.nombre)} disabled={props.eliminado === mascota._id}>
                                                            {
                                {props.eliminado === mascota._id ? (<> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> </>) : (<> <i className="bi bi-trash"></i> </>)}
                            }
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default MostrarMascotas