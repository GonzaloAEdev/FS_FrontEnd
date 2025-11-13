import { useOutletContext } from "react-router"
import CrearCita from "./Cita/CrearCita"
import FiltrosCitas from "./Cita/FiltrosCitas"

export const Cita = props => {
    const { mascotas } = useOutletContext()
    return (
        <>
            <CrearCita mascotas={mascotas} />
            <FiltrosCitas />
        </>
    )
}

export default Cita