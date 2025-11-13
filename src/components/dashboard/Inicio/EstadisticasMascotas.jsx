import { useEffect, useRef } from "react"
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const EstadisticasMascotas = (props) => {
    const chartRef = useRef(null)
    const chartInstance = useRef(null)

    useEffect(() => {
        if (!chartRef.current || props.mascotas.length === 0) return

        if (chartInstance.current) {
            chartInstance.current.destroy()
        }

        const categoriaCount = {}
        props.mascotas.forEach(mascota => {
            const categoriaNombre = mascota.categoria?.nombre || 'Sin categoría'
            categoriaCount[categoriaNombre] = (categoriaCount[categoriaNombre] || 0) + 1
        })

        const labels = Object.keys(categoriaCount)
        const data = Object.values(categoriaCount)

        const colors = [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
        ]

        const ctx = chartRef.current.getContext('2d')
        chartInstance.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Mascotas por categoría',
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Distribución de mascotas por categoría',
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
    }, [props.mascotas, props.categorias])

    if (props.mascotas.length === 0) {
        return (
            <div className="card shadow-sm h-100">
                <div className="card-body d-flex align-items-center justify-content-center">
                    <p className="text-muted mb-0">No hay mascotas registradas para mostrar estadísticas</p>
                </div>
            </div>
        )
    }

    return (
        <div className="card shadow-sm h-100">
            <div className="card-body">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    )
}

export default EstadisticasMascotas