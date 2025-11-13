import Estadistica from "./Estadistica"

const EstadisticasGenerales = (props) => {
    const citasPendientes = props.citas.filter(c => c.estado === 'pendiente').length
    
    const citasProximas = props.citas.filter(c => {
        const fecha = new Date(c.fecha)
        const hoy = new Date()
        const semana = new Date()
        semana.setDate(hoy.getDate() + 7)
        return fecha >= hoy && fecha <= semana && c.estado !== 'cancelada'
    }).length

    const estadisticas = [
        {
            icono: 'bi-heart-fill',
            color: 'primary',
            valor: props.mascotas.length,
            texto: 'Mascotas registradas'
        },
        {
            icono: 'bi-calendar-check',
            color: 'success',
            valor: props.citas.length,
            texto: 'Citas totales'
        },
        {
            icono: 'bi-clock',
            color: 'warning',
            valor: citasPendientes,
            texto: 'Citas pendientes'
        },
        {
            icono: 'bi-calendar2-week',
            color: 'info',
            valor: citasProximas,
            texto: 'Próximos 7 días'
        }
    ]

    return (
        <div className="row">
            {estadisticas.map((estadistica, index) => (
                <Estadistica 
                    key={index}
                    icono={estadistica.icono}
                    color={estadistica.color}
                    valor={estadistica.valor}
                    texto={estadistica.texto}
                />
            ))}
        </div>
    )
}

export default EstadisticasGenerales