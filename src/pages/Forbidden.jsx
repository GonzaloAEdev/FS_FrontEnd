import { Link } from "react-router-dom";
import './Auth.css';

const Forbidden = () => {
    return (
        <div className="bg-light rounded-5 shadow-lg p-5 text-center">
            <i className="bi bi-shield-x-fill d-block text-danger" style={{ fontSize: '5rem' }}></i>
            <h1 className="display-1 fw-bold text-primary mt-3">403</h1>
            <h3 className="mb-3">Acceso prohibido</h3>
            <p className="text-secondary mb-4">
                No tenés permisos para acceder a esta página.
            </p>
            <Link to="/" className="btn btn-primary btn-lg">
                <i className="bi bi-house-fill me-2"></i>
                Volver al inicio
            </Link>
        </div>
    );
}

export default Forbidden;