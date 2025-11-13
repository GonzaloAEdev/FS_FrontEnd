const InputAuth = props => {
    return (
        <>
            <div className={`input-group has-validation mt-3`}>
                <span className="input-group-text"><i className={`bi bi-${props.icono}`}></i></span>
                <div className='form-floating'>
                    <input {...props.register(props.id, props.validaciones)} 
                        type={props.tipo} id={props.id} 
                        placeholder={props.label} 
                        className={`form-control ${props.error && 'is-invalid' }`} />
                    <label htmlFor={props.id}>{props.label}</label>
                </div>
            </div>
            {props.error && <p className='text-danger'>{props.error.message}</p>}
        </>
    );
}

export default InputAuth;