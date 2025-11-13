export const login = (token, usuario, navigate) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    navigate('/');
}

export const logout = navigate => {
    localStorage.clear();
    navigate('/login');
}