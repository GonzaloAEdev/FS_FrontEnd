import { Link } from "react-router-dom";
import './Auth.css';

const NotFound = () => {
    return (
        <div className="bg-light rounded-5 shadow-lg p-5 text-center">
            <i className="bi bi-exclamation-triangle-fill d-block text-warning" style={{ fontSize: '5rem' }}></i>
            <h1 className="display-1 fw-bold text-primary mt-3">404</h1>
            <h3 className="mb-3">Página no encontrada</h3>
            <p className="text-secondary mb-4">
                La página que estás buscando no existe o ha sido movida.
            </p>
            <Link to="/" className="btn btn-primary btn-lg">
                <i className="bi bi-house-fill me-2"></i>
                Volver al inicio
            </Link>
        </div>
    );
}

export default NotFound;