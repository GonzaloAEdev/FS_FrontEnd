import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../config";
import { logout } from "../../utils/auth";
import { deleteCategoria } from "../../redux/features/categoriasSlice";

const RowCategoria = ({ id, nombreCategoria }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleOnCLick = async () => {
        
        try {
            const res = await fetch(`${api}/categorias/${id}`, {
                method: 'DELETE',
                headers: {
                    'authorization': `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.status === 401) {
                logout(navigate);
                return;
            }

            if (!res.ok) {
                throw new Error('Error al eliminar la categoria');
            }

            dispatch(deleteCategoria(id));
            toast.success('Categoría eliminada exitosamente');
        } catch (e) {
            console.error('Error:', e.message);
            toast.error('No se pudo eliminar la categoria \n' + e.message);
        }
    };

    return (
        <tr>
            <td>
                <p className="py-1 px-4 mb-0 text-muted">
                    {nombreCategoria}
                </p>
            </td>
            <td>
                <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleOnCLick}
                >Eliminar</button>
            </td>
        </tr>
    )
}
export default RowCategoria;