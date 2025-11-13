import { useEffect, useRef } from "react"
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const EstadisticasCitas = props => {
    const chartRef = useRef(null)
    const chartInstance = useRef(null)

    useEffect(() => {
        if (!chartRef.current || props.citas.length === 0) return

        if (chartInstance.current) {
            chartInstance.current.destroy()
        }

        const estadoCount = {
            'pendiente': 0,
            'aceptada': 0,
            'cancelada': 0,
            'rechazada': 0,
            'finalizada': 0
        }

        props.citas.forEach(cita => {
            if (estadoCount.hasOwnProperty(cita.estado)) {
                estadoCount[cita.estado]++
            }
        })

        const labels = ['Pendiente', 'Aceptada', 'Cancelada', 'Rechazada', 'Finalizada']
        const data = [
            estadoCount.pendiente,
            estadoCount.aceptada,
            estadoCount.cancelada,
            estadoCount.rechazada,
            estadoCount.finalizada
        ]

        const ctx = chartRef.current.getContext('2d')
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cantidad de citas',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(128, 128, 128, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(128, 128, 128, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2.5,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Estado de las citas',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        })

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy()
            }
        }
    }, [props.citas])

    if (props.citas.length === 0) {
        return (
            <div className="card shadow-sm">
                <div className="card-body d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                    <p className="text-muted mb-0">No hay citas registradas para mostrar estadísticas</p>
                </div>
            </div>
        )
    }

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    )
}

export default EstadisticasCitas