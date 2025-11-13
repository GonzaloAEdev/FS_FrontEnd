import { useSelector } from "react-redux";
import RowCita from "./RowCita";

const ListCitas = () => {
    const citas = useSelector((state) => state.citas.citas);

    return (
        <div className="table-responsive">
            <table className="table table-hover mb-0">
                <thead style={{
                    backgroundColor: '#f8f9fa',
                    borderBottom: '2px solid #dee2e6'
                }}>
                    <tr>
                        <th className="py-3 px-4 fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                            Mascota
                        </th>
                        <th className="py-3 px-4 fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                            Propietario
                        </th>
                        <th className="py-3 px-4 fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                            Fecha
                        </th>
                        <th className="py-3 px-4 fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                            Hora
                        </th>
                        <th className="py-3 px-4 text-center fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>
                            Estado
                        </th>
                        <th className="py-3 px-4 text-center fw-semibold text-uppercase text-muted" style={{ fontSize: '0.85rem', width: '180px' }}>
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {citas.map(cita => (
                        <RowCita
                            key={cita._id}
                            cita={cita}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListCitas;