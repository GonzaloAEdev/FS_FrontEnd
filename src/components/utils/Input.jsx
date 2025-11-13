const Input = props => {
    return(
        <div className={`${props.clases ? `${props.clases} has-validation mb-3` : 'has-validation mb-3'}`}>
            <label htmlFor={props.id}>{props.label}</label>
            <input {...props.register}  type={props.tipo} id={props.id} className='form-control' placeholder={props.placeholder ? props.placeholder : ''} onChange={props.handleOnChange} />
            <div className='invalid-feedback'>{props.error ? props.error.mensaje : ''}</div>
        </div>
    )
}

export default Input